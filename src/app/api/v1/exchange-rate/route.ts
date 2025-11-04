import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { logger } from "@/lib/utils/logger";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Flutterwave API timeout (5 seconds - optimized for serverless environments like Vercel)
// Vercel Hobby plan has 10s timeout, Pro has 60s. We use 5s to leave buffer for processing.
const FLUTTERWAVE_API_TIMEOUT = 5000;

// In-memory cache for exchange rates (5 minutes TTL)
// Note: This cache is per-instance in serverless, but helps with burst requests
const rateCache = new Map<string, { rate: number; timestamp: number; currency: string }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

function getCachedRate(currency: string): number | null {
  const cached = rateCache.get(currency);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.rate;
  }
  if (cached) {
    rateCache.delete(currency); // Remove expired entry
  }
  return null;
}

function setCachedRate(currency: string, rate: number): void {
  rateCache.set(currency, {
    rate,
    timestamp: Date.now(),
    currency,
  });
  
  // Clean up old entries periodically (keep cache size manageable)
  if (rateCache.size > 100) {
    const now = Date.now();
    const entries = Array.from(rateCache.entries());
    for (const [key, value] of entries) {
      if (now - value.timestamp >= CACHE_TTL) {
        rateCache.delete(key);
      }
    }
  }
}

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

    // Check cache first
    const cachedRate = getCachedRate(currency);
    if (cachedRate !== null) {
      logger.info('Exchange rate retrieved from cache', {
        currency,
        rate: cachedRate,
      });
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Exchange rate retrieved successfully from cache",
        data: {
          currency: currency,
          rate: cachedRate,
          from: 'USD',
          to: currency,
          source: 'cache',
        },
      });
    }

    const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;

    // Use Flutterwave API (required)
    if (!flutterwaveKey) {
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: "Flutterwave API key not configured",
        data: null,
      });
    }

    try {
      // Flutterwave transfers/rates endpoint
      // When amount=1 USD, the destination.amount is the exchange rate
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FLUTTERWAVE_API_TIMEOUT);

      try {
        const response = await fetch(
          `https://api.flutterwave.com/v3/transfers/rates?amount=1&destination_currency=${currency}&source_currency=USD`,
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

        // Check content type to ensure we got JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          logger.error('Flutterwave API returned non-JSON response', {
            currency,
            contentType,
            responsePreview: text.substring(0, 200),
          });
          return utils.customResponse({
            status: 500,
            message: MessageResponse.Error,
            description: "Flutterwave API returned invalid response format",
            data: null,
          });
        }

        if (response.ok) {
          const data = await response.json();

          if (data.status === 'success' && data.data) {
            let rate = 1;

            // Flutterwave transfers/rates returns:
            // - data.source.amount: source amount (1 USD)
            // - data.destination.amount: converted amount in destination currency
            // When source amount is 1, destination.amount is the exchange rate
            // Example: If 1 USD = 1500 NGN, destination.amount will be 1500
            
            if (data.data.source && data.data.destination) {
              const sourceAmount = parseFloat(String(data.data.source.amount)) || 1;
              const destAmount = parseFloat(String(data.data.destination.amount)) || 1;
              
              // Log the raw response for debugging
              logger.info('Flutterwave rate response structure', {
                currency,
                sourceAmount,
                destAmount,
                sourceCurrency: data.data.source?.currency,
                destCurrency: data.data.destination?.currency,
                fullResponse: JSON.stringify(data.data).substring(0, 200),
              });
              
              if (sourceAmount > 0) {
                // Calculate rate: destination amount / source amount
                // Since we're querying with amount=1 USD, destAmount is the rate
                rate = destAmount / sourceAmount;
              }
            } else if (data.data.destination && data.data.destination.amount !== undefined) {
              rate = parseFloat(String(data.data.destination.amount));
            } else if (data.data.rate) {
              rate = parseFloat(String(data.data.rate));
            }

            if (rate && rate > 0 && isFinite(rate)) {
              // Cache the rate for future requests
              setCachedRate(currency, rate);
              
              logger.info('Exchange rate retrieved from Flutterwave', {
                currency,
                rate,
                from: 'USD',
                to: currency,
                meaning: `1 USD = ${rate} ${currency}`,
              });
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
            } else {
              logger.error('Invalid rate extracted from Flutterwave', {
                currency,
                rate,
                hasDestination: !!data.data.destination,
                hasSource: !!data.data.source,
                responseData: JSON.stringify(data.data).substring(0, 300),
              });
              return utils.customResponse({
                status: 500,
                message: MessageResponse.Error,
                description: "Invalid exchange rate received from Flutterwave",
                data: null,
              });
            }
          } else {
            logger.error('Flutterwave API returned unsuccessful response', {
              currency,
              status: data.status,
              message: data.message,
            });
            return utils.customResponse({
              status: 500,
              message: MessageResponse.Error,
              description: data.message || "Flutterwave API returned unsuccessful response",
              data: null,
            });
          }
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          logger.error('Flutterwave API error response', {
            currency,
            status: response.status,
            statusText: response.statusText,
            errorMessage: errorData.message,
          });
          return utils.customResponse({
            status: response.status,
            message: MessageResponse.Error,
            description: errorData.message || `Flutterwave API error: ${response.statusText}`,
            data: null,
          });
        }
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          logger.error('Flutterwave API request timeout', {
            currency,
            timeout: FLUTTERWAVE_API_TIMEOUT,
            environment: process.env.VERCEL ? 'production' : 'development',
          });
          return utils.customResponse({
            status: 504,
            message: MessageResponse.Error,
            description: "Exchange rate service temporarily unavailable. Please try again in a moment.",
            data: null,
          });
        }
        
        throw fetchError;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error fetching exchange rate from Flutterwave', {
        currency,
        error: errorMessage,
      });
      return utils.customResponse({
        status: 500,
        message: MessageResponse.Error,
        description: `Failed to fetch exchange rate from Flutterwave: ${errorMessage}`,
        data: null,
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Internal error in exchange rate handler', {
      error: errorMessage,
    });
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Internal server error while fetching exchange rate",
      data: null,
    });
  }
}

export const GET = utils.withErrorHandling(handler);

