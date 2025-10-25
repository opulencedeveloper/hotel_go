'use client';

import { useState, useEffect } from 'react';
import { 
  Edit, 
  Eye,
  MapPin,
  Clock,
  Users,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Coffee,
  Utensils,
  Gift,
  Camera,
  Music,
  Heart,
  Scissors,
  Settings,
  CheckCircle,
  AlertTriangle,
  Star,
  Calendar,
  Phone,
  Mail,
  Building,
  Shield,
  Zap
} from 'lucide-react';

// Use the Redux Facility interface
import { Facility } from '@/store/redux/facility-slice';

interface FacilityGridProps {
  facilities: Facility[];
  onViewFacility: (facility: Facility) => void;
  onEditFacility: (facility: Facility) => void;
}

export default function FacilityGrid({ facilities, onViewFacility, onEditFacility }: FacilityGridProps) {
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pool': return <Waves className="w-5 h-5" />;
      case 'gym': return <Dumbbell className="w-5 h-5" />;
      case 'restaurant': return <Utensils className="w-5 h-5" />;
      case 'bar': return <Coffee className="w-5 h-5" />;
      case 'spa': return <Heart className="w-5 h-5" />;
      case 'business_center': return <Building className="w-5 h-5" />;
      case 'concierge': return <Heart className="w-5 h-5" />;
      case 'parking': return <Car className="w-5 h-5" />;
      case 'wifi': return <Wifi className="w-5 h-5" />;
      case 'laundry': return <Scissors className="w-5 h-5" />;
      case 'gift_shop': return <Gift className="w-5 h-5" />;
      case 'event_space': return <Calendar className="w-5 h-5" />;
      case 'rooftop': return <Star className="w-5 h-5" />;
      case 'lobby': return <Building className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pool': return 'bg-blue-100 text-blue-800';
      case 'gym': return 'bg-green-100 text-green-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      case 'bar': return 'bg-yellow-100 text-yellow-800';
      case 'spa': return 'bg-pink-100 text-pink-800';
      case 'business_center': return 'bg-purple-100 text-purple-800';
      case 'concierge': return 'bg-teal-100 text-teal-800';
      case 'parking': return 'bg-gray-100 text-gray-800';
      case 'wifi': return 'bg-indigo-100 text-indigo-800';
      case 'laundry': return 'bg-cyan-100 text-cyan-800';
      case 'gift_shop': return 'bg-red-100 text-red-800';
      case 'event_space': return 'bg-violet-100 text-violet-800';
      case 'rooftop': return 'bg-amber-100 text-amber-800';
      case 'lobby': return 'bg-slate-100 text-slate-800';
      case 'security': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'renovation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'guest_only': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'staff_only': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <div key={facility._id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg mr-3">
                {getCategoryIcon(facility.category)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">{facility.facilityName}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(facility.category)}`}>
                  {facility.category.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                {facility.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-secondary-600">{facility.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Location</span>
              <span className="text-sm font-medium text-secondary-900">{facility.location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Floor</span>
              <span className="text-sm font-medium text-secondary-900">{facility.floor}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Capacity</span>
              <span className="text-sm font-medium text-secondary-900">{facility.capacity} people</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
            <div className="flex space-x-2">
              <button
                onClick={() => onViewFacility(facility)}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              >
                <Eye className="w-3 h-3 inline mr-1" />
                View
              </button>
              <button 
                onClick={() => onEditFacility(facility)}
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
