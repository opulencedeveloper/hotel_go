/**
 * Flutterwave Supported Currencies
 * Only currencies in this list will be used. Others will default to USD.
 * Source: https://flutterwave.com/docs/currencies
 */
export const FLUTTERWAVE_SUPPORTED_CURRENCIES = [
  // African Currencies
  'NGN', // Nigerian Naira
  'GHS', // Ghanaian Cedi
  'KES', // Kenyan Shilling
  'ZAR', // South African Rand
  'UGX', // Ugandan Shilling
  'TZS', // Tanzanian Shilling
  'RWF', // Rwandan Franc
  'MWK', // Malawian Kwacha
  'XAF', // Central African CFA Franc
  'XOF', // West African CFA Franc
  'EGP', // Egyptian Pound
  'MAD', // Moroccan Dirham
  'ETB', // Ethiopian Birr
  'ZMW', // Zambian Kwacha
  'BWP', // Botswanan Pula
  'MZN', // Mozambican Metical
  'AOA', // Angolan Kwanza
  'SLL', // Sierra Leonean Leone
  'GMD', // Gambian Dalasi
  'LRD', // Liberian Dollar
  'SLE', // Sierra Leonean Leone (new)
  
  // Major International Currencies
  'USD', // US Dollar
  'GBP', // British Pound
  'EUR', // Euro
  
  // Other Supported Currencies
  'CAD', // Canadian Dollar
  'AUD', // Australian Dollar
  'JPY', // Japanese Yen
  'CHF', // Swiss Franc
  'CNY', // Chinese Yuan
  'INR', // Indian Rupee
  'SGD', // Singapore Dollar
  'AED', // UAE Dirham
  'SAR', // Saudi Riyal
  'QAR', // Qatari Riyal
  'KWD', // Kuwaiti Dinar
  'BHD', // Bahraini Dinar
  'OMR', // Omani Rial
] as const;

/**
 * Check if a currency is supported by Flutterwave
 */
export function isFlutterwaveSupportedCurrency(currency: string): boolean {
  return FLUTTERWAVE_SUPPORTED_CURRENCIES.includes(currency.toUpperCase() as any);
}

/**
 * Get Flutterwave-supported currency for a country, or default to USD
 */
export function getFlutterwaveCurrency(countryCode: string): string {
  // Map country to currency
  const countryToCurrency: { [key: string]: string } = {
    // African countries
    'NG': 'NGN', // Nigeria
    'GH': 'GHS', // Ghana
    'ZA': 'ZAR', // South Africa
    'KE': 'KES', // Kenya
    'UG': 'UGX', // Uganda
    'TZ': 'TZS', // Tanzania
    'RW': 'RWF', // Rwanda
    'MW': 'MWK', // Malawi
    'CM': 'XAF', // Cameroon (CFA)
    'SN': 'XOF', // Senegal (CFA)
    'CI': 'XOF', // Côte d'Ivoire (CFA)
    'EG': 'EGP', // Egypt
    'MA': 'MAD', // Morocco
    'ET': 'ETB', // Ethiopia
    'ZM': 'ZMW', // Zambia
    'BW': 'BWP', // Botswana
    'MZ': 'MZN', // Mozambique
    'AO': 'AOA', // Angola
    'SL': 'SLL', // Sierra Leone
    'GM': 'GMD', // Gambia
    'LR': 'LRD', // Liberia
    
    // European countries
    'GB': 'GBP', // United Kingdom
    'FR': 'EUR', // France
    'DE': 'EUR', // Germany
    'IT': 'EUR', // Italy
    'ES': 'EUR', // Spain
    'PT': 'EUR', // Portugal
    'NL': 'EUR', // Netherlands
    'BE': 'EUR', // Belgium
    'AT': 'EUR', // Austria
    'IE': 'EUR', // Ireland
    'FI': 'EUR', // Finland
    'GR': 'EUR', // Greece
    'CH': 'CHF', // Switzerland
    
    // North American countries
    'US': 'USD', // United States
    'CA': 'CAD', // Canada
    
    // Asian countries
    'JP': 'JPY', // Japan
    'CN': 'CNY', // China
    'IN': 'INR', // India
    'SG': 'SGD', // Singapore
    
    // Middle Eastern countries
    'AE': 'AED', // UAE
    'SA': 'SAR', // Saudi Arabia
    'QA': 'QAR', // Qatar
    'KW': 'KWD', // Kuwait
    'BH': 'BHD', // Bahrain
    'OM': 'OMR', // Oman
    
    // Oceania
    'AU': 'AUD', // Australia
    // Note: NZD (New Zealand Dollar) is not in Flutterwave's supported list, will default to USD
  };

  const currency = countryToCurrency[countryCode.toUpperCase()] || 'USD';
  
  // Validate currency is supported by Flutterwave
  if (isFlutterwaveSupportedCurrency(currency)) {
    return currency.toUpperCase();
  }
  
  // Default to USD if currency not supported
  // Note: Logging is handled by the caller if needed
  return 'USD';
}

