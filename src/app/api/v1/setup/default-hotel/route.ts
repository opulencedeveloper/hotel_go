import { NextRequest, NextResponse } from 'next/server';
import { setupDefaultHotel, assignUsersToDefaultHotel } from '@/lib/server/utils/setupDefaultHotel';
import { utils } from '@/lib/server/utils';
import { MessageResponse } from '@/lib/server/utils/enum';

export async function POST(request: NextRequest) {
  try {
    // Create default hotel
    const hotelId = await setupDefaultHotel();
    
    // Assign all users to the default hotel
    const updatedUsersCount = await assignUsersToDefaultHotel();
    
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Default hotel setup completed successfully",
      data: {
        hotelId,
        updatedUsersCount
      }
    });
  } catch (error) {
    console.error('Error setting up default hotel:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Failed to setup default hotel",
      data: null
    });
  }
}


















