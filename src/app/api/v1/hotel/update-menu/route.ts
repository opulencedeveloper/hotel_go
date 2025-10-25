import { menuController } from "@/lib/server/menu/controller";
import { IEditMenuUserInput } from "@/lib/server/menu/interface";
import { menuValidator } from "@/lib/server/menu/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { roomController } from "@/lib/server/room/controller";
import {
  IAddRoomUserInput,
  IEditRoomUserInput,
} from "@/lib/server/room/interface";
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
import { Types } from "mongoose";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const body: IEditMenuUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = menuValidator.editMenu(body, request);
  if (!validationResponse.valid) return validationResponse.response!;

  return await menuController.updateMenu(
    { ...body, menuId: new Types.ObjectId(validationResponse.menuId!) },
    { hotelId: auth.hotelId }
  );
}

export const PUT = utils.withErrorHandling(handler);
