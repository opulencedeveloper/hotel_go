import GeneralMiddleware from "@/lib/server/middleware";
import { roomTypeValidator } from "@/lib/server/roomType/validator";
import { stayController } from "@/lib/server/stay/controller";
import { IEditStayUserInput } from "@/lib/server/stay/interface";
import { stayValidator } from "@/lib/server/stay/validator";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const licenceKey = await GeneralMiddleware.hasLicenseKey(auth.ownerId);
  if (!licenceKey.valid) return licenceKey.response!;

  const body: IEditStayUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = stayValidator.editStay(body, request);
  if (!validationResponse.valid) return validationResponse.response!;

  return await stayController.editStay(
    { ...body, stayId: validationResponse.stayId! },
    { hotelId: auth.hotelId }
  );
}

export const PUT = utils.withErrorHandling(handler);
