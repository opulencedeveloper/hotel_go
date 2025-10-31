'use client';

import { HotelServiceStatus } from '@/lib/server/hotelService/enum';
import { HotelServiceCategory } from '@/utils/enum';
import { 
  Heart, 
  Utensils, 
  Car, 
  Dumbbell, 
  Camera, 
  Music, 
  Gift, 
  Calendar, 
  Scissors, 
  Star,
  Eye,
  Edit,
  Package
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatPrice } from '@/helper';

interface Service {
  _id: string;
  name: string;
  category: string;
  location: string;
  capacity: number;
  description: string;
  price: number;
  status: string;
  updatedAt: string;
}

interface ServiceGridProps {
  services: Service[];
  onViewService: (service: Service) => void;
  onEditService: (service: Service) => void;
}

export default function ServiceGrid({ services, onViewService, onEditService }: ServiceGridProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case HotelServiceCategory.SPA: return <Heart className="w-5 h-5" />;
      case HotelServiceCategory.RESTAURANT: return <Utensils className="w-5 h-5" />;
      case HotelServiceCategory.TRANSPORT: return <Car className="w-5 h-5" />;
      case HotelServiceCategory.FITNESS: return <Dumbbell className="w-5 h-5" />;
      case HotelServiceCategory.PHOTOGRAPHY: return <Camera className="w-5 h-5" />;
      case HotelServiceCategory.ENTERTAINMENT: return <Music className="w-5 h-5" />;
      case HotelServiceCategory.GIFT_SHOP: return <Gift className="w-5 h-5" />;
      case HotelServiceCategory.EVENT_CENTER: return <Calendar className="w-5 h-5" />;
      case HotelServiceCategory.CONCIERGE: return <Heart className="w-5 h-5" />;
      case HotelServiceCategory.LAUNDRY: return <Scissors className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case HotelServiceCategory.SPA: return 'bg-pink-100 text-pink-800';
      case HotelServiceCategory.RESTAURANT: return 'bg-orange-100 text-orange-800';
      case HotelServiceCategory.TRANSPORT: return 'bg-blue-100 text-blue-800';
      case HotelServiceCategory.FITNESS: return 'bg-green-100 text-green-800';
      case HotelServiceCategory.PHOTOGRAPHY: return 'bg-purple-100 text-purple-800';
      case HotelServiceCategory.ENTERTAINMENT: return 'bg-yellow-100 text-yellow-800';
      case HotelServiceCategory.GIFT_SHOP: return 'bg-red-100 text-red-800';
      case HotelServiceCategory.EVENT_CENTER: return 'bg-indigo-100 text-indigo-800';
      case HotelServiceCategory.CONCIERGE: return 'bg-teal-100 text-teal-800';
      case HotelServiceCategory.LAUNDRY: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case HotelServiceStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case HotelServiceStatus.INACTIVE: return 'bg-gray-100 text-gray-800';
      case HotelServiceStatus.MAINTENANCE: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 bg-secondary-100 rounded-full mb-4">
            <Package className="w-12 h-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Services Found</h3>
          <p className="text-secondary-500 text-sm max-w-md">
            There are no services available at the moment. Create a new service to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div key={service._id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg mr-3">
                {getCategoryIcon(service.category)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">{service.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                  {service.category.replace('_', ' ')}
                </span>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
              {service.status}
            </span>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-secondary-600">{service.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Price</span>
              <span className="text-sm font-medium text-secondary-900">
                {service.price === 0 ? 'Free' : formatPrice(service.price, selectedHotel?.currency)}
              </span>
            </div>
            
            
            {service.capacity && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Capacity</span>
                <span className="text-sm font-medium text-secondary-900">{service.capacity} people</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Location</span>
              <span className="text-sm font-medium text-secondary-900">{service.location}</span>
            </div>
            
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
            <div className="flex space-x-2">
              <button
                onClick={() => onViewService(service)}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              >
                <Eye className="w-3 h-3 inline mr-1" />
                View
              </button>
              <button 
                onClick={() => onEditService(service)}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
              >
                <Edit className="w-3 h-3 inline mr-1" />
                Edit
              </button>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}
