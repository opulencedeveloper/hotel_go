import { analyticsController } from "@/lib/server/analytics/controller";
import { facilityController } from "@/lib/server/facility/controller";
import { hotelServiceController } from "@/lib/server/hotelService/controller";
import { menuController } from "@/lib/server/menu/controller";
import GeneralMiddleware from "@/lib/server/middleware";
import { orderController } from "@/lib/server/order/controller";
import { stayController } from "@/lib/server/stay/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!, auth.userType!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  // Extract query parameters (period for date filtering)
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams);

  return await analyticsController.getAnalytics({ 
    hotelId: auth.hotelId,
    query 
  });
}

export const GET = utils.withErrorHandling(handler);
