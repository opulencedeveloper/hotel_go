"use client";

import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import RoomManagementBody from "@/components/room-management/RoomManagementBody";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { RootState } from "@/store";
import { roomActions } from "@/store/redux/room-slice";
import {
  RoomSliceParams,
  RoomTypeSliceParams,
} from "@/types/room-management/room-management";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RoomManagementPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchRoomInfoReq,
  } = useHttp();
  const room = useSelector((state: RootState) => state.room);
  const { fetchedRoomType, fetchedRooms } = room;

  useEffect(() => {
    setMounted(true);

    if (fetchedRoomType && fetchedRooms) return;

    const onFetchRoomInfoReq = (res: any) => {
      const resData = res?.data?.data;
      const fetchedRoomTypes: RoomTypeSliceParams[] = resData?.hotelRoomTypes;
      const fetchedRooms: RoomSliceParams[] = resData?.hotelRooms;
console.log("fetchedRooms", fetchedRooms)
      dispatch(roomActions.setRoomTypes(fetchedRoomTypes));
      dispatch(roomActions.setRooms(fetchedRooms));
    };

    fetchRoomInfoReq({
      successRes: onFetchRoomInfoReq,
      requestConfig: {
        url: "/hotel/room-info",
        method: "GET",
      },
    });
  }, [dispatch, fetchedRoomType, fetchedRooms]);

  if (isLoading || !mounted) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    const handleRetry = () => {
  if (fetchedRoomType && fetchedRooms) return;

      const onFetchRoomInfoReq = (res: any) => {
        const resData = res?.data?.data;
      const fetchedRoomTypes: RoomTypeSliceParams[] = resData?.hotelRoomTypes;
      const fetchedRooms: RoomSliceParams[] = resData?.hotelRooms;

      dispatch(roomActions.setRoomTypes(fetchedRoomTypes));
      dispatch(roomActions.setRooms(fetchedRooms));

        dispatch(roomActions.setRoomTypes(fetchedRoomTypes));
        dispatch(roomActions.setRooms(fetchedRooms));
      };

      fetchRoomInfoReq({
        successRes: onFetchRoomInfoReq,
        requestConfig: {
          url: "/hotel/room-info",
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

  return <RoomManagementBody />;
}
