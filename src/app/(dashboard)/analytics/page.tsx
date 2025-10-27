"use client";

import AnalyticsBody from "@/components/analytics/AnalyticsBody";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { analyticsActions } from "@/store/redux/analytics-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const dispatch = useDispatch();
  const { isLoading, error, sendHttpRequest: fetchAnalytics } = useHttp();

  // ✅ Select analytics data from Redux
  const analytics = useSelector((state: RootState) => state.analytics);
  const { fetchedRooms, fetchedStays, fetchedOrders } = analytics;

  const handleAnalyticsResponse = (res: any) => {
    const resData = res?.data?.data;

    const { stays, rooms, orders } = resData;

    dispatch(analyticsActions.setRooms(rooms));
    dispatch(analyticsActions.setStays(stays));
    dispatch(analyticsActions.setOrders(orders));
  };

  // ✅ Fetch analytics on initial page load only
  useEffect(() => {
    setMounted(true);

    // Initial fetch when page loads
    if (!fetchedRooms || !fetchedStays || !fetchedOrders) {
      fetchAnalytics({
        successRes: handleAnalyticsResponse,
        requestConfig: {
          url: "/hotel/get-analytics",
          method: "GET",
          params: { period: selectedPeriod },
        },
      });
    }
  }, []);

  // ✅ Manual fetch function that can be triggered by button
  const refetchAnalytics = () => {
    fetchAnalytics({
      successRes: handleAnalyticsResponse,
      requestConfig: {
        url: "/hotel/get-analytics",
        method: "GET",
        params: { period: selectedPeriod },
      },
    });
  };

  // ✅ Loading state
  if (isLoading || !mounted) {
    return <PageLoadingSpinner />;
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorDisplay
            error={error}
            title="Failed to load analytics"
            description="We couldn't load your analytics data. This might be due to a network issue or server problem."
            onRetry={refetchAnalytics}
            showRetry={true}
            size="large"
            variant="error"
          />
        </div>
      </div>
    );
  }

  // ✅ Main body
  return (
    <AnalyticsBody 
      selectedPeriod={selectedPeriod} 
      onPeriodChange={setSelectedPeriod}
      onRefetch={refetchAnalytics}
      isLoading={isLoading}
    />
  );
}
