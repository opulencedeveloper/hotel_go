'use client';

import { X, ShoppingCart, Minus, Plus, Receipt, Utensils, Coffee, Settings } from 'lucide-react';
import { POSItem } from '@/types';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface CartItem {
  item: POSItem;
  quantity: number;
}

interface NewOrderModalProps {
  isOpen: boolean;
  cart: CartItem[];
  newOrderForm: {
    table_number: string;
    room_number: string;
    customer_name: string;
    customer_phone: string;
    order_type: string;
    payment_method: string;
    notes: string;
  };
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  getTotal: () => number;
}

export default function NewOrderModal({
  isOpen,
  cart,
  newOrderForm,
  onClose,
  onUpdateQuantity,
  onRemoveFromCart,
  onFormChange,
  onSubmit,
  getTotal
}: NewOrderModalProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'beverage': return <Coffee className="w-4 h-4" />;
      case 'service': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Create New Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Order Items</h3>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 bg-secondary-50 rounded-lg">
                <ShoppingCart className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-500 text-lg font-medium">No items in cart</p>
                <p className="text-secondary-400 text-sm">Add items from the menu to create an order</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.item_id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        {getCategoryIcon(cartItem.item.category)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">{cartItem.item.name}</p>
                        <p className="text-xs text-secondary-600">{formatPrice(cartItem.item.price, selectedHotel?.currency)} each</p>
                      </div>
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
                ))}
                
                {/* Order Total */}
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-secondary-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">{formatPrice(getTotal(), selectedHotel?.currency)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Details Form */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Order Details</h3>
            
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.customer_name}
                    onChange={(e) => onFormChange('customer_name', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Customer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={newOrderForm.customer_phone}
                    onChange={(e) => onFormChange('customer_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1-555-000-0000"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Table Number
                    </label>
                    <input
                      type="text"
                      value={newOrderForm.table_number}
                      onChange={(e) => onFormChange('table_number', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Table number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={newOrderForm.room_number}
                      onChange={(e) => onFormChange('room_number', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Room number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Order Type
                    </label>
                    <select
                      value={newOrderForm.order_type}
                      onChange={(e) => onFormChange('order_type', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="dine_in">Dine In</option>
                      <option value="takeout">Takeout</option>
                      <option value="delivery">Delivery</option>
                      <option value="room_service">Room Service</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={newOrderForm.payment_method}
                      onChange={(e) => onFormChange('payment_method', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="room_charge">Room Charge</option>
                      <option value="split">Split Payment</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Order Notes
                  </label>
                  <textarea
                    value={newOrderForm.notes}
                    onChange={(e) => onFormChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Special instructions or notes..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
