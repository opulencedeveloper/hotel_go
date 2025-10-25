"use client";

import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import ProcurementBody from "@/components/procurement/ProcurementBody";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { inventoryActions } from "@/store/redux/inventory-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProcurementPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();
  const inventory = useSelector((state: RootState) => state.inventory);
  const { fetchedData } = inventory;

  useEffect(() => {
    setMounted(true);

    if (fetchedData) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const resData = res?.data?.data;
      const inventories = resData?.inventories;
      const inventoryLogs = resData?.inventoryLogs;

      console.log("inventoryLogs", inventoryLogs);

      dispatch(inventoryActions.setInventoryLogs(inventoryLogs));
      dispatch(inventoryActions.setInventory(inventories));
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/hotel/get-inventories",
        method: "GET",
      },
    });
  }, [dispatch, fetchedData]);

  if (isLoading || !mounted) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    const handleRetry = () => {
      if (fetchedData) return;

      const onFetchUserAndHotelInfoReq = (res: any) => {
        const resData = res?.data?.data;
        const inventories = resData?.inventories;
        const inventoryLogs = resData?.inventoryLogs;

        console.log("inventoryLogs", inventoryLogs);

        dispatch(inventoryActions.setInventoryLogs(inventoryLogs));

        dispatch(inventoryActions.setInventory(inventories));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/hotel/get-inventories",
          method: "GET",
        },
      });
    };

    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorDisplay
            error={error}
            title="Failed to load dashboard"
            description="We couldn't load your dashboard information. This might be due to a network issue or server problem."
            onRetry={handleRetry}
            showRetry={true}
            size="large"
            variant="error"
          />
        </div>
      </div>
    );
  }

  return <ProcurementBody />;
}
