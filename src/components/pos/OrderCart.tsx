'use client';

import { Minus, Plus, X, CreditCard, Users, Home, ShoppingBag } from 'lucide-react';
import { POSItem } from '@/types';
import { OrderType } from '@/utils/enum';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface CartItem {
  item: POSItem;
  quantity: number;
}

interface OrderCartProps {
  cart: CartItem[];
  tableNumber: string;
  roomNumber: string;
  customerType?: OrderType;
  onTableNumberChange: (value: string) => void;
  onRoomNumberChange: (value: string) => void;
  onCustomerTypeChange?: (type: OrderType) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onProcessOrder: () => void;
  getTotal: () => number;
  isCreatingOrder?: boolean;
  createOrderError?: string;
}

export default function OrderCart({
  cart,
  tableNumber,
  roomNumber,
  customerType = OrderType.WALK_IN,
  onTableNumberChange,
  onRoomNumberChange,
  onCustomerTypeChange,
  onUpdateQuantity,
  onRemoveFromCart,
  onProcessOrder,
  getTotal,
  isCreatingOrder = false,
  createOrderError
}: OrderCartProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current Order</h3>
      
      {/* Customer Type Selection */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-secondary-700 mb-3">Customer Type</h4>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Restaurant Customer */}
          <div 
            onClick={() => onCustomerTypeChange?.(OrderType.RESTAURANT)}
            className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-colors ${
              customerType === OrderType.RESTAURANT 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-secondary-200 hover:bg-secondary-50'
            }`}
          >
            <Users className={`w-4 h-4 ${customerType === OrderType.RESTAURANT ? 'text-primary-600' : 'text-secondary-500'}`} />
            <span className={`text-xs font-medium ${customerType === OrderType.RESTAURANT ? 'text-primary-700' : 'text-secondary-700'}`}>
              Restaurant
            </span>
          </div>
          
          {/* Hotel Guest */}
          <div 
            onClick={() => onCustomerTypeChange?.(OrderType.HOTEL_GUEST)}
            className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-colors ${
              customerType === OrderType.HOTEL_GUEST 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-secondary-200 hover:bg-secondary-50'
            }`}
          >
            <Home className={`w-4 h-4 ${customerType === OrderType.HOTEL_GUEST ? 'text-primary-600' : 'text-secondary-500'}`} />
            <span className={`text-xs font-medium ${customerType === OrderType.HOTEL_GUEST ? 'text-primary-700' : 'text-secondary-700'}`}>
              Hotel Guest
            </span>
          </div>
          
          {/* Walk-in Customer */}
          <div 
            onClick={() => onCustomerTypeChange?.(OrderType.WALK_IN)}
            className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-colors ${
              customerType === OrderType.WALK_IN 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-secondary-200 hover:bg-secondary-50'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${customerType === OrderType.WALK_IN ? 'text-primary-600' : 'text-secondary-500'}`} />
            <span className={`text-xs font-medium ${customerType === OrderType.WALK_IN ? 'text-primary-700' : 'text-secondary-700'}`}>
              Walk-in
            </span>
          </div>
        </div>

        {/* Dynamic Form Fields */}
        <div className="space-y-3">
          {/* Table Number - Show for Restaurant customers */}
          {customerType === 'restaurant' && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Table Number *
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => onTableNumberChange(e.target.value)}
                className="input"
                placeholder="e.g., T01"
                required
              />
              <p className="text-xs text-secondary-500 mt-1">Required for restaurant customers</p>
            </div>
          )}
          
          {/* Room Number - Show for Hotel guests */}
          {customerType === OrderType.HOTEL_GUEST && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => onRoomNumberChange(e.target.value)}
                className="input"
                placeholder="e.g., 101"
                required
              />
              <p className="text-xs text-secondary-500 mt-1">Required for hotel guests</p>
            </div>
          )}
          
          {/* Walk-in Customer Info */}
          {customerType === OrderType.WALK_IN && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Walk-in Customer</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">No table or room number required</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-2 mb-4">
        {cart.length === 0 ? (
          <p className="text-sm text-secondary-500 text-center py-4">Cart is empty</p>
        ) : (
          cart.map((cartItem) => (
            <div key={cartItem.item.item_id} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">{cartItem.item.name}</p>
                <p className="text-xs text-secondary-600">{formatPrice(cartItem.item.price, selectedHotel?.currency)} each</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(cartItem.item.item_id, cartItem.quantity - 1)}
                  className="p-1 text-secondary-400 hover:text-secondary-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-secondary-900 w-8 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(cartItem.item.item_id, cartItem.quantity + 1)}
                  className="p-1 text-secondary-400 hover:text-secondary-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemoveFromCart(cartItem.item.item_id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error Display */}
      {createOrderError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{createOrderError}</p>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-secondary-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-secondary-900">Total</span>
          <span className="text-lg font-bold text-primary-600">{formatPrice(getTotal(), selectedHotel?.currency)}</span>
        </div>
        <button
          onClick={onProcessOrder}
          disabled={cart.length === 0 || isCreatingOrder}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isCreatingOrder ? 'Creating Order...' : 'Process Order'}
        </button>
      </div>
    </div>
  );
}
