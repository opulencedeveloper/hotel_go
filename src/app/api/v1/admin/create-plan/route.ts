import { planController } from "@/lib/server/plan/controller";
import { ICreatePlan } from "@/lib/server/plan/interface";
import { planValidator } from "@/lib/server/plan/validator";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";


async function handler(request: Request) {
  await connectDB();

  const body: ICreatePlan = await request.json();

  const validationResponse = planValidator.createPlan(body);
 if (!validationResponse.valid) return validationResponse.response!;
 
  return await planController.createPlan(body);
}

export const POST = utils.withErrorHandling(handler);
