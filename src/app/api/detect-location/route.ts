import { cookies } from "next/headers";
import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get('timezone');
    const country = searchParams.get('country');

    if (timezone) {
      // Map timezone to country
      const timezoneToCountry: { [key: string]: string } = {
        'Africa/Lagos': 'NG', 'Africa/Accra': 'GH', 'Africa/Johannesburg': 'ZA',
        'Africa/Nairobi': 'KE', 'Africa/Cairo': 'EG', 'Africa/Casablanca': 'MA',
        'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
        'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'America/New_York': 'US',
        'America/Los_Angeles': 'US', 'America/Toronto': 'CA', 'Asia/Dubai': 'AE',
        'Asia/Riyadh': 'SA', 'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN',
        'Asia/Kolkata': 'IN', 'Asia/Singapore': 'SG', 'Australia/Sydney': 'AU',
      };
      
      const detectedCountry = timezoneToCountry[timezone];
      if (detectedCountry) {
        // Set cookie with country (expires in 1 day)
        cookies().set('user-country', detectedCountry, {
          maxAge: 60 * 60 * 24,
          path: '/',
        });
        
        return utils.customResponse({
          status: 200,
          message: MessageResponse.Success,
          description: "Location detected",
          data: { country: detectedCountry, timezone },
        });
      }
    }

    if (country) {
      cookies().set('user-country', country, {
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Location set",
        data: { country },
      });
    }

    return utils.customResponse({
      status: 400,
      message: MessageResponse.Error,
      description: "Timezone or country parameter required",
      data: null,
    });
  } catch (error) {
    console.error('Error in detect-location:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Internal server error",
      data: null,
    });
  }
}

export const GET = utils.withErrorHandling(handler);

