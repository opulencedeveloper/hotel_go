"use client";

import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import HousekeepingBody from "@/components/house-keeping/HousekeepingBody";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { houseKeepingActions } from "@/store/redux/house-keeping-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HousekeepingPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const { fetchedData } = houseKeeping;

  useEffect(() => {
    setMounted(true);

    if (fetchedData) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const resData = res?.data?.data;
      const houseKeeping = resData?.houseKeeping;

      console.log("houseKeeping", houseKeeping);

      dispatch(houseKeepingActions.setHouseKeepings(houseKeeping));
      // dispatch(inventoryActions.setInventory(houseKeeping));
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/hotel/get-housekeeping",
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
        const houseKeeping = resData?.houseKeeping;

        console.log("houseKeeping", houseKeeping);

        dispatch(houseKeepingActions.setHouseKeepings(houseKeeping));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/hotel/get-housekeeping",
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

  return <HousekeepingBody />;
}
