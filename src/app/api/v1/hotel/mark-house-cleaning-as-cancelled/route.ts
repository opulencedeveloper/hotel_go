import { houseKeepingController } from "@/lib/server/house-keeping/controller";
import { IMarkHouseKeepingUserInputAsCancelled, IMarkHouseKeepingUserInputAsComplete } from "@/lib/server/house-keeping/interface";
import { houseKeepingValidator } from "@/lib/server/house-keeping/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";
import { Types } from "mongoose";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;
  

  await connectDB();
   console.log("------------aa-aa--a----")

  const user = await GeneralMiddleware.doesUserExist(auth.userId!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;




  const validationResponse = houseKeepingValidator.markAsCancelled(request);
  if (!validationResponse.valid) return validationResponse.response!;

  return await houseKeepingController.markRoomsAsCancelled({ houseKeepingId: new Types.ObjectId(validationResponse.houseKeepingId!)});
}

export const PUT = utils.withErrorHandling(handler);
