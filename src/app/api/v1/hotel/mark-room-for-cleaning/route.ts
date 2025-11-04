import { authController } from "@/lib/server/auth/controller";
import { authValidator } from "@/lib/server/auth/validator";
import { hotelController } from "@/lib/server/hotel/controller";
import { IHotelRegistrationInput } from "@/lib/server/hotel/interface";
import { hotelValidator } from "@/lib/server/hotel/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { roomController } from "@/lib/server/room/controller";
import { IAddRoomUserInput } from "@/lib/server/room/interface";
import { roomValidator } from "@/lib/server/room/validator";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";
import { Types } from "mongoose";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const licenceKey = await GeneralMiddleware.hasLicenseKey(auth.ownerId);
  if (!licenceKey.valid) return licenceKey.response!;

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );
  if (!user.valid) return user.response!;

  const validationResponse = roomValidator.markRoomForCleaning(request);
  if (!validationResponse.valid) return validationResponse.response!;

  return await roomController.markRoomForCleaning(validationResponse.roomId!);
}

export const PATCH = utils.withErrorHandling(handler);
