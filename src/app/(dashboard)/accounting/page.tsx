"use client";

import AccountingBody from "@/components/accounting/AccountingBody";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { analyticsActions } from "@/store/redux/analytics-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AccountingPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const dispatch = useDispatch();
  const { isLoading, error, sendHttpRequest: fetchAnalytics } = useHttp();

  // Select analytics data from Redux (same as analytics page)
  const analytics = useSelector((state: RootState) => state.analytics);
  const { fetchedRooms, fetchedStays, fetchedOrders, fetchedScheduledServices } = analytics;

  const handleAccountingResponse = (res: any) => {
    const resData = res?.data?.data;

    const { stays, rooms, orders, scheduledServices } = resData;

    dispatch(analyticsActions.setRooms(rooms));
    dispatch(analyticsActions.setStays(stays));
    dispatch(analyticsActions.setOrders(orders));
    dispatch(analyticsActions.setScheduledServices(scheduledServices || []));
  };

  // Fetch analytics on initial page load only
  useEffect(() => {
    setMounted(true);

    // Initial fetch when page loads
    if (!fetchedRooms || !fetchedStays || !fetchedOrders || !fetchedScheduledServices) {
      fetchAnalytics({
        successRes: handleAccountingResponse,
        requestConfig: {
          url: "/hotel/get-analytics",
          method: "GET",
          params: { period: selectedPeriod },
        },
      });
    }
  }, []);

  // Manual fetch function that can be triggered by button
  const refetchData = () => {
    fetchAnalytics({
      successRes: handleAccountingResponse,
      requestConfig: {
        url: "/hotel/get-analytics",
        method: "GET",
        params: { period: selectedPeriod },
      },
    });
  };

  // Loading state
  if (isLoading || !mounted) {
    return <PageLoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorDisplay
            error={error}
            title="Failed to load accounting data"
            description="We couldn't load your accounting data. This might be due to a network issue or server problem."
            onRetry={refetchData}
            showRetry={true}
            size="large"
            variant="error"
          />
        </div>
      </div>
    );
  }

  // Main body
  return (
    <AccountingBody 
      selectedPeriod={selectedPeriod} 
      onPeriodChange={setSelectedPeriod}
      onRefetch={refetchData}
      isLoading={isLoading}
    />
  );
}
