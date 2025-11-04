import { hotelController } from "@/lib/server/hotel/controller";
import { hotelValidator } from "@/lib/server/hotel/validator";
import { licenceKeyController } from "@/lib/server/license-key/controller";
import { IActivateLicenceKey } from "@/lib/server/license-key/interface";
import { licenceKeyValidator } from "@/lib/server/license-key/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { roomController } from "@/lib/server/room/controller";
import {
  IAddHotelAmenities,
  IAddRoomUserInput,
} from "@/lib/server/room/interface";
import { roomValidator } from "@/lib/server/room/validator";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const body: IActivateLicenceKey = await request.json();

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );

  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);

  if (!hotelExist.valid) return user.response!;

  const validationResponse = licenceKeyValidator.activateLicenceKey(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await licenceKeyController.activateLicenceKey(body, {
    ownerId: auth.ownerId,
  });
}

export const PATCH = utils.withErrorHandling(handler);
