import { NextRequest, NextResponse } from 'next/server';
import { getFlutterwaveCurrency } from '@/lib/utils/flutterwave-currencies';
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

/**
 * Detect user's country and set cookie in middleware
 * This runs before the page renders, so no reload is needed
 */
export async function geoMiddleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();
  
  // Check if country cookie already exists
  const existingCountry = request.cookies.get('user-country')?.value;
  if (existingCountry) {
    // Cookie exists, just pass through
    return response;
  }

  let detectedCountry: string | null = null;

  // Method 1: Check query parameter (for testing/manual override)
  const countryParam = request.nextUrl.searchParams.get('country');
  if (countryParam && countryParam.length === 2) {
    detectedCountry = countryParam.toUpperCase();
    logger.debug('Using country from query parameter', { country: detectedCountry });
  }

  // Method 2: Try IP geolocation (works best in production with real IPs)
  // Production: Use Vercel/Cloudflare geo data if available (no API call needed)
  if (!detectedCountry) {
    // Try Vercel/Cloudflare geo data first (fastest, no API call)
    const geoCountry = (request as any).geo?.country || null;
    if (geoCountry) {
      detectedCountry = geoCountry.toUpperCase();
      logger.debug('Detected country from edge geo data', { country: detectedCountry });
    }
  }

  // Fallback: External IP geolocation API (if edge geo not available)
  if (!detectedCountry) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || null;

    // Only try IP geolocation if we have a real IP (not localhost)
    if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1' && 
        !clientIp.startsWith('192.168.') && !clientIp.startsWith('10.') &&
        !clientIp.startsWith('172.')) {
      try {
        // Production: Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        const geoResponse = await fetch(`https://ipapi.co/${clientIp}/json/`, {
          headers: { 'Accept': 'application/json' },
          signal: controller.signal,
          next: { revalidate: 3600 }, // Cache for 1 hour
        });
        
        clearTimeout(timeoutId);
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.country_code) {
            detectedCountry = geoData.country_code.toUpperCase();
            logger.debug('Detected country from IP API', { 
              country: detectedCountry, 
              ip: clientIp?.substring(0, 10) + '...' // Log partial IP for privacy
            });
          }
        } else if (geoResponse.status === 429) {
          // Rate limit hit - use Accept-Language fallback
          logger.warn('IP geolocation rate limit hit, using Accept-Language fallback');
        } else {
          logger.warn('IP geolocation API returned error', { 
            status: geoResponse.status 
          });
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          logger.warn('IP geolocation timeout, using Accept-Language fallback');
        } else {
          logger.warn('IP geolocation failed', { 
            error: error.message || 'Unknown error' 
          });
        }
      }
    }
  }

  // Method 3: Try Accept-Language header (fallback)
  if (!detectedCountry) {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const localeParts = acceptLanguage.split(',')[0].split('-');
      if (localeParts.length > 1) {
        const countryCode = localeParts[localeParts.length - 1].toUpperCase();
        if (countryCode && countryCode.length === 2) {
          detectedCountry = countryCode;
          logger.debug('Detected country from Accept-Language', { country: detectedCountry });
        }
      }
    }
  }

  // Default to US if nothing detected
  if (!detectedCountry) {
    detectedCountry = 'US';
    logger.warn('No country detected, defaulting to US', {
      path: request.nextUrl.pathname,
      hasGeo: !!(request as any).geo,
    });
  }

  // Set cookie for future requests (expires in 30 days)
  response.cookies.set('user-country', detectedCountry, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  // Get Flutterwave-supported currency (defaults to USD if not supported)
  const currency = getFlutterwaveCurrency(detectedCountry);
  
  // Set currency cookie for convenience
  response.cookies.set('user-currency', currency, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  logger.info('Country and currency detected', {
    country: detectedCountry,
    currency,
    path: request.nextUrl.pathname,
  });

  return response;
}

