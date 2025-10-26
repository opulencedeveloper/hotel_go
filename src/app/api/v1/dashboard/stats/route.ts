import { facilityController } from "@/lib/server/facility/controller";
import { hotelServiceController } from "@/lib/server/hotelService/controller";
import GeneralMiddleware from "@/lib/server/middleware";
import { statsController } from "@/lib/server/stats/controller";
import { stayController } from "@/lib/server/stay/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  // Create custom request object
  const customReq = {
    hotelId: auth.hotelId,
  };

  return await statsController.getDashBordStatistics(customReq);
}

export const GET = utils.withErrorHandling(handler);
