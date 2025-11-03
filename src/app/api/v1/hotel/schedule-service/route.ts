import { ICreateHotelServiceUserInput } from "@/lib/server/hotelService/interface";
import GeneralMiddleware from "@/lib/server/middleware";
import { roomController } from "@/lib/server/room/controller";
import { IAddRoomUserInput } from "@/lib/server/room/interface";
import { roomValidator } from "@/lib/server/room/validator";
import { scheduleServiceController } from "@/lib/server/scheduleService/controller";
import { ICreateScheduledServiceUserInput } from "@/lib/server/scheduleService/interface";
import { scheduleSeviceValidator } from "@/lib/server/scheduleService/validator";
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

  console.log("Hererrer")

  const body: ICreateScheduledServiceUserInput = await request.json();

  const user = await GeneralMiddleware.doesUserExist(auth.userId!, auth.userType!);
  if (!user.valid) return user.response!;

  const hotelExist = await GeneralMiddleware.hotelExist(auth.hotelId!);
    if (!hotelExist.valid) return user.response!;

  const validationResponse = scheduleSeviceValidator.createScheduleService(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await scheduleServiceController.createScheduleService(body, { hotelId: auth.hotelId });
}

export const POST = utils.withErrorHandling(handler);
