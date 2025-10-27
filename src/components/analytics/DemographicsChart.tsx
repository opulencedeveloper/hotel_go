'use client';

interface DemographicsChartProps {
  demographics: {
    totalAdults: number;
    totalChildren: number;
    totalGuests: number;
    adultPercentage: string;
    childrenPercentage: string;
  };
}

export default function DemographicsChart({ demographics }: DemographicsChartProps) {
  const { totalAdults, totalChildren, totalGuests, adultPercentage, childrenPercentage } = demographics;
  
  const adultsPercentage = totalGuests > 0 ? ((totalAdults / totalGuests) * 100) : 0;
  const childrenPercentageNum = totalGuests > 0 ? ((totalChildren / totalGuests) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Guest Demographics</h2>
      </div>
      <div className="p-6">
        {totalGuests === 0 ? (
          <div className="flex items-center justify-center h-32 text-secondary-500">
            <p className="text-sm">No demographic data available for selected period</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Guests */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalGuests.toLocaleString()}</p>
              <p className="text-sm text-secondary-600 mt-1">Total Guests</p>
            </div>

            {/* Demographics Breakdown */}
            <div className="space-y-4">
              {/* Adults */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-secondary-900">Adults</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-secondary-900">{totalAdults.toLocaleString()}</span>
                    <span className="text-xs text-secondary-600 ml-2">{adultPercentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${adultsPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Children */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-secondary-900">Children</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-secondary-900">{totalChildren.toLocaleString()}</span>
                    <span className="text-xs text-secondary-600 ml-2">{childrenPercentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${childrenPercentageNum}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 border-t border-secondary-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-secondary-900">{totalAdults.toLocaleString()}</p>
                  <p className="text-xs text-secondary-600">Adult Guests</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-secondary-900">{totalChildren.toLocaleString()}</p>
                  <p className="text-xs text-secondary-600">Children</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
