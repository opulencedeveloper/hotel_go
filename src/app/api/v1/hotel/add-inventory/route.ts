import { inventoryController } from "@/lib/server/inventory/controller";
import { IAddInventoryItemUserInput } from "@/lib/server/inventory/inteface";
import { inventoryValidator } from "@/lib/server/inventory/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const licenceKey = await GeneralMiddleware.hasLicenseKey(auth.ownerId);
  if (!licenceKey.valid) return licenceKey.response!;

  const body: IAddInventoryItemUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(
    auth.userId!,
    auth.userType!
  );
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = inventoryValidator.addInventory(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await inventoryController.addInventory(body, {
    hotelId: auth.hotelId,
  });
}

export const POST = utils.withErrorHandling(handler);
