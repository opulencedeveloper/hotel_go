import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { connectDB } from "@/lib/server/utils/db";
import Plan from "@/lib/server/plan/entity";

interface InitiatePaymentBody {
  planId: string;
  email: string;
  currency: string;
}

async function handler(request: Request) {
  try {
    await connectDB();

    const body: InitiatePaymentBody = await request.json();
    const { planId, email, currency } = body;

    // Validate input
    if (!planId || !email || !currency) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "planId, email, and currency are required",
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

    // Get price (use yearly as default, fallback to quarterly)
    const usdPrice = plan.price.yearly || plan.price.quarterly || 0;

    if (usdPrice === 0) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Invalid plan price",
        data: null,
      });
    }

    // Convert price to target currency using Flutterwave
    let convertedAmount = usdPrice;
    
    if (currency !== 'USD') {
      const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;

      if (flutterwaveKey) {
        try {
          // Fetch exchange rate
          const rateResponse = await fetch('https://api.flutterwave.com/v3/rates', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${flutterwaveKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'USD',
              to: currency,
              amount: usdPrice,
            }),
          });

          if (rateResponse.ok) {
            const rateData = await rateResponse.json();
            
            if (rateData.status === 'success' && rateData.data) {
              let rate = 1;

              if (rateData.data.destination && rateData.data.destination.amount) {
                convertedAmount = parseFloat(rateData.data.destination.amount);
              } else if (rateData.data.rate) {
                rate = parseFloat(rateData.data.rate);
                convertedAmount = usdPrice * rate;
              } else if (rateData.data.destination && rateData.data.source) {
                const sourceAmount = parseFloat(rateData.data.source.amount) || usdPrice;
                const destAmount = parseFloat(rateData.data.destination.amount) || usdPrice;
                if (sourceAmount > 0) {
                  rate = destAmount / sourceAmount;
                  convertedAmount = usdPrice * rate;
                }
              }

              // Round to 2 decimal places
              convertedAmount = Math.round(convertedAmount * 100) / 100;
            }
          }
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
          // Continue with USD price if conversion fails
        }
      }
    }

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

    // Determine billing period (default to yearly, but we could make this configurable)
    const billingPeriod = plan.price?.yearly ? 'yearly' : 'quarterly';
    
    // Create payment link
    const paymentResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: `plan_${planId}_${Date.now()}`,
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

