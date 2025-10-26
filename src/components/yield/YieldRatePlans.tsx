'use client';

interface RatePlan {
  rate_plan_id: string;
  name: string;
  code: string;
  status: string;
  rates: Record<string, number>;
  rules: {
    min_los: number;
    max_los: number;
  };
}

interface YieldRatePlansProps {
  ratePlans: RatePlan[];
}

export default function YieldRatePlans({ ratePlans }: YieldRatePlansProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Rate Plans</h2>
      </div>
      <div className="p-6">
        {ratePlans.length > 0 ? (
          <div className="space-y-4">
            {ratePlans.map((plan) => (
              <div key={plan.rate_plan_id} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{plan.name}</h3>
                    <p className="text-sm text-secondary-600">Code: {plan.code}</p>
                    <p className="text-sm text-secondary-500 mt-1">
                      Min LOS: {plan.rules.min_los} • Max LOS: {plan.rules.max_los}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-secondary-900">${Object.values(plan.rates)[0]}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-secondary-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Rate Plans</h3>
            <p className="text-secondary-500">Rate plans will appear here when configured.</p>
          </div>
        )}
      </div>
    </div>
  );
}
