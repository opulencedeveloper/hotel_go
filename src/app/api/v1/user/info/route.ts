import GeneralMiddleware from "@/lib/server/middleware";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();
console.log("authauthauth", auth)
  const user = await GeneralMiddleware.doesUserExist(auth.userId!, auth.userType!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  return await userController.fetchUserDetails(
    { ownerId: auth.ownerId! },
    user.user!
  );
}

export const GET = utils.withErrorHandling(handler);
