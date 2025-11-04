import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { connectDB } from "@/lib/server/utils/db";
import Plan from "@/lib/server/plan/entity";
import { licenseKeyService } from "@/lib/server/license-key/service";

interface InitiatePaymentBody {
  planId: string;
  email: string;
  currency: string;
  billingPeriod: 'yearly' | 'quarterly';
}

async function handler(request: Request) {
  try {
    await connectDB();

    const body: InitiatePaymentBody = await request.json();
    const { planId, email, currency, billingPeriod } = body;

    // Validate input
    if (!planId || !email || !currency || !billingPeriod) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "planId, email, currency, and billingPeriod are required",
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

    console.log(`💰 Payment initiation - Plan: ${plan.name}, Billing: ${billingPeriod}, USD Price: ${usdPrice}, Currency: ${currency}`);

    // Convert price to target currency using Flutterwave
    let convertedAmount = usdPrice;
    
    if (currency !== 'USD') {
      const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;

      if (flutterwaveKey) {
        try {
          console.log(`🔄 Converting USD ${usdPrice} to ${currency}...`);
          
          // Fetch exchange rate - request conversion for the full amount
          const rateResponse = await fetch('https://api.flutterwave.com/v3/rates', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${flutterwaveKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'USD',
              to: currency,
              amount: usdPrice, // Pass the full USD amount to convert
            }),
          });

          // Check content type before parsing JSON
          const contentType = rateResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const errorText = await rateResponse.text();
            console.error('❌ Flutterwave API returned non-JSON response:', errorText.substring(0, 500));
            throw new Error(`Flutterwave API returned ${contentType || 'unknown content type'}. Response: ${errorText.substring(0, 200)}`);
          }

          if (rateResponse.ok) {
            const rateData = await rateResponse.json();
            console.log('📊 Flutterwave rate API response:', JSON.stringify(rateData, null, 2));
            
            if (rateData.status === 'success' && rateData.data) {
              // Flutterwave rates API can return either:
              // 1. The converted amount (if source.amount matches our USD price)
              // 2. The exchange rate (if source.amount is 1)
              
              if (rateData.data.source && rateData.data.destination) {
                const sourceAmount = parseFloat(rateData.data.source.amount);
                const destAmount = parseFloat(rateData.data.destination.amount);
                
                console.log(`📊 Flutterwave response - Source: ${sourceAmount} USD, Destination: ${destAmount} ${currency}`);
                
                // Case 1: Source matches our USD price → destination is the converted amount
                if (Math.abs(sourceAmount - usdPrice) < 0.01) {
                  convertedAmount = destAmount;
                  console.log(`✅ Source matches USD price (${usdPrice}), using destination amount: ${convertedAmount} ${currency}`);
                }
                // Case 2: Source is 1 USD → destination is the exchange rate, multiply by USD price
                else if (Math.abs(sourceAmount - 1) < 0.01) {
                  const exchangeRate = destAmount;
                  convertedAmount = usdPrice * exchangeRate;
                  console.log(`✅ Source is 1 USD, destination (${exchangeRate}) is rate, calculated: ${usdPrice} × ${exchangeRate} = ${convertedAmount} ${currency}`);
                }
                // Case 3: Calculate rate from source/destination ratio
                else if (sourceAmount > 0 && destAmount > 0) {
                  const exchangeRate = destAmount / sourceAmount;
                  convertedAmount = usdPrice * exchangeRate;
                  console.log(`✅ Calculated rate from ratio (${exchangeRate}), calculated: ${usdPrice} × ${exchangeRate} = ${convertedAmount} ${currency}`);
                } else {
                  console.warn('⚠️ Invalid source/destination amounts');
                }
              }
              // Fallback: Use rate field if available
              else if (rateData.data.rate) {
                const exchangeRate = parseFloat(rateData.data.rate);
                convertedAmount = usdPrice * exchangeRate;
                console.log(`✅ Using rate field (${exchangeRate}), calculated: ${usdPrice} × ${exchangeRate} = ${convertedAmount} ${currency}`);
              }
              // Last resort: destination.amount only (treat as converted amount if reasonable, otherwise as rate)
              else if (rateData.data.destination && rateData.data.destination.amount !== undefined) {
                const destAmount = parseFloat(rateData.data.destination.amount);
                
                // Heuristic: If destination amount is much smaller than expected converted amount, it's likely a rate
                // For NGN with $1000 USD, expected amount is ~1,500,000. If we get 1500, it's a rate.
                const expectedMin = usdPrice * 100; // Minimum expected for major currencies
                
                if (destAmount < expectedMin && destAmount > 0 && destAmount < 10000) {
                  // This looks like an exchange rate, not a converted amount
                  convertedAmount = usdPrice * destAmount;
                  console.log(`✅ Destination amount (${destAmount}) appears to be rate, multiplied: ${usdPrice} × ${destAmount} = ${convertedAmount} ${currency}`);
                } else {
                  convertedAmount = destAmount;
                  console.log(`✅ Using destination amount as converted amount: ${convertedAmount} ${currency}`);
                }
              } else {
                console.warn('⚠️ Could not extract conversion from Flutterwave response:', JSON.stringify(rateData.data, null, 2));
              }

              // Validate the converted amount makes sense
              if (!convertedAmount || isNaN(convertedAmount) || convertedAmount <= 0) {
                console.error('❌ Invalid converted amount:', convertedAmount);
                return utils.customResponse({
                  status: 500,
                  message: MessageResponse.Error,
                  description: "Failed to convert currency amount",
                  data: null,
                });
              }

              // Round based on currency type
              if (['NGN', 'JPY', 'KRW', 'VND', 'UGX', 'TZS', 'GHS', 'KES', 'ZAR'].includes(currency)) {
                convertedAmount = Math.round(convertedAmount);
              } else {
                convertedAmount = Math.round(convertedAmount * 100) / 100;
              }
              
              console.log(`💱 Currency conversion result - USD ${usdPrice} → ${currency} ${convertedAmount}`);
            } else {
              console.warn('⚠️ Flutterwave rate API response not successful:', rateData);
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
                console.warn('⚠️ Flutterwave returned HTML instead of JSON. Possible invalid API key or endpoint.');
              }
            } catch (e) {
              errorText = `Status ${rateResponse.status}: ${rateResponse.statusText}`;
            }
            console.warn('⚠️ Flutterwave rate API response not OK:', rateResponse.status, errorText.substring(0, 200));
            
            // Try fallback API
            throw new Error(`Flutterwave API error: ${rateResponse.status}`);
          }
        } catch (error: any) {
          console.error('❌ Error fetching exchange rate:', error);
          console.error('❌ Error details:', error?.message || error);
          
          // If Flutterwave fails, try fallback free API
          try {
            console.log('🔄 Trying fallback free API for currency conversion...');
            const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
              headers: { 'Accept': 'application/json' },
            });
            
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              if (fallbackData.rates && fallbackData.rates[currency]) {
                const rate = parseFloat(fallbackData.rates[currency]);
                convertedAmount = usdPrice * rate;
                
                // Round based on currency type
                if (['NGN', 'JPY', 'KRW', 'VND', 'UGX', 'TZS', 'GHS', 'KES', 'ZAR'].includes(currency)) {
                  convertedAmount = Math.round(convertedAmount);
                } else {
                  convertedAmount = Math.round(convertedAmount * 100) / 100;
                }
                
                console.log(`✅ Fallback API conversion - USD ${usdPrice} → ${currency} ${convertedAmount} (rate: ${rate})`);
              }
            }
          } catch (fallbackError) {
            console.error('❌ Fallback API also failed:', fallbackError);
            return utils.customResponse({
              status: 500,
              message: MessageResponse.Error,
              description: "Failed to convert currency. Please try again.",
              data: null,
            });
          }
        }
      } else {
        console.warn('⚠️ Flutterwave API key not found, using USD amount');
      }
    }

    console.log(`💵 Final amount to charge: ${convertedAmount} ${currency} (Original USD: ${usdPrice})`);

    // Create pending license key entry before creating payment link
    const pendingLicense = await licenseKeyService.createPendingLicense(planId, billingPeriod, email);
    const licenseKeyId = pendingLicense._id?.toString() || pendingLicense.id?.toString() || '';
    console.log(`🔑 Created pending license with ID: ${licenseKeyId} for email: ${email}`);

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
        currency: currency,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
        customer: {
          email: email,
          name: email.split('@')[0], // Use email username as name
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
      console.error('Flutterwave payment creation error:', paymentResponse.status, errorText);
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
  } catch (error) {
    console.error('Error initiating payment:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Internal server error",
      data: null,
    });
  }
}

export const POST = utils.withErrorHandling(handler);

