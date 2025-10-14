'use client';

import Layout from '@/components/Layout';
import { TrendingUp, DollarSign, BarChart3, Target, Calendar, AlertTriangle, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { mockYieldRules, mockForecasts, mockRatePlans } from '@/data/mockData';
import { useState } from 'react';

export default function YieldPage() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);

  const activeRules = mockYieldRules.filter(rule => rule.status === 'active');
  const upcomingForecasts = mockForecasts.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
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
                  <span className="text-purple-100">{activeRules.length} Active Rules</span>
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
                  onClick={() => setShowRuleModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Rule</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <BarChart3 className="w-4 h-4" />
                  <span>Market Analysis</span>
                </button>
                <button className="bg-white text-purple-600 hover:bg-purple-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Calendar className="w-4 h-4" />
                  <span>Forecast</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Current ADR</p>
                <p className="text-2xl font-bold text-secondary-900">$156</p>
                <p className="text-sm text-green-600">+8.3% vs last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">RevPAR</p>
                <p className="text-2xl font-bold text-secondary-900">$133</p>
                <p className="text-sm text-green-600">+12.5% vs last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Occupancy</p>
                <p className="text-2xl font-bold text-secondary-900">85%</p>
                <p className="text-sm text-green-600">+5.2% vs last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">ARR</p>
                <p className="text-2xl font-bold text-secondary-900">$2,340</p>
                <p className="text-sm text-green-600">+6.7% vs last month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Yield Rules */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Active Yield Rules</h2>
              <button 
                onClick={() => setShowRuleModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Rule</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeRules.map((rule) => (
                <div key={rule.rule_id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary-900">{rule.name}</h3>
                      <p className="text-sm text-secondary-600 mt-1">
                        {rule.conditions.day_of_week.join(', ')} • {rule.conditions.days_ahead} days ahead • {rule.conditions.occupancy_threshold}% occupancy
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-green-600 font-medium">+{rule.actions.rate_adjustment}% rate adjustment</span>
                        <span className="text-secondary-500">Min LOS: {rule.actions.min_los}</span>
                        <span className="text-secondary-500">Max LOS: {rule.actions.max_los}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-secondary-400 hover:text-secondary-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-secondary-400 hover:text-secondary-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate Plans & Forecasts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rate Plans */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Rate Plans</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockRatePlans.map((plan) => (
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
            </div>
          </div>

          {/* Forecasts */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Upcoming Forecasts</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingForecasts.map((forecast) => (
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
