'use client';

import { TrendingUp, BarChart3, Calendar, Plus } from 'lucide-react';

interface YieldHeaderProps {
  activeRulesCount: number;
  onNewRule: () => void;
  onMarketAnalysis: () => void;
  onForecast: () => void;
}

export default function YieldHeader({ 
  activeRulesCount, 
  onNewRule, 
  onMarketAnalysis, 
  onForecast 
}: YieldHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Yield & Rate Management</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">Dynamic Pricing Dashboard</span>
            </div>
          </div>
          
          <p className="text-purple-100 text-lg mb-6">
            Optimize your room rates and maximize revenue through intelligent pricing strategies.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-purple-100">{activeRulesCount} Active Rules</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-purple-200">Last Update:</span>
              <span className="font-medium">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-purple-200">Market Position:</span>
              <span className="font-medium">Competitive</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="flex flex-col gap-3">
            <button 
              onClick={onNewRule}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Plus className="w-4 h-4" />
              <span>New Rule</span>
            </button>
            <button 
              onClick={onMarketAnalysis}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Market Analysis</span>
            </button>
            <button 
              onClick={onForecast}
              className="bg-white text-purple-600 hover:bg-purple-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Calendar className="w-4 h-4" />
              <span>Forecast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
