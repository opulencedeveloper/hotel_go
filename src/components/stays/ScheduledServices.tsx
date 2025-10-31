'use client';

import { Calendar, Clock, MapPin, User, Trash2, Edit, Eye } from 'lucide-react';
import { ScheduledService } from '@/store/redux/scheduled-services-slice';

interface ScheduledServicesProps {
  scheduledServices: ScheduledService[];
  isLoading?: boolean;
  onEdit?: (scheduledService: ScheduledService) => void;
  onDelete?: (scheduledServiceId: string) => void;
  onView?: (scheduledService: ScheduledService) => void;
}

export default function ScheduledServices({
  scheduledServices,
  isLoading = false,
  onEdit,
  onDelete,
  onView
}: ScheduledServicesProps) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (scheduledServices.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 bg-secondary-100 rounded-full mb-4">
            <Calendar className="w-12 h-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Scheduled Services</h3>
          <p className="text-secondary-500 text-sm max-w-md mb-4">
            You haven't scheduled any services yet. Schedule a service to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scheduledServices.map((scheduledService) => {
          const { date, time } = formatDateTime(scheduledService.scheduledAt);
          
          return (
            <div key={scheduledService._id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-secondary-900">
                      {scheduledService.hotelServiceId.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceStatusColor(scheduledService.hotelServiceId.status)}`}>
                      {scheduledService?.hotelServiceId?.status?.charAt(0)?.toUpperCase() + scheduledService.hotelServiceId.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-secondary-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{scheduledService.hotelServiceId.location}</span>
                    </div>
                  </div>

                  {scheduledService.note && (
                    <div className="mt-2 text-sm text-secondary-600">
                      <span className="font-medium">Notes:</span> {scheduledService.note}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {onView && (
                    <button
                      onClick={() => onView(scheduledService)}
                      className="p-2 text-secondary-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(scheduledService)}
                      className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit schedule"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {/* {onDelete && (
                    <button
                      onClick={() => onDelete(scheduledService._id)}
                      className="p-2 text-secondary-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete schedule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )} */}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
