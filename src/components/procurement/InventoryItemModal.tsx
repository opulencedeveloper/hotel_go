'use client';

import { X, Package, MapPin, DollarSign, Calendar, User, AlertTriangle, CheckCircle, Clock, Hash } from 'lucide-react';
import { InventoryItem } from '@/store/redux/inventory-slice';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface InventoryItemModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InventoryItemModal({ item, isOpen, onClose }: InventoryItemModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  if (!item) return null;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { 
      status: 'Out of Stock', 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      icon: X,
      description: 'This item is out of stock. Add new inventory to restock this item.'
    };
    if (stock < 10) return { 
      status: 'Low Stock', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      icon: AlertTriangle,
      description: 'This item is running low. Consider adding new inventory to maintain adequate stock levels.'
    };
    return { 
      status: 'In Stock', 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      icon: CheckCircle,
      description: 'This item has adequate stock levels and is available for use.'
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const stockStatus = getStockStatus(item.currentStock);
  const StatusIcon = stockStatus.icon;
  const totalValue = item.currentStock * item.costPerUnit;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">{item.itemName}</h2>
              <p className="text-secondary-600">Inventory Item Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stock Status Alert */}
          <div className={`p-4 rounded-lg border ${stockStatus.bg} ${stockStatus.color} border-current`}>
            <div className="flex items-center space-x-3">
              <StatusIcon className="w-5 h-5" />
              <div>
                <p className="font-medium">{stockStatus.status}</p>
                <p className="text-sm opacity-90">{stockStatus.description}</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Basic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Hash className="w-4 h-4 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Item ID</p>
                    <p className="font-medium text-secondary-900">{item._id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Category</p>
                    <p className="font-medium text-secondary-900 capitalize">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Hash className="w-4 h-4 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Unit</p>
                    <p className="font-medium text-secondary-900">{item.unit}</p>
                  </div>
                </div>

                {item.supplier && (
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-600">Supplier</p>
                      <p className="font-medium text-secondary-900">{item.supplier}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Stock & Cost Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <StatusIcon className="w-4 h-4 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Current Stock</p>
                    <p className="font-medium text-secondary-900">{item.currentStock} {item.unit}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="w-4 h-4 text-secondary-400" />
                  <div>
                    <p className="text-sm text-secondary-600">Cost per Unit</p>
                    <p className="font-medium text-secondary-900">{formatPrice(item.costPerUnit, selectedHotel?.currency)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-secondary-600">Total Value</p>
                    <p className="font-medium text-green-600">{formatPrice(totalValue, selectedHotel?.currency)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          {item.storageLocation && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Storage Information</h3>
              <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
                <MapPin className="w-5 h-5 text-secondary-400" />
                <div>
                  <p className="text-sm text-secondary-600">Storage Location</p>
                  <p className="font-medium text-secondary-900">{item.storageLocation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Description</h3>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-secondary-700">{item.description}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
                <Calendar className="w-5 h-5 text-secondary-400" />
                <div>
                  <p className="text-sm text-secondary-600">Created Date</p>
                  <p className="font-medium text-secondary-900">{formatDate(item.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
                <Clock className="w-5 h-5 text-secondary-400" />
                <div>
                  <p className="text-sm text-secondary-600">Created Time</p>
                  <p className="font-medium text-secondary-900">{formatTime(item.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Stock Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Current Stock</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{item.currentStock}</p>
                <p className="text-sm text-blue-600">{item.unit}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Unit Cost</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{formatPrice(item.costPerUnit, selectedHotel?.currency)}</p>
                <p className="text-sm text-green-600">per {item.unit}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Total Value</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{formatPrice(totalValue, selectedHotel?.currency)}</p>
                <p className="text-sm text-purple-600">inventory value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-secondary-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
