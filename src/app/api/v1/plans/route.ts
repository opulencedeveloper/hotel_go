import { planController } from "@/lib/server/plan/controller";
import { utils } from "@/lib/server/utils";
import { connectDB } from "@/lib/server/utils/db";

async function handler() {
  await connectDB();

  return await planController.fetchPlans();
}

export const GET = utils.withErrorHandling(handler);
