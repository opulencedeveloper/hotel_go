import { authController } from "@/lib/server/auth/controller";
import { authValidator } from "@/lib/server/auth/validator";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";
import { IVerifyEmail } from "@/lib/server/utils/interface";

async function handler(request: Request) {
  await connectDB();

  const body: IVerifyEmail = await request.json();

  const validationResponse = authValidator.validateEmail(body.email);
  if (!validationResponse.valid) return validationResponse.response!;

  return await authController.forgotPassword(body);
}

export const POST = utils.withErrorHandling(handler);
