import { authController } from "@/lib/server/auth/controller";
import { IForgotPasswordUserInput } from "@/lib/server/auth/interface";
import { authValidator } from "@/lib/server/auth/validator";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";


async function handler(request: Request) {
  await connectDB();

  const body: IForgotPasswordUserInput = await request.json();

  const validationResponse = authValidator.resetPasswordWithForgotPasswordOtp(body);
  if (!validationResponse.valid) return validationResponse.response!;

  return await authController.changePasswordWithForgotPasswordOtp(body);
}

export const POST = utils.withErrorHandling(handler);


