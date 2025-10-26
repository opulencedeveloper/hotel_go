'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import YieldHeader from './YieldHeader';
import YieldKPICards from './YieldKPICards';
import YieldRules from './YieldRules';
import YieldRatePlans from './YieldRatePlans';
import YieldForecasts from './YieldForecasts';
import YieldModals from './YieldModals';

export default function YieldBody() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showMarketAnalysisModal, setShowMarketAnalysisModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  
  // Get data from Redux state
  const stay = useSelector((state: RootState) => state.stay);
  const order = useSelector((state: RootState) => state.order);
  const dashboardSummary = useSelector((state: RootState) => state.dashboardSummary);
  
  const { stays } = stay;
  const { dashboardSummary: summary, quickSummary: quick } = dashboardSummary;

  // Calculate yield metrics from actual data
  const calculateYieldMetrics = () => {
    const totalStays = stays.length;
    const totalRevenue = stays.reduce((sum, stay) => sum + (stay.totalAmount || 0), 0);
    const totalRooms = summary?.rooms?.total || 0;
    const occupiedRooms = summary?.rooms?.occupied || 0;
    
    const adr = totalStays > 0 ? totalRevenue / totalStays : 0;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    const revpar = (adr * occupancyRate) / 100;
    const arr = totalRevenue; // Average Revenue per Room
    
    return {
      adr: Math.round(adr),
      revpar: Math.round(revpar),
      occupancy: Math.round(occupancyRate),
      arr: Math.round(arr)
    };
  };

  const yieldMetrics = calculateYieldMetrics();
  
  // Since we don't have yield rules, rate plans, or forecasts in Redux state,
  // we'll show empty arrays or calculated data
  const activeRules: any[] = []; // No yield rules in current Redux state
  const ratePlans: any[] = []; // No rate plans in current Redux state
  const forecasts: any[] = []; // No forecasts in current Redux state

  return (
    <div className="space-y-6">
      {/* Header */}
      <YieldHeader
        activeRulesCount={activeRules.length}
        onNewRule={() => setShowRuleModal(true)}
        onMarketAnalysis={() => setShowMarketAnalysisModal(true)}
        onForecast={() => setShowForecastModal(true)}
      />

      {/* KPI Cards */}
      <YieldKPICards metrics={yieldMetrics} />

      {/* Active Yield Rules */}
      <YieldRules
        rules={activeRules}
        onAddRule={() => setShowRuleModal(true)}
      />

      {/* Rate Plans & Forecasts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YieldRatePlans ratePlans={ratePlans} />
        <YieldForecasts forecasts={forecasts} />
      </div>

      {/* Modals */}
      <YieldModals
        showMarketAnalysisModal={showMarketAnalysisModal}
        showForecastModal={showForecastModal}
        onCloseMarketAnalysis={() => setShowMarketAnalysisModal(false)}
        onCloseForecast={() => setShowForecastModal(false)}
        forecasts={forecasts}
      />
    </div>
  );
}
