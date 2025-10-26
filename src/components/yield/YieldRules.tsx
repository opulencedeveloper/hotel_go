'use client';

import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface YieldRule {
  rule_id: string;
  name: string;
  status: string;
  conditions: {
    day_of_week: string[];
    days_ahead: number;
    occupancy_threshold: number;
  };
  actions: {
    rate_adjustment: number;
    min_los: number;
    max_los: number;
  };
}

interface YieldRulesProps {
  rules: YieldRule[];
  onAddRule: () => void;
  onViewRule?: (rule: YieldRule) => void;
  onEditRule?: (rule: YieldRule) => void;
  onDeleteRule?: (rule: YieldRule) => void;
}

export default function YieldRules({ 
  rules, 
  onAddRule, 
  onViewRule, 
  onEditRule, 
  onDeleteRule 
}: YieldRulesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Active Yield Rules</h2>
          <button 
            onClick={onAddRule}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        {rules.length > 0 ? (
          <div className="space-y-4">
            {rules.map((rule) => (
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
                    {onViewRule && (
                      <button 
                        onClick={() => onViewRule(rule)}
                        className="p-2 text-secondary-400 hover:text-secondary-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEditRule && (
                      <button 
                        onClick={() => onEditRule(rule)}
                        className="p-2 text-secondary-400 hover:text-secondary-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteRule && (
                      <button 
                        onClick={() => onDeleteRule(rule)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-secondary-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Yield Rules</h3>
            <p className="text-secondary-500 mb-4">Create your first yield management rule to optimize pricing.</p>
            <button 
              onClick={onAddRule}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create First Rule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
