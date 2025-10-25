'use client';

import { Plus, Edit, Trash2 } from "lucide-react";
import { RatePlan } from "@/types";

interface RatePlansTabProps {
  ratePlans: RatePlan[];
  onAddRatePlan: () => void;
  onEditRatePlan: (plan: RatePlan) => void;
  onDeleteRatePlan: (planId: string) => void;
}

export default function RatePlansTab({ 
  ratePlans, 
  onAddRatePlan, 
  onEditRatePlan, 
  onDeleteRatePlan 
}: RatePlansTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-secondary-900">
          Rate Plans
        </h3>
        <button
          onClick={onAddRatePlan}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Rate Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ratePlans.map((plan) => (
          <div key={plan.rate_plan_id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-secondary-900">
                {plan.name}
              </h4>
              <span className="text-sm font-medium text-primary-600">
                {plan.code}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">
                  Sample Rate
                </span>
                <span className="text-sm font-medium text-secondary-900">
                  ${Object.values(plan.rates)[0] || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">
                  Status
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    plan.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {plan.status}
                </span>
              </div>

              <div>
                <span className="text-sm text-secondary-600">
                  Rules
                </span>
                <div className="text-xs text-secondary-500 mt-1">
                  <p>
                    • Cancellation: {plan.rules.cancellation_policy}
                  </p>
                  <p>
                    • Advance Booking: {plan.rules.advance_booking_days}{" "}
                    days
                  </p>
                  <p>• Min Stay: {plan.rules.min_los} nights</p>
                  <p>• Max Stay: {plan.rules.max_los} nights</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-secondary-200">
              <button 
                onClick={() => onEditRatePlan(plan)}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                <Edit className="w-3 h-3 inline mr-1" />
                Edit
              </button>
              <button 
                onClick={() => onDeleteRatePlan(plan.rate_plan_id)}
                className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




