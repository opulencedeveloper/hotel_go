'use client';

import { useState, useEffect } from 'react';
import { Edit, X, Waves, Dumbbell, Utensils, Coffee, Heart, Building, Car, Wifi, Scissors, Gift, Calendar, Star, Shield } from 'lucide-react';

// Use the Redux Facility interface
import { Facility } from '@/store/redux/facility-slice';

interface FacilityDetailsModalProps {
  selectedFacility: Facility | null;
  onClose: () => void;
  onEdit: (facility: Facility) => void;
}

export default function FacilityDetailsModal({
  selectedFacility,
  onClose,
  onEdit
}: FacilityDetailsModalProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!selectedFacility) return null;

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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              {getCategoryIcon(selectedFacility.category)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">{selectedFacility.facilityName}</h2>
              <div className="flex space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedFacility.category)}`}>
                  {selectedFacility.category.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedFacility.status)}`}>
                  {selectedFacility.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Facility Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Description:</span> {selectedFacility.description}</p>
                <p><span className="font-medium">Location:</span> {selectedFacility.location}</p>
                <p><span className="font-medium">Floor:</span> {selectedFacility.floor}</p>
                      <p><span className="font-medium">Capacity:</span> {selectedFacility.capacity} people</p>
              </div>
            </div>
            
          </div>
          
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-secondary-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
          >
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
}

