import { houseKeepingController } from "@/lib/server/house-keeping/controller";
import { IMarkHouseKeepingUserInputAsComplete } from "@/lib/server/house-keeping/interface";
import { houseKeepingValidator } from "@/lib/server/house-keeping/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";
import { Types } from "mongoose";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const licenceKey = await GeneralMiddleware.hasLicenseKey(auth.ownerId);
  if (!licenceKey.valid) return licenceKey.response!;

  const body: IMarkHouseKeepingUserInputAsComplete = await request.json();

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = houseKeepingValidator.markAsCompleted(
    body,
    request
  );
  if (!validationResponse.valid) return validationResponse.response!;

  return await houseKeepingController.markRoomsAsCleaned({
    ...body,
    houseKeepingId: new Types.ObjectId(validationResponse.houseKeepingId!),
  });
}

export const PUT = utils.withErrorHandling(handler);
