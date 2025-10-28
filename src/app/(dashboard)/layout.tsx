"use client";

import { useState, useEffect } from "react";

import { useHttp } from "@/hooks/useHttp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { hotelActions } from "@/store/redux/hotel-slice";
import { UserAccountSliceParams } from "@/types/user";
import { HotelSliceParams } from "@/types/hotel";
import {
  userAccountActions,
  userAccountInitialState,
} from "@/store/redux/user-slice";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { LayoutProps } from "@/types";
import { useRouter } from "next/navigation";

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();
  const user = useSelector((state: RootState) => state.user);
  const hotel = useSelector((state: RootState) => state.hotel);
  const dashboardSummary = useSelector(
    (state: RootState) => state.dashboardSummary
  );
  const { fetchedDashboardSummary, fetchedQuickSummary } = dashboardSummary;
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    if (!hotel.hotels || user !== userAccountInitialState) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const fetchedUserData: UserAccountSliceParams = res?.data?.data?.user;
      const fetchedHotelData: HotelSliceParams[] = res?.data?.data?.hotel;

      dispatch(userAccountActions.setCurrentUser(fetchedUserData));

      dispatch(hotelActions.setHotels(fetchedHotelData));
    
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/user/info",
        method: "GET",
      },
    });
  }, [user, hotel, dispatch]);

  if (isLoading || !mounted) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    const handleRetry = () => {
      // Reset the error state and retry the request
      if (!hotel.hotels || user !== userAccountInitialState) return;

      const onFetchUserAndHotelInfoReq = (res: any) => {
        const fetchedUserData: UserAccountSliceParams = res?.data?.data?.user;
        const fetchedHotelData: HotelSliceParams[] = res?.data?.data?.hotel;

        dispatch(userAccountActions.setCurrentUser(fetchedUserData));
        dispatch(hotelActions.setHotels(fetchedHotelData));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/user/info",
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
console.log("PAGE LAYOUT");
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
