import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { ICreatePlan } from "./interface";
import { planService } from "./service";

class PlanController {
  public async createPlan(body: ICreatePlan) {
    await planService.createPlan(body);

    return utils.customResponse({
      status: 400,
      message: MessageResponse.Success,
      description: "Plan created successfully!",
      data: null,
    });
  }

  public async fetchPlans() {
    const plans = await planService.fetchPlans();

    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Plan created successfully!",
      data: plans,
    });
  }
}

export const planController = new PlanController();
