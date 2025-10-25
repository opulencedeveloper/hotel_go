import GeneralMiddleware from "@/lib/server/middleware";
import { orderController } from "@/lib/server/order/controller";
import { IUpdateOrderStatus } from "@/lib/server/order/interface";
import { orderValidator } from "@/lib/server/order/validator";
import { roomTypeValidator } from "@/lib/server/roomType/validator";
import { stayController } from "@/lib/server/stay/controller";
import { IEditStayUserInput } from "@/lib/server/stay/interface";
import { stayValidator } from "@/lib/server/stay/validator";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";
import { Types } from "mongoose";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const body: IUpdateOrderStatus = await request.json();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = orderValidator.updateOrderStatus(body, request);
  if (!validationResponse.valid) return validationResponse.response!;

  return await orderController.updateOrderStatus(
    { ...body, orderId: new Types.ObjectId(validationResponse.orderId!) },
    { hotelId: auth.hotelId }
  );
}

export const PUT = utils.withErrorHandling(handler);
