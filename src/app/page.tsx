import HomePageBody from "@/components/home-page/HomePageBody";
import { headers } from 'next/headers';
import { planService } from "@/lib/server/plan/service";
import { connectDB } from "@/lib/server/utils/db";

// Force dynamic rendering since we use headers() and IP geolocation
export const dynamic = 'force-dynamic';

import { getFlutterwaveCurrency, isFlutterwaveSupportedCurrency } from '@/lib/utils/flutterwave-currencies';
import { logger } from '@/lib/utils/logger';

// Map timezone to country (most reliable for localhost/dev)
const getCountryFromTimezone = (timezone: string): string | null => {
  const timezoneToCountry: { [key: string]: string } = {
    'Africa/Lagos': 'NG',        // Nigeria
    'Africa/Accra': 'GH',         // Ghana
    'Africa/Johannesburg': 'ZA',  // South Africa
    'Africa/Nairobi': 'KE',       // Kenya
    'Africa/Cairo': 'EG',         // Egypt
    'Africa/Casablanca': 'MA',   // Morocco
    'Africa/Addis_Ababa': 'ET',   // Ethiopia
    'Africa/Dar_es_Salaam': 'TZ', // Tanzania
    'Africa/Kampala': 'UG',       // Uganda
    'Europe/London': 'GB',        // United Kingdom
    'Europe/Paris': 'FR',         // France
    'Europe/Berlin': 'DE',        // Germany
    'Europe/Madrid': 'ES',        // Spain
    'Europe/Rome': 'IT',          // Italy
    'America/New_York': 'US',     // USA
    'America/Los_Angeles': 'US',  // USA
    'America/Toronto': 'CA',       // Canada
    'Asia/Dubai': 'AE',           // UAE
    'Asia/Riyadh': 'SA',          // Saudi Arabia
    'Asia/Tokyo': 'JP',           // Japan
    'Asia/Shanghai': 'CN',        // China
    'Asia/Kolkata': 'IN',         // India
    'Asia/Singapore': 'SG',       // Singapore
    'Australia/Sydney': 'AU',     // Australia
  };
  return timezoneToCountry[timezone] || null;
};

// Detect user's country from cookie (set by middleware)
// In production, middleware handles all detection. This function just reads the cookie.
async function detectUserCountry(): Promise<string> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    
    // Read country from cookie (set by middleware)
    const cookieCountry = cookieStore.get('user-country')?.value;
    
    if (cookieCountry) {
      logger.debug('Detected country from cookie', { country: cookieCountry });
      return cookieCountry.toUpperCase();
    }

    // Fallback: If cookie doesn't exist (shouldn't happen in production)
    // This can happen during development or if middleware didn't run
    logger.warn('Country cookie not found. Middleware should have set it.');
    
    // Default to US as fallback
    return 'US';
  } catch (error) {
    logger.error('Error reading country cookie', { error: error instanceof Error ? error.message : 'Unknown error' });
    return 'US';
  }
}

// Fetch exchange rate - try Flutterwave first (if key available), then fallback to free APIs
async function fetchExchangeRate(currency: string): Promise<number> {
  // Validate currency is supported by Flutterwave
  if (!isFlutterwaveSupportedCurrency(currency)) {
    logger.warn('Currency not supported by Flutterwave, defaulting to USD', { currency });
    return 1; // USD rate
  }

  if (currency === 'USD') {
    return 1;
  }

  const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;
  
  if (!flutterwaveKey) {
    logger.warn('Flutterwave API key not found, using fallback APIs', { currency });
  }

  // Try Flutterwave first (if API key is available)
  if (flutterwaveKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://api.flutterwave.com/v3/rates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${flutterwaveKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'USD',
          to: currency,
          amount: 1,
        }),
        signal: controller.signal,
        next: { revalidate: 0 }, // Don't cache
      });

      clearTimeout(timeoutId);

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        logger.error('Flutterwave API returned non-JSON response', {
          status: response.status,
          contentType,
          errorPreview: errorText.substring(0, 200),
        });
        throw new Error(`Flutterwave API returned ${contentType || 'unknown content type'}`);
      }

      if (response.ok) {
        const data = await response.json();

        if (data.status === 'success' && data.data) {
          let rate = 1;

          // Flutterwave rates API returns different structures
          // Try multiple ways to extract the rate
          if (data.data.destination && data.data.source) {
            const sourceAmount = parseFloat(data.data.source.amount) || 1;
            const destAmount = parseFloat(data.data.destination.amount) || 1;
            
            // If source is 1 USD, destination is the exchange rate
            if (Math.abs(sourceAmount - 1) < 0.01 && destAmount > 0) {
              rate = destAmount;
            } else if (sourceAmount > 0 && destAmount > 0) {
              // Calculate rate from ratio
              rate = destAmount / sourceAmount;
            }
          } else if (data.data.destination && data.data.destination.amount) {
            rate = parseFloat(data.data.destination.amount);
          } else if (data.data.rate) {
            rate = parseFloat(data.data.rate);
          }

          // Validate and return rate
          if (rate && rate > 0 && isFinite(rate)) {
            logger.debug('Flutterwave exchange rate fetched', { currency, rate });
            return rate;
          } else {
            logger.warn('Invalid rate from Flutterwave', { currency, rate, responseData: data.data });
          }
        } else {
          logger.warn('Flutterwave response not successful', { currency, status: data.status });
        }
      } else {
        const errorText = await response.text();
        logger.error('Flutterwave API error', {
          status: response.status,
          currency,
          errorPreview: errorText.substring(0, 200),
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.warn('Flutterwave API timeout', { currency });
      } else {
        logger.error('Flutterwave API exception', {
          currency,
          error: error.message || 'Unknown error',
        });
      }
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
          logger.debug('Exchange rate from free API', { currency, rate, source: 'exchangerate-api' });
          return rate;
        }
      }
    }
  } catch (error) {
    logger.warn('Free API (exchangerate-api) failed', {
      currency,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
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
          logger.debug('Exchange rate from alternative free API', {
            currency,
            rate,
            source: 'fawazahmed0',
          });
          return rate;
        }
      }
    }
  } catch (error) {
    logger.warn('Alternative free API failed', {
      currency,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // If all APIs fail, return 1 (will show USD prices)
  logger.warn('All exchange rate APIs failed, using USD rates', { currency });
  return 1;
}

// Format price with currency
function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function fetchPricingPlans() {
  try {
    await connectDB();
    // Directly call the service to get plans data
    const plans = await planService.fetchPlans();
    // Convert Mongoose documents to plain objects for client component serialization
    return plans ? plans.map((plan: any) => ({
      _id: plan._id?.toString() || plan._id,
      name: plan.name,
      price: plan.price ? {
        quarterly: plan.price.quarterly,
        yearly: plan.price.yearly,
      } : null,
      rooms: plan.rooms,
      multiProperty: plan.multiProperty,
      description: plan.description,
      features: plan.features || [],
      popular: plan.popular || false,
      color: plan.color,
    })) : [];
  } catch (error) {
    logger.error('Error fetching pricing plans', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return [];
  }
}

export default async function HomePage() {
  // Fetch pricing plans
  const pricingPlans = await fetchPricingPlans();
  
  // Detect user's country and currency
  const countryCode = await detectUserCountry();
  
  // Get Flutterwave-supported currency (defaults to USD if not supported)
  const userCurrency = getFlutterwaveCurrency(countryCode);
  
  // Fetch exchange rate from Flutterwave
  const exchangeRate = await fetchExchangeRate(userCurrency);
  
  logger.info('Pricing page loaded', {
    plansCount: pricingPlans.length,
    country: countryCode,
    currency: userCurrency,
    exchangeRate,
  });
  
  // Convert prices on server
  const convertedPlans = pricingPlans.map((plan: any) => {
    if (!plan.price) return plan;
    
    const convertedQuarterly = plan.price.quarterly ? Math.round(plan.price.quarterly * exchangeRate) : null;
    const convertedYearly = plan.price.yearly ? Math.round(plan.price.yearly * exchangeRate) : null;
    
    return {
      ...plan,
      price: {
        quarterly: convertedQuarterly,
        yearly: convertedYearly,
      },
      // Store original USD prices for reference
      _originalPrice: plan.price,
    };
  });
  
  return (
    <HomePageBody 
      initialPricingPlans={convertedPlans}
      serverCurrency={userCurrency}
      serverExchangeRate={exchangeRate}
    />
  );
}
