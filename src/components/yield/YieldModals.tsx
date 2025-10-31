'use client';

import { X, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';

interface Forecast {
  forecast_id: string;
  forecast_type: string;
  period_start: string;
  period_end: string;
  predicted_value: number;
  confidence_level: number;
}

interface YieldModalsProps {
  showMarketAnalysisModal: boolean;
  showForecastModal: boolean;
  onCloseMarketAnalysis: () => void;
  onCloseForecast: () => void;
  forecasts: Forecast[];
}

export default function YieldModals({
  showMarketAnalysisModal,
  showForecastModal,
  onCloseMarketAnalysis,
  onCloseForecast,
  forecasts
}: YieldModalsProps) {
  return (
    <>
      {/* Market Analysis Modal */}
      {showMarketAnalysisModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Market Analysis</h2>
              <button
                onClick={onCloseMarketAnalysis}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Market Position</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">Competitive</p>
                  <p className="text-sm text-blue-700">vs. 12 competitors</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Avg. Market Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">$185</p>
                  <p className="text-sm text-green-700">+5% vs. last month</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Occupancy Trend</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">78%</p>
                  <p className="text-sm text-purple-700">Market average</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">Competitor Analysis</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Grand Plaza Hotel', rate: 195, occupancy: 82, trend: 'up' },
                    { name: 'Luxury Suites', rate: 220, occupancy: 75, trend: 'down' },
                    { name: 'Business Inn', rate: 165, occupancy: 85, trend: 'up' },
                    { name: 'City Center Hotel', rate: 180, occupancy: 78, trend: 'stable' }
                  ].map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">{competitor.name}</p>
                        <p className="text-sm text-secondary-600">Occupancy: {competitor.occupancy}%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-secondary-900">${competitor.rate}</p>
                        <p className={`text-xs ${competitor.trend === 'up' ? 'text-green-600' : competitor.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                          {competitor.trend === 'up' ? '↗' : competitor.trend === 'down' ? '↘' : '→'} {competitor.trend}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
              <button
                onClick={onCloseMarketAnalysis}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Modal */}
      {showForecastModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Revenue Forecast</h2>
              <button
                onClick={onCloseForecast}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">This Week</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">$45,200</p>
                  <p className="text-sm text-green-700">+8% vs. last week</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">This Month</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">$198,500</p>
                  <p className="text-sm text-blue-700">+12% vs. last month</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Next Quarter</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">$625,000</p>
                  <p className="text-sm text-purple-700">+15% vs. last quarter</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">Upcoming Forecasts</h3>
                <div className="space-y-3">
                  {forecasts.map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">{forecast.forecast_type.charAt(0).toUpperCase() + forecast.forecast_type.slice(1)} Forecast</p>
                        <p className="text-sm text-secondary-600">{forecast.period_start} - {forecast.period_end}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-secondary-900">${forecast.predicted_value.toLocaleString()}</p>
                        <p className="text-xs text-secondary-600">Confidence: {Math.round(forecast.confidence_level * 100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
              <button
                onClick={onCloseForecast}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
