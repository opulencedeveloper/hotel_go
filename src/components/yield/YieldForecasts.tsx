'use client';

interface Forecast {
  forecast_id: string;
  forecast_type: string;
  period_start: string;
  period_end: string;
  predicted_value: number;
  confidence_level: number;
}

interface YieldForecastsProps {
  forecasts: Forecast[];
}

export default function YieldForecasts({ forecasts }: YieldForecastsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Upcoming Forecasts</h2>
      </div>
      <div className="p-6">
        {forecasts.length > 0 ? (
          <div className="space-y-4">
            {forecasts.map((forecast) => (
              <div key={forecast.forecast_id} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900 capitalize">
                      {forecast.forecast_type} Forecast
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {forecast.period_start} - {forecast.period_end}
                    </p>
                    <p className="text-sm text-secondary-500 mt-1">
                      Confidence: {Math.round(forecast.confidence_level * 100)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-secondary-900">
                      {forecast.predicted_value}%
                    </p>
                    <div className="w-16 h-2 bg-secondary-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-purple-600 rounded-full" 
                        style={{ width: `${forecast.confidence_level * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-secondary-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Forecasts</h3>
            <p className="text-secondary-500">Revenue forecasts will appear here when available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
