"use client";

import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import RoomManagementBody from "@/components/room-management/RoomManagementBody";
import StaysBody from "@/components/stays/StaysBody";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { roomActions } from "@/store/redux/room-slice";
import { stayActions } from "@/store/redux/stay-slice";
import {
  RoomSliceParams,
  RoomTypeSliceParams,
} from "@/types/room-management/room-management";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StaysPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();
  const stay = useSelector((state: RootState) => state.stay);
  const { fetchedData } = stay;

  useEffect(() => {
    setMounted(true);

    if (fetchedData) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const resData = res?.data?.data;

      const stays = resData.stays;

      console.log("fetched stayes===>",stays)
      
      dispatch(stayActions.setStays(stays));
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/hotel/stays-info",
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

        const stays = resData.stays;

        

        dispatch(stayActions.setStays(stays));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/hotel/stays-info",
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

  return <StaysBody />;
}

