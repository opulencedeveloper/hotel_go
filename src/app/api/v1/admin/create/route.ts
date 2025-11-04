import { adminController } from "@/lib/server/admin/controller";
import { IAdminLogin, ICreateAdmin } from "@/lib/server/admin/interface";
import { adminValidator } from "@/lib/server/admin/validator";
import { authController } from "@/lib/server/auth/controller";
import { ILogin } from "@/lib/server/auth/interface";
import { authValidator } from "@/lib/server/auth/validator";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";


async function handler(request: Request) {
  await connectDB();

  const body: ICreateAdmin = await request.json();

  const validationResponse = adminValidator.adminLogIn(body);
 if (!validationResponse.valid) return validationResponse.response!;
 
  return await adminController.createAdmin(body);
}

export const POST = utils.withErrorHandling(handler);
