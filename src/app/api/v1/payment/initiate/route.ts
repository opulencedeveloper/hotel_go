import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { connectDB } from "@/lib/server/utils/db";
import Plan from "@/lib/server/plan/entity";
import { licenseKeyService } from "@/lib/server/license-key/service";
import { FLUTTERWAVE_SUPPORTED_CURRENCIES, isFlutterwaveSupportedCurrency } from "@/lib/utils/flutterwave-currencies";
import { logger } from "@/lib/utils/logger";

interface InitiatePaymentBody {
  planId: string;
  email: string;
  name: string;
  currency: string;
  billingPeriod: 'yearly' | 'quarterly';
}

async function handler(request: Request) {
  try {
    await connectDB();

    const body: InitiatePaymentBody = await request.json();
    const { planId, name, email, currency, billingPeriod } = body;

    // Validate input
    if (!planId || !name || !email || !currency || !billingPeriod) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "planId, name, email, currency, and billingPeriod are required",
        data: null,
      });
    }

    // Validate name
    if (!name.trim() || name.trim().length < 2) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Name must be at least 2 characters long",
        data: null,
      });
    }

    // Validate billing period
    if (billingPeriod !== 'yearly' && billingPeriod !== 'quarterly') {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "billingPeriod must be 'yearly' or 'quarterly'",
        data: null,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Invalid email format",
        data: null,
      });
    }

    // Validate currency is supported by Flutterwave
    const normalizedCurrency = currency.toUpperCase();
    if (!isFlutterwaveSupportedCurrency(normalizedCurrency)) {
      logger.warn('Unsupported currency attempted', {
        currency: normalizedCurrency,
        supportedCurrencies: FLUTTERWAVE_SUPPORTED_CURRENCIES,
      });
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: `Currency ${normalizedCurrency} is not supported. Supported currencies: ${FLUTTERWAVE_SUPPORTED_CURRENCIES.join(', ')}`,
        data: null,
      });
    }

    // Find the plan
    const plan = await Plan.findById(planId).lean();
    if (!plan) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "Plan not found",
        data: null,
      });
    }

    // Check if plan has pricing (Enterprise plans might not have pricing)
    if (!plan.price || (!plan.price.quarterly && !plan.price.yearly)) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "This plan does not have pricing. Please contact sales.",
        data: null,
      });
    }

    // Get price based on selected billing period from frontend
    let usdPrice = 0;
    
    if (billingPeriod === 'yearly') {
      usdPrice = plan.price?.yearly || 0;
      if (!usdPrice) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Yearly pricing is not available for this plan",
          data: null,
        });
      }
    } else {
      usdPrice = plan.price?.quarterly || 0;
      if (!usdPrice) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Quarterly pricing is not available for this plan",
          data: null,
        });
      }
    }

    logger.info('Payment initiation started', {
      planName: plan.name,
      planId,
      billingPeriod,
      usdPrice,
      currency: normalizedCurrency,
      name: name.trim(),
      email: email.substring(0, 3) + '***', // Partially mask email for privacy
    });

    // Convert price to target currency using Flutterwave
    let convertedAmount = usdPrice;
    
    // Use normalized currency for API calls
    const targetCurrency = normalizedCurrency;
    
    if (targetCurrency !== 'USD') {
      const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;

      if (flutterwaveKey) {
        try {
          logger.info('Converting currency via Flutterwave', {
            from: 'USD',
            to: targetCurrency,
            amount: usdPrice,
          });
          
          // Fetch exchange rate using GET request to transfers/rates endpoint
          // Flutterwave uses GET with query parameters, not POST
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout (optimized for serverless)
          
          const rateResponse = await fetch(
            `https://api.flutterwave.com/v3/transfers/rates?amount=${usdPrice}&destination_currency=${targetCurrency}&source_currency=USD`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${flutterwaveKey}`,
                'Content-Type': 'application/json',
              },
              signal: controller.signal,
            }
          );
          
          clearTimeout(timeoutId);

          // Check content type before parsing JSON
          const contentType = rateResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const errorText = await rateResponse.text();
            logger.error('Flutterwave API returned non-JSON response', {
              contentType,
              currency: targetCurrency,
              responsePreview: errorText.substring(0, 200),
            });
            throw new Error(`Flutterwave API returned ${contentType || 'unknown content type'}`);
          }

          if (rateResponse.ok) {
            const rateData = await rateResponse.json();
            
            if (rateData.status === 'success' && rateData.data) {
              // Flutterwave rates API can return either:
              // 1. The converted amount (if source.amount matches our USD price)
              // 2. The exchange rate (if source.amount is 1)
              
              if (rateData.data.source && rateData.data.destination) {
                const sourceAmount = parseFloat(String(rateData.data.source.amount));
                const destAmount = parseFloat(String(rateData.data.destination.amount));
                
                // Case 1: Source matches our USD price → destination is the converted amount
                if (Math.abs(sourceAmount - usdPrice) < 0.01) {
                  convertedAmount = destAmount;
                  logger.info('Currency conversion using direct amount', {
                    source: sourceAmount,
                    destination: destAmount,
                    currency: targetCurrency,
                  });
                }
                // Case 2: Source is 1 USD → destination is the exchange rate, multiply by USD price
                else if (Math.abs(sourceAmount - 1) < 0.01) {
                  const exchangeRate = destAmount;
                  convertedAmount = usdPrice * exchangeRate;
                  logger.info('Currency conversion using exchange rate', {
                    rate: exchangeRate,
                    currency: targetCurrency,
                  });
                }
                // Case 3: Calculate rate from source/destination ratio
                else if (sourceAmount > 0 && destAmount > 0) {
                  const exchangeRate = destAmount / sourceAmount;
                  convertedAmount = usdPrice * exchangeRate;
                  logger.info('Currency conversion using calculated rate', {
                    source: sourceAmount,
                    destination: destAmount,
                    rate: exchangeRate,
                    currency: targetCurrency,
                  });
                } else {
                  logger.error('Invalid source/destination amounts from Flutterwave', {
                    source: sourceAmount,
                    destination: destAmount,
                    currency: targetCurrency,
                  });
                  throw new Error('Invalid exchange rate data from Flutterwave');
                }
              }
              // Fallback: Use rate field if available
              else if (rateData.data.rate) {
                const exchangeRate = parseFloat(String(rateData.data.rate));
                convertedAmount = usdPrice * exchangeRate;
                logger.info('Currency conversion using rate field', {
                  rate: exchangeRate,
                  currency: targetCurrency,
                });
              }
              // Last resort: destination.amount only (treat as converted amount if reasonable, otherwise as rate)
              else if (rateData.data.destination && rateData.data.destination.amount !== undefined) {
                const destAmount = parseFloat(String(rateData.data.destination.amount));
                
                // Heuristic: If destination amount is much smaller than expected converted amount, it's likely a rate
                // For NGN with $1000 USD, expected amount is ~1,500,000. If we get 1500, it's a rate.
                const expectedMin = usdPrice * 100; // Minimum expected for major currencies
                
                if (destAmount < expectedMin && destAmount > 0 && destAmount < 10000) {
                  // This looks like an exchange rate, not a converted amount
                  convertedAmount = usdPrice * destAmount;
                  logger.info('Currency conversion using destination as rate', {
                    destination: destAmount,
                    currency: targetCurrency,
                  });
                } else {
                  convertedAmount = destAmount;
                  logger.info('Currency conversion using destination as amount', {
                    destination: destAmount,
                    currency: targetCurrency,
                  });
                }
              } else {
                logger.error('Could not extract conversion from Flutterwave response', {
                  currency: targetCurrency,
                  hasSource: !!rateData.data.source,
                  hasDestination: !!rateData.data.destination,
                  hasRate: !!rateData.data.rate,
                });
                throw new Error('Unable to extract exchange rate from Flutterwave response');
              }

              // Validate the converted amount makes sense
              if (!convertedAmount || isNaN(convertedAmount) || convertedAmount <= 0 || !isFinite(convertedAmount)) {
                logger.error('Invalid converted amount from Flutterwave', {
                  convertedAmount,
                  currency: targetCurrency,
                  usdPrice,
                });
                return utils.customResponse({
                  status: 500,
                  message: MessageResponse.Error,
                  description: "Failed to convert currency amount",
                  data: null,
                });
              }

              // Round based on currency type (only Flutterwave-supported currencies)
              // Currencies that typically don't use decimal places
              const wholeNumberCurrencies = ['NGN', 'JPY', 'KRW', 'VND', 'UGX', 'TZS', 'GHS', 'KES', 'ZAR', 'RWF', 'ETB', 'ZMW', 'BWP', 'MZN', 'AOA', 'SLL', 'GMD', 'LRD', 'SLE', 'MWK'];
              if (wholeNumberCurrencies.includes(targetCurrency)) {
                convertedAmount = Math.round(convertedAmount);
              } else {
                convertedAmount = Math.round(convertedAmount * 100) / 100;
              }
              
              logger.info('Currency conversion completed', {
                from: 'USD',
                to: targetCurrency,
                originalAmount: usdPrice,
                convertedAmount,
              });
            } else {
              logger.error('Flutterwave rate API returned unsuccessful response', {
                status: rateData.status,
                message: rateData.message,
                currency: targetCurrency,
              });
              throw new Error(`Flutterwave API returned unsuccessful response: ${rateData.message || 'Unknown error'}`);
            }
          } else {
            // Try to get error message
            let errorText = '';
            try {
              const contentType = rateResponse.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const errorData = await rateResponse.json();
                errorText = JSON.stringify(errorData);
              } else {
                errorText = await rateResponse.text();
              }
            } catch (e) {
              errorText = `Status ${rateResponse.status}: ${rateResponse.statusText}`;
            }
            
            logger.error('Flutterwave rate API error response', {
              status: rateResponse.status,
              statusText: rateResponse.statusText,
              currency: targetCurrency,
              errorPreview: errorText.substring(0, 200),
            });
            
            throw new Error(`Flutterwave API error: ${rateResponse.status}`);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Handle timeout specifically
          if (error instanceof Error && error.name === 'AbortError') {
            logger.error('Flutterwave API request timeout', {
              currency: targetCurrency,
              timeout: 8000,
            });
            return utils.customResponse({
              status: 504,
              message: MessageResponse.Error,
              description: "Request to Flutterwave API timed out. Please try again.",
              data: null,
            });
          }
          
          logger.error('Error fetching exchange rate from Flutterwave', {
            currency: targetCurrency,
            error: errorMessage,
          });
          
          // No fallback - only use Flutterwave
          return utils.customResponse({
            status: 500,
            message: MessageResponse.Error,
            description: `Failed to convert currency via Flutterwave: ${errorMessage}. Please try again.`,
            data: null,
          });
        }
      } else {
        logger.warn('Flutterwave API key not found', {
          currency: targetCurrency,
        });
        return utils.customResponse({
          status: 500,
          message: MessageResponse.Error,
          description: "Flutterwave API key not configured",
          data: null,
        });
      }
    }

    logger.info('Final payment amount calculated', {
      amount: convertedAmount,
      currency: targetCurrency,
      originalUsd: usdPrice,
    });

    // Create pending license key entry before creating payment link
    const pendingLicense = await licenseKeyService.createPendingLicense(planId, billingPeriod, email, name.trim());
    const licenseKeyId = pendingLicense._id?.toString() || pendingLicense.id?.toString() || '';
    logger.info('Pending license created', {
      licenseKeyId,
      planId,
      billingPeriod,
      name: name.trim(),
      emailMasked: email.substring(0, 3) + '***',
    });

    // Create Flutterwave payment link
    const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;

    if (!flutterwaveKey) {
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Flutterwave API key not configured",
        data: null,
      });
    }

    // Create payment link
    const paymentResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: `license_${licenseKeyId}_${Date.now()}`,
        amount: convertedAmount,
        currency: targetCurrency,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
        customer: {
          email: email,
          name: name.trim(),
        },
        meta: {
          planId: planId,
          planName: plan.name,
          originalUsdPrice: usdPrice,
          billingPeriod: billingPeriod,
          licenseKeyId: licenseKeyId,
        },
        customizations: {
          title: `HotelGO - ${plan.name} Plan`,
          description: `Payment for ${plan.name} subscription plan`,
          logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
        },
      }),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      logger.error('Flutterwave payment creation error', {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText,
        errorPreview: errorText.substring(0, 200),
        planId,
        currency: targetCurrency,
      });
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Failed to create payment link",
        data: null,
      });
    }

    const paymentData = await paymentResponse.json();

    if (paymentData.status === 'success' && paymentData.data && paymentData.data.link) {
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Payment link created successfully",
        data: {
          paymentLink: paymentData.data.link,
        },
      });
    }

    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to generate payment link",
      data: null,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error initiating payment', {
      error: errorMessage,
    });
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Internal server error",
      data: null,
    });
  }
}

export const POST = utils.withErrorHandling(handler);

