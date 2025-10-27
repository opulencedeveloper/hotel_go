'use client';

import { X, Clock, Tag, ChefHat, Utensils, Coffee, Settings } from 'lucide-react';
import { POSItem } from '@/types';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: POSItem | null;
}

export default function ItemDetailsModal({ isOpen, onClose, item }: ItemDetailsModalProps) {
  if (!isOpen || !item) return null;

  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="w-5 h-5" />;
      case 'beverage': return <Coffee className="w-5 h-5" />;
      case 'service': return <Settings className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <div 
      className="fixed bg-black bg-opacity-75 flex items-center justify-center z-50" 
      style={{ 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        width: '100vw', 
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">{item.name}</h2>
              <p className="text-secondary-600">{item.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Tag className="w-5 h-5 text-secondary-400 mr-3" />
                <div>
                  <span className="text-sm text-secondary-600">Category</span>
                  <p className="font-medium capitalize">{item.category}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  item.available ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <span className="text-sm text-secondary-600">Availability</span>
                  <p className={`font-medium ${
                    item.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
              </div>

              {item.prepTime && item.prepTime > 0 && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-secondary-400 mr-3" />
                  <div>
                    <span className="text-sm text-secondary-600">Preparation Time</span>
                    <p className="font-medium">{item.prepTime} minutes</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <span className="text-sm text-primary-600">Price</span>
                <p className="text-3xl font-bold text-primary-700">{formatPrice(item.price, selectedHotel?.currency)}</p>
              </div>

            </div>
          </div>

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="border-t border-secondary-200 pt-6">
              <div className="flex items-center mb-4">
                <ChefHat className="w-5 h-5 text-secondary-400 mr-3" />
                <h3 className="text-lg font-semibold text-secondary-900">Ingredients</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center p-3 bg-secondary-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-secondary-900">{ingredient.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-secondary-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
