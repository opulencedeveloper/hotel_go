import { NextRequest } from "next/server";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency');
    
    if (!currency) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Currency parameter is required",
        data: null,
      });
    }

    // If currency is USD, return rate of 1
    if (currency === 'USD') {
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Exchange rate retrieved successfully",
        data: {
          currency: 'USD',
          rate: 1,
          from: 'USD',
          to: 'USD',
        },
      });
    }

    const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;

    // Try Flutterwave first (if API key is available)
    if (flutterwaveKey) {
      try {
        // Flutterwave uses GET request to transfers/rates endpoint with query parameters
        const response = await fetch(
          `https://api.flutterwave.com/v3/transfers/rates?amount=1&destination_currency=${currency}&source_currency=USD`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${flutterwaveKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.status === 'success' && data.data) {
            let rate = 1;

            // Extract rate from Flutterwave response
            if (data.data.destination && data.data.destination.amount) {
              rate = parseFloat(data.data.destination.amount);
            } else if (data.data.rate) {
              rate = parseFloat(data.data.rate);
            } else if (data.data.destination && data.data.source) {
              const sourceAmount = parseFloat(data.data.source.amount) || 1;
              const destAmount = parseFloat(data.data.destination.amount) || 1;
              if (sourceAmount > 0) {
                rate = destAmount / sourceAmount;
              }
            }

            if (rate && rate > 0 && isFinite(rate)) {
              return utils.customResponse({
                status: 200,
                message: MessageResponse.Success,
                description: "Exchange rate retrieved successfully from Flutterwave",
                data: {
                  currency: currency,
                  rate: rate,
                  from: 'USD',
                  to: currency,
                  source: 'flutterwave',
                },
              });
            }
          }
        }
      } catch (error) {
        console.warn('Flutterwave API error, trying fallback:', error);
      }
    }

    // Fallback to free APIs (no API key required)
    
    // Try exchangerate-api.com (free, no key required)
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.rates && data.rates[currency]) {
          const rate = parseFloat(data.rates[currency]);
          if (rate && rate > 0 && isFinite(rate)) {
            return utils.customResponse({
              status: 200,
              message: MessageResponse.Success,
              description: "Exchange rate retrieved successfully from free API",
              data: {
                currency: currency,
                rate: rate,
                from: 'USD',
                to: currency,
                source: 'exchangerate-api',
              },
            });
          }
        }
      }
    } catch (error) {
      console.warn('Free API (exchangerate-api) failed, trying alternative:', error);
    }

    // Try alternative free API
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        const currencyKey = currency.toLowerCase();
        if (data.usd && data.usd[currencyKey]) {
          const rate = parseFloat(data.usd[currencyKey]);
          if (rate && rate > 0 && isFinite(rate)) {
            return utils.customResponse({
              status: 200,
              message: MessageResponse.Success,
              description: "Exchange rate retrieved successfully from free API",
              data: {
                currency: currency,
                rate: rate,
                from: 'USD',
                to: currency,
                source: 'fawazahmed0',
              },
            });
          }
        }
      }
    } catch (error) {
      console.warn('Alternative free API failed:', error);
    }

    // If all APIs fail
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to fetch exchange rate from all available sources",
      data: null,
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Internal server error while fetching exchange rate",
      data: null,
    });
  }
}

export const GET = utils.withErrorHandling(handler);

