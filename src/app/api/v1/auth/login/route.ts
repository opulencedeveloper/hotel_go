import { authController } from "@/lib/server/auth/controller";
import { ILogin } from "@/lib/server/auth/interface";
import { authValidator } from "@/lib/server/auth/validator";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";


async function handler(request: Request) {
  await connectDB();

  const body: ILogin = await request.json();

  const validationResponse = authValidator.logIn(body);
 if (!validationResponse.valid) return validationResponse.response!;
 
  return await authController.logIn(body);
}

export const POST = utils.withErrorHandling(handler);
