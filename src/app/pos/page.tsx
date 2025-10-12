'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  X,
  Minus,
  Printer,
  CreditCard,
  Receipt,
  Utensils,
  Coffee,
  Settings
} from 'lucide-react';
import { mockPOSItems, mockPOSOrders } from '@/data/mockData';
import { POSItem, POSOrder } from '@/types';

interface CartItem {
  item: POSItem;
  quantity: number;
}

export default function POSPage() {
  const [items] = useState<POSItem[]>(mockPOSItems);
  const [orders, setOrders] = useState<POSOrder[]>(mockPOSOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<POSOrder | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory && item.available;
  });

  const addToCart = (item: POSItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev => prev.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'beverage': return <Coffee className="w-4 h-4" />;
      case 'service': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <AlertCircle className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'served': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const createOrder = () => {
    if (cart.length === 0) return;

    const newOrder: POSOrder = {
      id: (orders.length + 1).toString(),
      items: cart.map(cartItem => ({
        itemId: cartItem.item.id,
        quantity: cartItem.quantity,
        price: cartItem.item.price
      })),
      total: getTotal(),
      status: 'pending',
      tableNumber: tableNumber || undefined,
      roomNumber: roomNumber || undefined,
      createdAt: new Date().toISOString(),
      staffId: '1' // This would come from authentication
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setTableNumber('');
    setRoomNumber('');
  };

  const updateOrderStatus = (orderId: string, status: POSOrder['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const posStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    readyOrders: orders.filter(o => o.status === 'ready').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Point of Sale</h1>
            <p className="text-secondary-600">Manage restaurant, bar, and mini-bar sales</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="btn-secondary">
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </button>
            <button className="btn-primary">
              <Receipt className="w-4 h-4 mr-2" />
              New Order
            </button>
          </div>
        </div>

        {/* POS Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-secondary-900">{posStats.totalOrders}</div>
            <div className="text-sm text-secondary-600">Total Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{posStats.pendingOrders}</div>
            <div className="text-sm text-secondary-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{posStats.preparingOrders}</div>
            <div className="text-sm text-secondary-600">Preparing</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{posStats.readyOrders}</div>
            <div className="text-sm text-secondary-600">Ready</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">${posStats.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-secondary-600">Total Revenue</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-4">
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 input"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
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
              {filteredItems.map((item) => (
                <div key={item.id} className="card hover:shadow-md transition-shadow">
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
                      <div className="text-lg font-bold text-primary-600">${item.price}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full btn-primary text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Order Management */}
          <div className="space-y-4">
            {/* Current Cart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current Order</h3>
              
              {/* Order Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="input"
                    placeholder="e.g., T01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="input"
                    placeholder="e.g., 101"
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-2 mb-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-secondary-500 text-center py-4">Cart is empty</p>
                ) : (
                  cart.map((cartItem) => (
                    <div key={cartItem.item.id} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">{cartItem.item.name}</p>
                        <p className="text-xs text-secondary-600">${cartItem.item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          className="p-1 text-secondary-400 hover:text-secondary-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-secondary-900 w-8 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                          className="p-1 text-secondary-400 hover:text-secondary-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total */}
              <div className="border-t border-secondary-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-secondary-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">${getTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={createOrder}
                  disabled={cart.length === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Order
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-secondary-900">
                          Order #{order.id}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-secondary-600">
                        {order.tableNumber && `Table ${order.tableNumber}`}
                        {order.roomNumber && `Room ${order.roomNumber}`}
                        {!order.tableNumber && !order.roomNumber && 'Takeout'}
                      </p>
                      <p className="text-xs text-secondary-600">
                        ${order.total.toFixed(2)} • {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Start
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="text-green-600 hover:text-green-700"
                        >
                          Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'served')}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          Served
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-secondary-900">Order Information</h4>
                    <p className="text-sm text-secondary-600">Order #: {selectedOrder.id}</p>
                    <p className="text-sm text-secondary-600">
                      Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                      </span>
                    </p>
                    <p className="text-sm text-secondary-600">
                      Created: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Location</h4>
                    {selectedOrder.tableNumber && (
                      <p className="text-sm text-secondary-600">Table: {selectedOrder.tableNumber}</p>
                    )}
                    {selectedOrder.roomNumber && (
                      <p className="text-sm text-secondary-600">Room: {selectedOrder.roomNumber}</p>
                    )}
                    {!selectedOrder.tableNumber && !selectedOrder.roomNumber && (
                      <p className="text-sm text-secondary-600">Takeout Order</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-secondary-900">Items</h4>
                  <div className="space-y-2 mt-2">
                    {selectedOrder.items.map((item, index) => {
                      const menuItem = items.find(i => i.id === item.itemId);
                      return (
                        <div key={index} className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-secondary-900">
                              {menuItem?.name || 'Unknown Item'}
                            </p>
                            <p className="text-xs text-secondary-600">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-secondary-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-secondary-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
