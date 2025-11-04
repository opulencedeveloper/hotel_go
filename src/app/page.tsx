import HomePageBody from "@/components/home-page/HomePageBody";
import { headers } from 'next/headers';
import { planService } from "@/lib/server/plan/service";
import { connectDB } from "@/lib/server/utils/db";

// Force dynamic rendering since we use headers() and IP geolocation
export const dynamic = 'force-dynamic';

// Country to currency mapping
const getCurrencyFromCountry = (countryCode: string): string => {
  const countryToCurrency: { [key: string]: string } = {
    'NG': 'NGN', 'GH': 'GHS', 'ZA': 'ZAR', 'KE': 'KES', 'UG': 'UGX', 'TZ': 'TZS',
    'GB': 'GBP', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'PT': 'EUR',
    'US': 'USD', 'CA': 'CAD', 'MX': 'MXN', 'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP',
    'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW', 'IN': 'INR', 'PK': 'PKR', 'BD': 'BDT',
    'ID': 'IDR', 'TH': 'THB', 'VN': 'VND', 'PH': 'PHP', 'MY': 'MYR', 'SG': 'SGD',
    'AE': 'AED', 'SA': 'SAR', 'QA': 'QAR', 'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR',
    'AU': 'AUD', 'NZ': 'NZD',
  };
  return countryToCurrency[countryCode] || 'USD';
};

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

// Detect user's country from request headers/IP/timezone
async function detectUserCountry(): Promise<string> {
  try {
    const headersList = headers();
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    
    // Method 1: Check cookie set by client-side timezone detection or manual override
    const cookieCountry = cookieStore.get('user-country')?.value;
    if (cookieCountry) {
      console.log('✅ Detected country from cookie:', cookieCountry);
      return cookieCountry.toUpperCase();
    }
    
    // Check for manual override via query parameter (for testing)
    const url = headersList.get('referer') || '';
    if (url.includes('country=')) {
      try {
        const urlObj = new URL(url);
        const countryParam = urlObj.searchParams.get('country');
        if (countryParam && countryParam.length === 2) {
          console.log('✅ Using country from query parameter:', countryParam);
          cookieStore.set('user-country', countryParam.toUpperCase(), {
            maxAge: 60 * 60 * 24,
            path: '/',
          });
          return countryParam.toUpperCase();
        }
      } catch (e) {
        // Ignore URL parsing errors
      }
    }
    
    // Method 2: Try IP geolocation with client IP
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || null;

    console.log('🌍 Detecting country - Client IP:', clientIp || 'not available');

    if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1' && !clientIp.startsWith('192.168.') && !clientIp.startsWith('10.')) {
      try {
        console.log('🌍 Trying IP geolocation with client IP:', clientIp);
        const geoResponse = await fetch(`https://ipapi.co/${clientIp}/json/`, {
          headers: { 'Accept': 'application/json' },
          next: { revalidate: 0 },
        });
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          console.log('🌍 IP geolocation response:', geoData);
          if (geoData.country_code) {
            const countryCode = geoData.country_code.toUpperCase();
            console.log('✅ Detected country from IP:', countryCode);
            return countryCode;
          }
        }
      } catch (error) {
        console.warn('⚠️ IP geolocation with client IP failed:', error);
      }
    }

    // Method 3: Try generic IP geolocation (detects server location, works for localhost too)
    try {
      console.log('🌍 Trying generic IP geolocation (server IP)...');
      const geoResponse = await fetch('https://ipapi.co/json/', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 0 },
      });
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        console.log('🌍 Generic IP geolocation response:', JSON.stringify(geoData, null, 2));
        if (geoData.country_code) {
          const countryCode = geoData.country_code.toUpperCase();
          console.log('✅ Detected country from generic IP:', countryCode);
          
          // Save to cookie for future requests
          if (cookieCountry !== countryCode) {
            try {
              cookieStore.set('user-country', countryCode, {
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
              });
            } catch (e) {
              // Ignore cookie errors
            }
          }
          
          return countryCode;
        }
      } else {
        const errorText = await geoResponse.text();
        console.warn('⚠️ Generic IP geolocation failed:', geoResponse.status, errorText);
      }
    } catch (error) {
      console.warn('⚠️ Generic IP geolocation exception:', error);
    }

    // Method 4: Try Accept-Language header (less reliable)
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      console.log('🌍 Trying Accept-Language:', acceptLanguage);
      const localeParts = acceptLanguage.split(',')[0].split('-');
      if (localeParts.length > 1) {
        const countryCode = localeParts[localeParts.length - 1].toUpperCase();
        if (countryCode && countryCode.length === 2) {
          console.log('✅ Detected country from Accept-Language:', countryCode);
          return countryCode;
        }
      }
    }

    console.warn('⚠️ All country detection methods failed, defaulting to US');
    return 'US'; // Default to US
  } catch (error) {
    console.error('❌ Error detecting country:', error);
    return 'US';
  }
}

// Fetch exchange rate - try Flutterwave first (if key available), then fallback to free APIs
async function fetchExchangeRate(currency: string): Promise<number> {
  if (currency === 'USD') {
    console.log('💵 Currency is USD, returning rate 1');
    return 1;
  }

  const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;
  
  console.log('💱 Fetching exchange rate for:', currency);
  console.log('🔑 Flutterwave key available:', flutterwaveKey ? 'Yes' : 'No');

  // Try Flutterwave first (if API key is available)
  if (flutterwaveKey) {
    try {
      console.log('🔄 Calling Flutterwave API...');
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
        next: { revalidate: 0 }, // Don't cache
      });

      console.log('📡 Flutterwave response status:', response.status);

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ Flutterwave API returned non-JSON response:', errorText.substring(0, 500));
        throw new Error(`Flutterwave API returned ${contentType || 'unknown content type'}`);
      }

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Flutterwave response data:', JSON.stringify(data, null, 2));

        if (data.status === 'success' && data.data) {
          let rate = 1;

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

          if (rate && rate > 0 && isFinite(rate) && rate !== 1) {
            console.log(`✅ Flutterwave rate USD to ${currency}:`, rate);
            return rate;
          } else {
            console.warn('⚠️ Invalid rate from Flutterwave:', rate);
          }
        } else {
          console.warn('⚠️ Flutterwave response not success:', data);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Flutterwave API error:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Flutterwave API exception:', error);
    }
  } else {
    console.warn('⚠️ Flutterwave key not found, trying free APIs...');
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
          console.log(`✓ Free API rate USD to ${currency}:`, rate);
          return rate;
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
          console.log(`✓ Alternative free API rate USD to ${currency}:`, rate);
          return rate;
        }
      }
    }
  } catch (error) {
    console.warn('Alternative free API failed:', error);
  }

  // If all APIs fail, return 1 (will show USD prices)
  console.warn(`⚠️ All exchange rate APIs failed for ${currency}. Using USD rates.`);
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
    console.error('Error fetching pricing plans:', error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch pricing plans
  const pricingPlans = await fetchPricingPlans();
  console.log('📦 Fetched pricing plans:', pricingPlans.length);
  
  // Detect user's country and currency
  const countryCode = await detectUserCountry();
  console.log('📍 Detected country code:', countryCode);
  
  const userCurrency = getCurrencyFromCountry(countryCode);
  console.log('💰 Mapped currency:', userCurrency);
  
  // Fetch exchange rate from Flutterwave
  const exchangeRate = await fetchExchangeRate(userCurrency);
  console.log('💱 Exchange rate:', exchangeRate);
  
  // Convert prices on server
  const convertedPlans = pricingPlans.map((plan: any) => {
    if (!plan.price) return plan;
    
    const convertedQuarterly = plan.price.quarterly ? Math.round(plan.price.quarterly * exchangeRate) : null;
    const convertedYearly = plan.price.yearly ? Math.round(plan.price.yearly * exchangeRate) : null;
    
    console.log(`💵 Plan ${plan.name}: USD ${plan.price.yearly} -> ${userCurrency} ${convertedYearly} (rate: ${exchangeRate})`);
    
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
  
  console.log('✅ Final currency info:', { userCurrency, exchangeRate, countryCode });
  
  return (
    <HomePageBody 
      initialPricingPlans={convertedPlans}
      serverCurrency={userCurrency}
      serverExchangeRate={exchangeRate}
    />
  );
}
