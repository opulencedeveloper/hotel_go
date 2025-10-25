import { hotelServiceController } from "@/lib/server/hotelService/controller";
import { IEditHotelServiceUserInput } from "@/lib/server/hotelService/interface";
import { hotelServiceValidator } from "@/lib/server/hotelService/valdator";
import GeneralMiddleware from "@/lib/server/middleware";
import { roomController } from "@/lib/server/room/controller";
import { IAddRoomUserInput, IEditRoomUserInput } from "@/lib/server/room/interface";
import { roomValidator } from "@/lib/server/room/validator";
import { roomTypeController } from "@/lib/server/roomType/controller";
import {
  IAddRoomTypeUserInput,
  IEditRoomTypeUserInput,
} from "@/lib/server/roomType/interface";
import { roomTypeValidator } from "@/lib/server/roomType/validator";
import { scheduleServiceController } from "@/lib/server/scheduleService/controller";
import { IEditScheduledServiceUserInput } from "@/lib/server/scheduleService/interface";
import { scheduleSeviceValidator } from "@/lib/server/scheduleService/validator";
import { userController } from "@/lib/server/user/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  const auth = utils.verifyAuth();
  if (!auth.valid) return auth.response!;

  await connectDB();

  const body: IEditScheduledServiceUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
  if (!hotelExist.valid) return user.response!;

  const validationResponse = scheduleSeviceValidator.ediScheduledService(body, request);
  if (!validationResponse.valid) return validationResponse.response!;

  return await scheduleServiceController.editScheduledService(
    { ...body, scheduledServiceId: validationResponse.scheduledServiceId! },
    { hotelId: auth.hotelId }
  );
}

export const PUT = utils.withErrorHandling(handler);
