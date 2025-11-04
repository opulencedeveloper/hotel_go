import { facilityController } from "@/lib/server/facility/controller";
import { ICreateFacilityUserInput } from "@/lib/server/facility/interface";
import { facilityValidator } from "@/lib/server/facility/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const licenceKey = await GeneralMiddleware.hasLicenseKey(auth.ownerId);
  if (!licenceKey.valid) return licenceKey.response!;

  const body: ICreateFacilityUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = facilityValidator.createFacility(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await facilityController.createFacility(body, {
    hotelId: auth.hotelId,
  });
}

export const POST = utils.withErrorHandling(handler);
