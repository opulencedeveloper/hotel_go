"use client";

import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import POSBody from "@/components/pos/PosBody";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { menuActions } from "@/store/redux/menu-slice";
import { orderActions } from "@/store/redux/order-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function POSPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();
  const menu = useSelector((state: RootState) => state.menu);
  const { fetchedData } = menu;

  useEffect(() => {
    setMounted(true);

    if (fetchedData) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const resData = res?.data?.data;
      const menus = resData?.menus;
       const orders = resData?.orders;

      console.log("menus", menus);

      dispatch(menuActions.setMenus(menus));
       dispatch(orderActions.setOrders(orders));
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/hotel/get-menus",
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
        const menus = resData?.menus;
        const orders = resData?.orders;

        console.log("menus", menus);

        dispatch(orderActions.setOrders(orders))
        dispatch(menuActions.setMenus(menus));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/hotel/get-menus",
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

  return <POSBody />;
}
