'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { ChefHat, Clock, Utensils, Users, AlertTriangle, CheckCircle, Timer, Flame, X } from 'lucide-react';

export default function KitchenPage() {
  const [showViewOrdersModal, setShowViewOrdersModal] = useState(false);
  const [showKitchenTimerModal, setShowKitchenTimerModal] = useState(false);
  const [showMenuManagerModal, setShowMenuManagerModal] = useState(false);

  // Kitchen Timer State
  const [kitchenTimer, setKitchenTimer] = useState({
    order_id: '',
    item_name: '',
    estimated_time: 15,
    start_time: '',
    notes: ''
  });

  // Menu Manager State
  const [menuManager, setMenuManager] = useState({
    item_name: '',
    category: 'appetizer',
    price: 0,
    prep_time: 15,
    ingredients: '',
    status: 'available'
  });

  const handleKitchenTimerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting kitchen timer:', kitchenTimer);
    setShowKitchenTimerModal(false);
    // Reset form
    setKitchenTimer({
      order_id: '',
      item_name: '',
      estimated_time: 15,
      start_time: '',
      notes: ''
    });
  };

  const handleMenuManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Managing menu item:', menuManager);
    setShowMenuManagerModal(false);
    // Reset form
    setMenuManager({
      item_name: '',
      category: 'appetizer',
      price: 0,
      prep_time: 15,
      ingredients: '',
      status: 'available'
    });
  };
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Kitchen & Restaurant</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Culinary Operations</span>
                </div>
              </div>
              
              <p className="text-orange-100 text-lg mb-6">
                Manage kitchen operations, orders, and restaurant service efficiently.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Flame className="w-4 h-4" />
                  <span className="text-orange-100">Kitchen Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-orange-200">Active Orders:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-orange-200">Avg. Prep Time:</span>
                  <span className="font-medium">18 min</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowViewOrdersModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Utensils className="w-4 h-4" />
                  <span>View Orders</span>
                </button>
                <button 
                  onClick={() => setShowKitchenTimerModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Timer className="w-4 h-4" />
                  <span>Kitchen Timer</span>
                </button>
                <button 
                  onClick={() => setShowMenuManagerModal(true)}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Menu Manager</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="card text-center py-12">
          <ChefHat className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Kitchen Module Coming Soon</h2>
          <p className="text-secondary-600 mb-6">
            Advanced kitchen and restaurant management features are currently in development.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center space-x-2 text-orange-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Planned Features</span>
            </div>
            <p className="text-orange-700 text-sm mt-2">
              This module will include order management, kitchen display systems, inventory tracking, and staff scheduling.
            </p>
          </div>
        </div>

        {/* View Orders Modal */}
        {showViewOrdersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Kitchen Orders</h2>
                <button
                  onClick={() => setShowViewOrdersModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Pending Orders</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">8</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">In Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">4</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Ready</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">3</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary-900">Recent Orders</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((order) => (
                      <div key={order} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-secondary-900">Order #{order}001</p>
                            <p className="text-sm text-secondary-600">Table 12 • 2 items</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-secondary-900">15 min</p>
                          <p className="text-xs text-secondary-600">Est. time</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setShowViewOrdersModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kitchen Timer Modal */}
        {showKitchenTimerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Kitchen Timer</h2>
                <button
                  onClick={() => setShowKitchenTimerModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleKitchenTimerSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={kitchenTimer.order_id}
                      onChange={(e) => setKitchenTimer({...kitchenTimer, order_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Order number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={kitchenTimer.item_name}
                      onChange={(e) => setKitchenTimer({...kitchenTimer, item_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Dish name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={kitchenTimer.estimated_time}
                      onChange={(e) => setKitchenTimer({...kitchenTimer, estimated_time: parseInt(e.target.value) || 15})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={kitchenTimer.start_time}
                      onChange={(e) => setKitchenTimer({...kitchenTimer, start_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={kitchenTimer.notes}
                      onChange={(e) => setKitchenTimer({...kitchenTimer, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Special instructions..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowKitchenTimerModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Timer className="w-4 h-4 mr-2" />
                    Start Timer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Manager Modal */}
        {showMenuManagerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Menu Manager</h2>
                <button
                  onClick={() => setShowMenuManagerModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleMenuManagerSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={menuManager.item_name}
                      onChange={(e) => setMenuManager({...menuManager, item_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Dish name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category
                    </label>
                    <select
                      value={menuManager.category}
                      onChange={(e) => setMenuManager({...menuManager, category: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="appetizer">Appetizer</option>
                      <option value="main_course">Main Course</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                      <option value="salad">Salad</option>
                      <option value="soup">Soup</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={menuManager.price}
                      onChange={(e) => setMenuManager({...menuManager, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Prep Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={menuManager.prep_time}
                      onChange={(e) => setMenuManager({...menuManager, prep_time: parseInt(e.target.value) || 15})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status
                    </label>
                    <select
                      value={menuManager.status}
                      onChange={(e) => setMenuManager({...menuManager, status: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="seasonal">Seasonal</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Ingredients
                    </label>
                    <textarea
                      value={menuManager.ingredients}
                      onChange={(e) => setMenuManager({...menuManager, ingredients: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="List ingredients..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowMenuManagerModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    Save Menu Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
