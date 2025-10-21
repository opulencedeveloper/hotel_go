
import { hotelController } from "@/lib/server/hotel/controller";
import { IHotelRegistrationUserInput } from "@/lib/server/hotel/interface";
import { hotelValidator } from "@/lib/server/hotel/validator";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler(request: Request) {
  await connectDB();

  const body: IHotelRegistrationUserInput = await request.json();

  console.log(body);

  const validationResponse = hotelValidator.registerHotel(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await hotelController.registerHotel(body);
}

export const POST = utils.withErrorHandling(handler);
