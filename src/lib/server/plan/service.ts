import { ICreatePlan } from "./interface";
import Plan from "./entity";

class PlanService {
  public async createPlan(input: ICreatePlan) {
    const plan = new Plan({
      ...input,
    });

    await plan.save();

    return;
  }

  public async fetchPlans() {
    // Use .lean() to return plain JavaScript objects instead of Mongoose documents
    // This is required for passing data to Client Components in Next.js
    return await Plan.find().lean();
  }
}

export const planService = new PlanService();
