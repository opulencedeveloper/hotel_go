'use client';

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
  X,
  Edit
} from 'lucide-react';

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

interface ServiceDetailsModalProps {
  selectedService: Service | null;
  onClose: () => void;
}

export default function ServiceDetailsModal({ selectedService, onClose }: ServiceDetailsModalProps) {
  if (!selectedService) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spa': return <Heart className="w-5 h-5" />;
      case 'restaurant': return <Utensils className="w-5 h-5" />;
      case 'transport': return <Car className="w-5 h-5" />;
      case 'fitness': return <Dumbbell className="w-5 h-5" />;
      case 'photography': return <Camera className="w-5 h-5" />;
      case 'entertainment': return <Music className="w-5 h-5" />;
      case 'gift_shop': return <Gift className="w-5 h-5" />;
      case 'event_center': return <Calendar className="w-5 h-5" />;
      case 'concierge': return <Heart className="w-5 h-5" />;
      case 'laundry': return <Scissors className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spa': return 'bg-pink-100 text-pink-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      case 'transport': return 'bg-blue-100 text-blue-800';
      case 'fitness': return 'bg-green-100 text-green-800';
      case 'photography': return 'bg-purple-100 text-purple-800';
      case 'entertainment': return 'bg-yellow-100 text-yellow-800';
      case 'gift_shop': return 'bg-red-100 text-red-800';
      case 'event_center': return 'bg-indigo-100 text-indigo-800';
      case 'concierge': return 'bg-teal-100 text-teal-800';
      case 'laundry': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              {getCategoryIcon(selectedService.category)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">{selectedService.name}</h2>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedService.category)}`}>
                {selectedService.category.replace('_', ' ')}
              </span>
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
              <h4 className="font-medium text-secondary-900 mb-2">Service Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Description:</span> {selectedService.description}</p>
                <p><span className="font-medium">Price:</span> {selectedService.price === 0 ? 'Free' : `$${selectedService.price}`}</p>
                <p><span className="font-medium">Capacity:</span> {selectedService.capacity} people</p>
                <p><span className="font-medium">Location:</span> {selectedService.location}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedService.status)}`}>
                    {selectedService.status}
                  </span>
                </p>
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
          <button className="btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Service
          </button>
        </div>
      </div>
    </div>
  );
}
