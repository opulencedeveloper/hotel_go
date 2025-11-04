import { menuController } from "@/lib/server/menu/controller";
import { ICreateMenuUserInput } from "@/lib/server/menu/interface";
import { menuValidator } from "@/lib/server/menu/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const body: ICreateMenuUserInput = await request.json();

  const licenceKey = await GeneralMiddleware.hasLicenseKey(auth.ownerId);
  if (!licenceKey.valid) return licenceKey.response!;

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = menuValidator.createMenu(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await menuController.createMenu(body, { hotelId: auth.hotelId });
}

export const POST = utils.withErrorHandling(handler);
