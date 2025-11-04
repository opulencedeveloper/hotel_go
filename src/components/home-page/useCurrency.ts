import { useState, useEffect } from 'react';
import { countries, currencyOptions } from '@/resources/auth';

export function useCurrency() {
  // For immediate testing: Uncomment these lines to force NGN
  // const [userCurrency, setUserCurrency] = useState<string>('NGN');
  // const [exchangeRate, setExchangeRate] = useState<number>(1500);
  // const [isLoadingRate, setIsLoadingRate] = useState(false);
  // const [currencyDetected, setCurrencyDetected] = useState(true);
  
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [currencyDetected, setCurrencyDetected] = useState(false); // Track if we've attempted detection

  // Build country-to-currency mapping using data from auth.ts
  const getCurrencyFromCountry = (countryCode: string): string => {
    const countryExists = countries.some(c => c.code === countryCode);
    if (!countryExists) {
      return 'USD';
    }

    const supportedCurrencies = new Set(currencyOptions.map(c => c.value));

    const countryToCurrency: { [key: string]: string } = {
      // Africa
      'NG': 'NGN', 'GH': 'GHS', 'ZA': 'ZAR', 'KE': 'KES', 'UG': 'UGX', 'TZ': 'TZS',
      'RW': 'RWF', 'ET': 'ETB', 'EG': 'EGP', 'MA': 'MAD', 'DZ': 'DZD', 'TN': 'TND',
      'SN': 'XOF', 'CI': 'XOF', 'BF': 'XOF', 'CM': 'XAF', 'AO': 'AOA', 'MZ': 'MZN',
      'ZM': 'ZMW', 'BW': 'BWP', 'NA': 'NAD', 'MU': 'MUR', 'SC': 'SCR',
      // Europe
      'GB': 'GBP', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'PT': 'EUR',
      'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'IE': 'EUR', 'FI': 'EUR', 'GR': 'EUR',
      'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN', 'HR': 'HRK',
      'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'CH': 'CHF', 'RU': 'RUB', 'TR': 'TRY',
      // Americas
      'US': 'USD', 'CA': 'CAD', 'MX': 'MXN', 'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP',
      'CO': 'COP', 'PE': 'PEN',
      // Asia
      'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW', 'IN': 'INR', 'PK': 'PKR', 'BD': 'BDT',
      'ID': 'IDR', 'TH': 'THB', 'VN': 'VND', 'PH': 'PHP', 'MY': 'MYR', 'SG': 'SGD',
      'HK': 'HKD', 'TW': 'TWD',
      // Middle East
      'AE': 'AED', 'SA': 'SAR', 'QA': 'QAR', 'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR',
      'JO': 'JOD', 'LB': 'LBP', 'IL': 'ILS',
      // Oceania
      'AU': 'AUD', 'NZ': 'NZD',
    };

    const currency = countryToCurrency[countryCode] || 'USD';
    return supportedCurrencies.has(currency) ? currency : 'USD';
  };

  // Detect user's country using multiple methods
  const detectUserCountry = async (): Promise<string> => {
    // Method 1: Try timezone FIRST (most reliable, no API needed, works offline)
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('🌐 Detected timezone:', timezone);
      
      // Map timezones to countries (most reliable method)
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
        'America/New_York': 'US',      // USA
        'America/Los_Angeles': 'US',  // USA
        'America/Toronto': 'CA',       // Canada
        'Asia/Dubai': 'AE',           // UAE
        'Asia/Riyadh': 'SA',          // Saudi Arabia
      };
      
      if (timezoneToCountry[timezone]) {
        const countryCode = timezoneToCountry[timezone];
        console.log('✅ Detected from timezone:', countryCode, 'from timezone:', timezone);
        // Validate currency exists for this country
        const testCurrency = getCurrencyFromCountry(countryCode);
        if (testCurrency) {
          console.log('✅ Valid currency for timezone country:', testCurrency);
          return countryCode;
        }
      }
    } catch (error) {
      console.warn('⚠️ Timezone detection failed:', error);
    }

    // Method 2: Try browser locale
    try {
      const locale = navigator.language || (navigator as any).userLanguage || (navigator as any).browserLanguage;
      console.log('🌐 Browser locale:', locale);
      
      if (locale) {
        // Extract country code from locale (e.g., "en-NG" -> "NG", "en-GB" -> "GB")
        const localeParts = locale.split('-');
        if (localeParts.length > 1) {
          const countryFromLocale = localeParts[localeParts.length - 1].toUpperCase();
          console.log('🌐 Extracted country from locale:', countryFromLocale);
          
          // Validate it's a valid country code (2 letters)
          if (countryFromLocale && countryFromLocale.length === 2) {
            // Check if it's a valid country in our list
            const testCurrency = getCurrencyFromCountry(countryFromLocale);
            if (testCurrency && testCurrency !== 'USD') {
              console.log('✅ Valid country from locale:', countryFromLocale, '-> Currency:', testCurrency);
              return countryFromLocale;
            } else {
              console.log('⚠️ Locale country not in our list or is USD:', countryFromLocale);
            }
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not read browser locale:', error);
    }

    // Method 2: Try ipapi.co
    try {
      console.log('🌐 Trying ipapi.co...');
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Timeout handling (fallback for browsers without AbortSignal.timeout)
      });
      
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.country_code || data.country || null;
        if (countryCode && countryCode.length === 2) {
          console.log('✅ ipapi.co success - Country:', countryCode);
          return countryCode.toUpperCase();
        }
      }
    } catch (error) {
      console.warn('⚠️ ipapi.co failed:', error);
    }

    // Method 3: Try ip-api.com
    try {
      console.log('🌐 Trying ip-api.com...');
      const fallbackResponse = await fetch('https://ip-api.com/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Timeout handling
      });
      
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        const countryCode = data.countryCode || data.country_code || null;
        if (countryCode && countryCode.length === 2) {
          console.log('✅ ip-api.com success - Country:', countryCode);
          return countryCode.toUpperCase();
        }
      }
    } catch (error) {
      console.warn('⚠️ ip-api.com failed:', error);
    }

    // Method 4: Final fallback - try IP geolocation (if previous methods failed)

    console.warn('⚠️ All detection methods failed, defaulting to US');
    return 'US';
  };

  // Fetch exchange rate from Flutterwave only
  const fetchExchangeRate = async (targetCurrency: string) => {
    setIsLoadingRate(true);
    
    const flutterwaveKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;
    
    if (!flutterwaveKey) {
      console.error('❌ Flutterwave API key not found in environment variables.');
      console.error('⚠️ Please set NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY in your .env file.');
      setExchangeRate(1);
      setIsLoadingRate(false);
      return;
    }
    
    try {
      console.log('🔄 Fetching exchange rate from Flutterwave...');
      const response = await fetch(
        `https://api.flutterwave.com/v3/rates`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${flutterwaveKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'USD',
            to: targetCurrency,
            amount: 1
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Flutterwave API error:', response.status, response.statusText);
        console.error('❌ Error details:', errorText);
        setExchangeRate(1);
        setIsLoadingRate(false);
        return;
      }
      
      const data = await response.json();
      console.log('✅ Flutterwave API response:', data);
      
      if (data.status === 'success' && data.data) {
        let rate = 1;
        
        // Try multiple ways to extract the rate from Flutterwave response
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
          console.log(`✅ Flutterwave rate USD to ${targetCurrency}:`, rate);
          setExchangeRate(rate);
          setIsLoadingRate(false);
          return;
        } else {
          console.warn('⚠️ Invalid or unchanged rate from Flutterwave:', rate);
        }
      } else {
        console.warn('⚠️ Flutterwave response status not success:', data);
      }
    } catch (error) {
      console.error('❌ Flutterwave API request failed:', error);
    }
    
    // If we get here, Flutterwave failed
    console.error(`✗ Flutterwave API failed for ${targetCurrency}.`);
    console.error('⚠️ Exchange rate will remain at 1 (will show USD equivalent).');
    console.error('⚠️ Please check your Flutterwave API key and internet connection.');
    setExchangeRate(1);
    setIsLoadingRate(false);
  };

  // Format price with currency
  const formatPrice = (amount: number, currency: string = userCurrency): string => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    
    console.log(`💵 Formatting ${amount} as ${currency}:`, formatted);
    
    return formatted;
  };

  // Convert USD price to user's currency
  // Always converts: USD prices from API → user's local currency
  const convertPrice = (usdAmount: number): number => {
    // If user is in USD country, exchangeRate is 1 (no conversion needed)
    // If user is in other country, exchangeRate converts USD to their currency
    if (exchangeRate === 1 && userCurrency !== 'USD') {
      console.warn('⚠️ Exchange rate is 1, conversion may not be accurate. Showing USD equivalent.');
      console.warn('⚠️ User currency:', userCurrency, 'Exchange rate:', exchangeRate);
    }
    
    // Always multiply by exchange rate (1 for USD, actual rate for others)
    const converted = usdAmount * exchangeRate;
    const rounded = Math.round(converted);
    
    console.log(`💱 Converting ${usdAmount} USD to ${userCurrency}:`, {
      exchangeRate,
      converted,
      rounded
    });
    
    return rounded;
  };

  // Detect user's country and set currency - RUN ONLY ONCE
  useEffect(() => {
    // Only run once - prevent multiple executions
    if (currencyDetected) {
      console.log('✅ Currency already detected, skipping...');
      return;
    }

    let isMounted = true; // Track if component is still mounted

    const detectAndSetCurrency = async () => {
      try {
        console.log('🔍 Detecting user country...');
        const countryCode = await detectUserCountry();
        
        if (!isMounted) {
          console.log('⚠️ Component unmounted, aborting currency detection');
          return;
        }
        
        console.log('📍 Detected country code:', countryCode);
        
        const currency = getCurrencyFromCountry(countryCode);
        console.log('💰 Currency from country code:', currency);
        console.log('💰 Test: NG ->', getCurrencyFromCountry('NG'), ', GH ->', getCurrencyFromCountry('GH'));
        
        // Mark as detected FIRST to prevent re-runs
        setCurrencyDetected(true);
        
        // Only update if we got a valid currency
        if (currency && currency !== 'USD') {
          console.log('🌍 Non-USD currency detected:', currency, '- Setting currency and fetching rate from Flutterwave...');
          
          // Set currency IMMEDIATELY using functional update to ensure state change
          setUserCurrency((prev) => {
            console.log('🔄 Setting currency from', prev, 'to', currency);
            return currency;
          });
          
          // Fetch exchange rate from Flutterwave only
          await fetchExchangeRate(currency);
        } else if (currency === 'USD') {
          console.log('💵 USD currency detected');
          setUserCurrency('USD');
          setExchangeRate(1);
          setIsLoadingRate(false);
        } else {
          console.warn('⚠️ Invalid currency detected:', currency, '- Keeping current');
          setIsLoadingRate(false);
        }
      } catch (error) {
        console.error('❌ Error detecting user location:', error);
        // Mark as detected to prevent re-runs even on error
        if (isMounted) {
          setCurrencyDetected(true);
          setIsLoadingRate(false);
        }
      }
    };

    detectAndSetCurrency();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run only once on mount

  return {
    userCurrency,
    exchangeRate,
    isLoadingRate,
    formatPrice,
    convertPrice,
  };
}

