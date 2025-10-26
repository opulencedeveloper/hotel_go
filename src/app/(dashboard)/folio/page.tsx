"use client";

import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import FolioBody from "@/components/folio/FolioBody";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { orderActions } from "@/store/redux/order-slice";
import { stayActions } from "@/store/redux/stay-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function FolioPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();
  const stay = useSelector((state: RootState) => state.stay);
  const order = useSelector((state: RootState) => state.order);
  const { stays, fetchedData: fetchedStays } = stay;
  const { orders, fetchedData: fetchedOrders } = order;

  useEffect(() => {
    setMounted(true);

    if (fetchedOrders && fetchedStays) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const resData = res?.data?.data;
      const orders = resData?.orders;
      const stays = resData?.stays;

      dispatch(orderActions.setOrders(orders));
      dispatch(stayActions.setStays(stays));
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/hotel/get-folios",
        method: "GET",
      },
    });
  }, [dispatch, fetchedOrders, fetchedStays]);

  if (isLoading || !mounted) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    const handleRetry = () => {
      if (fetchedOrders && fetchedStays) return;

      const onFetchUserAndHotelInfoReq = (res: any) => {
        const resData = res?.data?.data;
        const orders = resData?.orders;
        const stays = resData?.stays;

        dispatch(orderActions.setOrders(orders));
        dispatch(stayActions.setStays(stays));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/hotel/get-folios",
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

  return <FolioBody />;
}
