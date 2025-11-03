import { useState, useEffect } from 'react';
import { countries, currencyOptions } from '@/resources/auth';

export function useCurrency() {
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

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

  // Detect user's country using IP geolocation
  const detectUserCountry = async (): Promise<string> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return data.country_code || 'US';
      }
    } catch (error) {
      console.error('Error fetching location from ipapi.co:', error);
    }

    try {
      const fallbackResponse = await fetch('https://ip-api.com/json/');
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        return data.countryCode || 'US';
      }
    } catch (error) {
      console.error('Error fetching location from ip-api.com:', error);
    }

    return 'US';
  };

  // Fetch exchange rate - try Flutterwave first, then fallback to free API
  const fetchExchangeRate = async (targetCurrency: string) => {
    setIsLoadingRate(true);
    
    const flutterwaveKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY;
    
    if (flutterwaveKey) {
      try {
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
        
        if (response.ok) {
          const data = await response.json();
          console.log('Flutterwave API response:', data);
          
          if (data.status === 'success' && data.data) {
            let rate = 1;
            
            if (data.data.destination && data.data.destination.amount) {
              rate = parseFloat(data.data.destination.amount);
            } else if (data.data.rate) {
              rate = parseFloat(data.data.rate);
            } else if (data.data.destination && data.data.source) {
              const sourceAmount = parseFloat(data.data.source.amount) || 1;
              const destAmount = parseFloat(data.data.destination.amount) || 1;
              rate = destAmount / sourceAmount;
            }
            
            if (rate && rate > 0 && isFinite(rate) && rate !== 1) {
              console.log(`✓ Flutterwave rate USD to ${targetCurrency}:`, rate);
              setExchangeRate(rate);
              setIsLoadingRate(false);
              return;
            }
          }
        }
      } catch (error) {
        console.warn('Flutterwave API error:', error);
      }
    } else {
      console.warn('Flutterwave API key not found. Using fallback API.');
    }
    
    // Try fallback API
    try {
      console.log('Fetching exchange rate from fallback API...');
      
      const fallbackResponse = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('Fallback API response:', fallbackData);
        
        if (fallbackData.rates && fallbackData.rates[targetCurrency]) {
          const fallbackRate = parseFloat(fallbackData.rates[targetCurrency]);
          
          if (fallbackRate && fallbackRate > 0 && isFinite(fallbackRate) && fallbackRate !== 1) {
            console.log(`✓ Fallback rate USD to ${targetCurrency}:`, fallbackRate);
            setExchangeRate(fallbackRate);
            setIsLoadingRate(false);
            return;
          }
        }
      } else {
        console.warn('Fallback API response not OK:', fallbackResponse.status, fallbackResponse.statusText);
      }
    } catch (fallbackError) {
      console.error('Fallback API failed:', fallbackError);
    }
    
    // Try alternative free API
    try {
      const altResponse = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (altResponse.ok) {
        const altData = await altResponse.json();
        const currencyKey = targetCurrency.toLowerCase();
        if (altData.usd && altData.usd[currencyKey]) {
          const altRate = parseFloat(altData.usd[currencyKey]);
          if (altRate && altRate > 0 && isFinite(altRate) && altRate !== 1) {
            console.log(`✓ Alternative API rate USD to ${targetCurrency}:`, altRate);
            setExchangeRate(altRate);
            setIsLoadingRate(false);
            return;
          }
        }
      }
    } catch (altError) {
      console.error('Alternative API failed:', altError);
    }
    
    console.error(`✗ All exchange rate APIs failed for ${targetCurrency}. Using default rate of 1.`);
    console.error('Prices will display in USD amounts. Please check your internet connection and API keys.');
    setExchangeRate(1);
    setIsLoadingRate(false);
  };

  // Format price with currency
  const formatPrice = (amount: number, currency: string = userCurrency): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Convert USD price to user's currency
  const convertPrice = (usdAmount: number): number => {
    if (exchangeRate === 1 && userCurrency !== 'USD') {
      console.warn('Exchange rate is 1, conversion may not be accurate. Showing USD equivalent.');
    }
    const converted = usdAmount * exchangeRate;
    return Math.round(converted);
  };

  // Detect user's country and set currency
  useEffect(() => {
    const detectAndSetCurrency = async () => {
      try {
        const countryCode = await detectUserCountry();
        const currency = getCurrencyFromCountry(countryCode);
        setUserCurrency(currency);
        
        if (currency !== 'USD') {
          await fetchExchangeRate(currency);
        } else {
          setIsLoadingRate(false);
        }
      } catch (error) {
        console.error('Error detecting user location:', error);
        setUserCurrency('USD');
        setIsLoadingRate(false);
      }
    };

    detectAndSetCurrency();
  }, []);

  return {
    userCurrency,
    exchangeRate,
    isLoadingRate,
    formatPrice,
    convertPrice,
  };
}

