'use client';

import { TrendingUp, DollarSign, BarChart3, Target, Calendar, AlertTriangle, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { mockYieldRules, mockForecasts, mockRatePlans } from '@/data/mockData';
import { useEffect, useState } from 'react';
import YieldBody from '@/components/yield/YieldBody';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { stayActions } from '@/store/redux/stay-slice';
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useHttp } from '@/hooks/useHttp';

export default function YieldPage() {
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

  return (<YieldBody />
    
  );
}
