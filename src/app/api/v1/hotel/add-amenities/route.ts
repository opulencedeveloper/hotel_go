import { hotelController } from "@/lib/server/hotel/controller";
import { hotelValidator } from "@/lib/server/hotel/validator";
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

  const licenceKey = await GeneralMiddleware.hasLicenseKey(auth.ownerId);
  if (!licenceKey.valid) return licenceKey.response!;

  const body: IAddHotelAmenities = await request.json();

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );

  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);

  if (!hotelExist.valid) return user.response!;

  const validationResponse = hotelValidator.addHotelAmenities(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await hotelController.addHotelAmenities(body, {
    hotelId: auth.hotelId,
  });
}

export const PATCH = utils.withErrorHandling(handler);
