import GeneralMiddleware from "@/lib/server/middleware";
import { roomController } from "@/lib/server/room/controller";
import { IAddRoomUserInput } from "@/lib/server/room/interface";
import { roomValidator } from "@/lib/server/room/validator";
import { roomTypeController } from "@/lib/server/roomType/controller";
import {
  IAddRoomTypeUserInput,
  IEditRoomTypeUserInput,
} from "@/lib/server/roomType/interface";
import { roomTypeValidator } from "@/lib/server/roomType/validator";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const body: IEditRoomTypeUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = roomTypeValidator.editAddRoomType(body, request);
  if (!validationResponse.valid) return validationResponse.response!;

  return await roomTypeController.editRoomType(
    { ...body, roomTypeId: validationResponse.roomTypeId! },
    { hotelId: auth.hotelId }
  );
}

export const PUT = utils.withErrorHandling(handler);
