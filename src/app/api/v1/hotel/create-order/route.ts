import { hotelServiceController } from "@/lib/server/hotelService/controller";
import { ICreateHotelServiceUserInput } from "@/lib/server/hotelService/interface";
import { hotelServiceValidator } from "@/lib/server/hotelService/valdator";
import { menuController } from "@/lib/server/menu/controller";
import { ICreateMenuUserInput } from "@/lib/server/menu/interface";
import { menuValidator } from "@/lib/server/menu/validator";
import GeneralMiddleware from "@/lib/server/middleware";
import { orderController } from "@/lib/server/order/controller";
import { ICreateOrderUserInput } from "@/lib/server/order/interface";
import { orderValidator } from "@/lib/server/order/validator";
import { roomController } from "@/lib/server/room/controller";
import { IAddRoomUserInput } from "@/lib/server/room/interface";
import { roomValidator } from "@/lib/server/room/validator";
import { stayController } from "@/lib/server/stay/controller";
import { IAddStayUserInput } from "@/lib/server/stay/interface";
import { stayValidator } from "@/lib/server/stay/validator";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const body: ICreateOrderUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
    if (!hotelExist.valid) return user.response!;

  const validationResponse = orderValidator.createOrder(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await orderController.createOrder(body, { hotelId: auth.hotelId });
}

export const POST = utils.withErrorHandling(handler);
