import { dashboardSummaryController } from "@/lib/server/dashboard-summary/controller";
import GeneralMiddleware from "@/lib/server/middleware";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!, auth.userType!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return hotelExist.response!;

  // Create custom request object
  const customReq = {
    hotelId: auth.hotelId,
    query: Object.fromEntries(new URL(request.url).searchParams),
  };

  return await dashboardSummaryController.getRoomSummary(customReq);
}

export const GET = utils.withErrorHandling(handler);
