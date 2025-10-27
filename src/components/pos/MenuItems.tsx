'use client';

import { Search, Filter, Plus, Utensils, Coffee, Settings, Eye } from 'lucide-react';
import { POSItem } from '@/types';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface MenuItemsProps {
  items: POSItem[];
  searchTerm: string;
  categoryFilter: string;
  onSearchChange: (term: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onAddToCart: (item: POSItem) => void;
  onViewDetails?: (item: POSItem) => void;
}

export default function MenuItems({
  items,
  searchTerm,
  categoryFilter,
  onSearchChange,
  onCategoryFilterChange,
  onAddToCart,
  onViewDetails
}: MenuItemsProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'beverage': return <Coffee className="w-4 h-4" />;
      case 'service': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 input"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="beverage">Beverage</option>
              <option value="service">Service</option>
            </select>
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.item_id} className="card hover:shadow-md transition-shadow">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">{item.name}</h3>
                  <p className="text-sm text-secondary-600">{item.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600">{formatPrice(item.price, selectedHotel?.currency)}</div>
                <div className={`text-xs mt-1 ${
                  item.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(item)}
                disabled={!item.available}
                className={`flex-1 text-sm ${
                  item.available 
                    ? 'btn-primary' 
                    : 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {item.available ? 'Add to Cart' : 'Unavailable'}
              </button>
              
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(item)}
                  className="btn-secondary text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
