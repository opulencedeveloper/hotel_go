import { dashboardStatsController } from "@/lib/server/dashboard-stats/controller";
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

  // Extract period from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const period = pathParts[pathParts.length - 1];

  // Create custom request object
  const customReq = {
    hotelId: auth.hotelId,
    user: auth.userId,
    params: { period },
  };

  return await dashboardStatsController.getDashboardStatsByPeriod(customReq);
}

export const GET = utils.withErrorHandling(handler);
