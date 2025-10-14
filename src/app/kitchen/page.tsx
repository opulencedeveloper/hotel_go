'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { ChefHat, Clock, Utensils, Users, AlertTriangle, CheckCircle, Timer, Flame, X } from 'lucide-react';

export default function KitchenPage() {
  const [showViewOrdersModal, setShowViewOrdersModal] = useState(false);
  const [showKitchenTimerModal, setShowKitchenTimerModal] = useState(false);
  const [showMenuManagerModal, setShowMenuManagerModal] = useState(false);
  const [showStaffScheduleModal, setShowStaffScheduleModal] = useState(false);
  const [showInventoryCheckModal, setShowInventoryCheckModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

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

  // Staff Schedule State
  const [staffSchedule, setStaffSchedule] = useState({
    staff_name: '',
    position: 'chef',
    shift_date: '',
    start_time: '',
    end_time: '',
    break_duration: 30,
    notes: ''
  });

  // Inventory Check State
  const [inventoryCheck, setInventoryCheck] = useState({
    item_name: '',
    current_stock: 0,
    minimum_stock: 0,
    unit: 'pieces',
    expiry_date: '',
    supplier: '',
    notes: ''
  });

  // Report Issue State
  const [reportIssue, setReportIssue] = useState({
    issue_type: 'equipment',
    priority: 'medium',
    description: '',
    location: '',
    reported_by: '',
    estimated_fix_time: '',
    notes: ''
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

  const handleStaffScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scheduling staff:', staffSchedule);
    setShowStaffScheduleModal(false);
    // Reset form
    setStaffSchedule({
      staff_name: '',
      position: 'chef',
      shift_date: '',
      start_time: '',
      end_time: '',
      break_duration: 30,
      notes: ''
    });
  };

  const handleInventoryCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checking inventory:', inventoryCheck);
    setShowInventoryCheckModal(false);
    // Reset form
    setInventoryCheck({
      item_name: '',
      current_stock: 0,
      minimum_stock: 0,
      unit: 'pieces',
      expiry_date: '',
      supplier: '',
      notes: ''
    });
  };

  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reporting issue:', reportIssue);
    setShowReportIssueModal(false);
    // Reset form
    setReportIssue({
      issue_type: 'equipment',
      priority: 'medium',
      description: '',
      location: '',
      reported_by: '',
      estimated_fix_time: '',
      notes: ''
    });
  };

  const handleOrderAction = (action: string, orderId: string) => {
    console.log(`Order ${orderId}: ${action}`);
    // Here you would implement the actual order action logic
    alert(`Order ${orderId} - ${action} action performed!`);
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  // Mock order data
  const allOrders = [
    {
      id: '1',
      customer: 'John Doe',
      table: 'Table 12',
      status: 'pending',
      orderTime: '5 min ago',
      estimatedTime: '15 min',
      priority: 'normal',
      items: [
        { name: 'Grilled Salmon', category: 'Main Course', price: 24.99, status: 'pending' },
        { name: 'Caesar Salad', category: 'Appetizer', price: 12.99, status: 'pending' }
      ],
      instructions: 'No onions, medium rare'
    },
    {
      id: '2',
      customer: 'Room Service',
      table: 'Room 205',
      status: 'cooking',
      orderTime: '12 min ago',
      estimatedTime: '8 min remaining',
      priority: 'high',
      items: [
        { name: 'Chicken Pasta', category: 'Main Course', price: 18.99, status: 'cooking' },
        { name: 'Garlic Bread', category: 'Side', price: 6.99, status: 'pending' }
      ],
      instructions: 'Extra garlic'
    },
    {
      id: '3',
      customer: 'Sarah Wilson',
      table: 'Table 8',
      status: 'ready',
      orderTime: '18 min ago',
      estimatedTime: 'Ready for 3 min',
      priority: 'normal',
      items: [
        { name: 'Beef Steak', category: 'Main Course', price: 32.99, status: 'ready' },
        { name: 'Mashed Potatoes', category: 'Side', price: 8.99, status: 'ready' }
      ],
      instructions: 'Medium rare'
    },
    {
      id: '4',
      customer: 'Mike Johnson',
      table: 'Table 5',
      status: 'pending',
      orderTime: '3 min ago',
      estimatedTime: '20 min',
      priority: 'normal',
      items: [
        { name: 'Fish & Chips', category: 'Main Course', price: 16.99, status: 'pending' },
        { name: 'Coleslaw', category: 'Side', price: 4.99, status: 'pending' }
      ],
      instructions: 'Extra crispy'
    },
    {
      id: '5',
      customer: 'Lisa Brown',
      table: 'Table 15',
      status: 'cooking',
      orderTime: '8 min ago',
      estimatedTime: '12 min remaining',
      priority: 'normal',
      items: [
        { name: 'Vegetarian Pasta', category: 'Main Course', price: 14.99, status: 'cooking' },
        { name: 'Garlic Bread', category: 'Side', price: 6.99, status: 'ready' }
      ],
      instructions: 'No cheese'
    }
  ];

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? allOrders 
    : allOrders.filter(order => order.status === activeTab);

  // Get order counts for each status
  const orderCounts = {
    all: allOrders.length,
    pending: allOrders.filter(order => order.status === 'pending').length,
    cooking: allOrders.filter(order => order.status === 'cooking').length,
    ready: allOrders.filter(order => order.status === 'ready').length
  };

  // Helper function to get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'yellow',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <Clock className="w-3 h-3 mr-1" />
        };
      case 'cooking':
        return {
          color: 'blue',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <Flame className="w-3 h-3 mr-1" />
        };
      case 'ready':
        return {
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />
        };
      default:
        return {
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <Clock className="w-3 h-3 mr-1" />
        };
    }
  };

  // Helper function to get item status color
  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-500';
      case 'cooking': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
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

        {/* Kitchen Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Orders */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Active Orders</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-secondary-600">Live Updates</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Order Status Tabs */}
                <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'all' 
                        ? 'text-secondary-700 bg-white shadow-sm' 
                        : 'text-secondary-600 hover:text-secondary-800 hover:bg-white/50'
                    }`}
                  >
                    All Orders ({orderCounts.all})
                  </button>
                  <button 
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'pending' 
                        ? 'text-secondary-700 bg-white shadow-sm' 
                        : 'text-secondary-600 hover:text-secondary-800 hover:bg-white/50'
                    }`}
                  >
                    Pending ({orderCounts.pending})
                  </button>
                  <button 
                    onClick={() => setActiveTab('cooking')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'cooking' 
                        ? 'text-secondary-700 bg-white shadow-sm' 
                        : 'text-secondary-600 hover:text-secondary-800 hover:bg-white/50'
                    }`}
                  >
                    Cooking ({orderCounts.cooking})
                  </button>
                  <button 
                    onClick={() => setActiveTab('ready')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'ready' 
                        ? 'text-secondary-700 bg-white shadow-sm' 
                        : 'text-secondary-600 hover:text-secondary-800 hover:bg-white/50'
                    }`}
                  >
                    Ready ({orderCounts.ready})
                  </button>
                </div>
                
                {/* Orders List */}
                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Utensils className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                      <p className="text-secondary-500 text-lg font-medium">No orders found</p>
                      <p className="text-secondary-400 text-sm">No orders match the selected filter</p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      return (
                        <div key={order.id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                                <span className={`text-sm font-bold ${statusInfo.textColor}`}>#{order.id}</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-secondary-900">{order.table} - {order.customer}</h3>
                                <p className="text-sm text-secondary-600">Ordered {order.orderTime}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                {statusInfo.icon}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <p className="text-sm text-secondary-600 mt-1">{order.estimatedTime}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 ${getItemStatusColor(item.status)} rounded-full`}></div>
                                  <span className="text-sm font-medium text-secondary-900">{item.name}</span>
                                  <span className="text-xs text-secondary-600">{item.category}</span>
                                </div>
                                <span className="text-sm text-secondary-600">${item.price}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary-100">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-secondary-600">
                                {order.priority === 'high' ? 'Priority:' : 'Special Instructions:'}
                              </span>
                              <span className={`text-xs ${order.priority === 'high' ? 'text-red-600 font-medium' : 'text-secondary-900'}`}>
                                {order.priority === 'high' ? 'High' : order.instructions}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {order.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={() => handleOrderAction('Start Cooking', order.id)}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                                  >
                                    Start Cooking
                                  </button>
                                  <button 
                                    onClick={() => handleViewOrderDetails(order)}
                                    className="px-3 py-1 bg-secondary-200 text-secondary-700 text-xs rounded-md hover:bg-secondary-300"
                                  >
                                    View Details
                                  </button>
                                </>
                              )}
                              {order.status === 'cooking' && (
                                <>
                                  <button 
                                    onClick={() => handleOrderAction('Mark Ready', order.id)}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                                  >
                                    Mark Ready
                                  </button>
                                  <button 
                                    onClick={() => handleOrderAction('Add Time', order.id)}
                                    className="px-3 py-1 bg-secondary-200 text-secondary-700 text-xs rounded-md hover:bg-secondary-300"
                                  >
                                    Add Time
                                  </button>
                                </>
                              )}
                              {order.status === 'ready' && (
                                <>
                                  <button 
                                    onClick={() => handleOrderAction('Notify Server', order.id)}
                                    className="px-3 py-1 bg-orange-600 text-white text-xs rounded-md hover:bg-orange-700"
                                  >
                                    Notify Server
                                  </button>
                                  <button 
                                    onClick={() => handleOrderAction('Complete', order.id)}
                                    className="px-3 py-1 bg-secondary-200 text-secondary-700 text-xs rounded-md hover:bg-secondary-300"
                                  >
                                    Complete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Kitchen Stats & Tools */}
          <div className="space-y-6">
            {/* Kitchen Performance */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Kitchen Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Avg. Prep Time</span>
                  <span className="font-semibold text-secondary-900">18 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Orders Today</span>
                  <span className="font-semibold text-secondary-900">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Completion Rate</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Kitchen Efficiency</span>
                  <span className="font-semibold text-blue-600">Excellent</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowMenuManagerModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <ChefHat className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-secondary-900">Add Menu Item</span>
                </button>
                <button 
                  onClick={() => setShowStaffScheduleModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-secondary-900">Staff Schedule</span>
                </button>
                <button 
                  onClick={() => setShowInventoryCheckModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Utensils className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-secondary-900">Inventory Check</span>
                </button>
                <button 
                  onClick={() => setShowReportIssueModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-secondary-900">Report Issue</span>
                </button>
              </div>
            </div>
            
            {/* Kitchen Alerts */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Kitchen Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                    <p className="text-xs text-yellow-700">Salmon fillets running low</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Equipment Issue</p>
                    <p className="text-xs text-red-700">Oven #2 needs maintenance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Staff Update</p>
                    <p className="text-xs text-blue-700">Chef Mike started shift</p>
                  </div>
                </div>
              </div>
            </div>
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

        {/* Staff Schedule Modal */}
        {showStaffScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Staff Schedule</h2>
                <button
                  onClick={() => setShowStaffScheduleModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleStaffScheduleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Staff Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffSchedule.staff_name}
                      onChange={(e) => setStaffSchedule({...staffSchedule, staff_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter staff name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Position *
                    </label>
                    <select
                      value={staffSchedule.position}
                      onChange={(e) => setStaffSchedule({...staffSchedule, position: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="chef">Head Chef</option>
                      <option value="sous_chef">Sous Chef</option>
                      <option value="line_cook">Line Cook</option>
                      <option value="prep_cook">Prep Cook</option>
                      <option value="dishwasher">Dishwasher</option>
                      <option value="kitchen_manager">Kitchen Manager</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Shift Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={staffSchedule.shift_date}
                      onChange={(e) => setStaffSchedule({...staffSchedule, shift_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={staffSchedule.start_time}
                      onChange={(e) => setStaffSchedule({...staffSchedule, start_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={staffSchedule.end_time}
                      onChange={(e) => setStaffSchedule({...staffSchedule, end_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={staffSchedule.break_duration}
                      onChange={(e) => setStaffSchedule({...staffSchedule, break_duration: parseInt(e.target.value) || 30})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={staffSchedule.notes}
                      onChange={(e) => setStaffSchedule({...staffSchedule, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes about the shift..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowStaffScheduleModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Schedule Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Inventory Check Modal */}
        {showInventoryCheckModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Inventory Check</h2>
                <button
                  onClick={() => setShowInventoryCheckModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleInventoryCheckSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inventoryCheck.item_name}
                      onChange={(e) => setInventoryCheck({...inventoryCheck, item_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter item name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={inventoryCheck.unit}
                      onChange={(e) => setInventoryCheck({...inventoryCheck, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="lbs">Pounds</option>
                      <option value="liters">Liters</option>
                      <option value="gallons">Gallons</option>
                      <option value="boxes">Boxes</option>
                      <option value="cases">Cases</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Current Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={inventoryCheck.current_stock}
                      onChange={(e) => setInventoryCheck({...inventoryCheck, current_stock: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Minimum Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={inventoryCheck.minimum_stock}
                      onChange={(e) => setInventoryCheck({...inventoryCheck, minimum_stock: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={inventoryCheck.expiry_date}
                      onChange={(e) => setInventoryCheck({...inventoryCheck, expiry_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={inventoryCheck.supplier}
                      onChange={(e) => setInventoryCheck({...inventoryCheck, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Supplier name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={inventoryCheck.notes}
                      onChange={(e) => setInventoryCheck({...inventoryCheck, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes about the inventory item..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowInventoryCheckModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    Update Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Issue Modal */}
        {showReportIssueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Report Issue</h2>
                <button
                  onClick={() => setShowReportIssueModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleReportIssueSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Issue Type *
                    </label>
                    <select
                      value={reportIssue.issue_type}
                      onChange={(e) => setReportIssue({...reportIssue, issue_type: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="equipment">Equipment</option>
                      <option value="safety">Safety</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="supply">Supply Shortage</option>
                      <option value="staff">Staff Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Priority *
                    </label>
                    <select
                      value={reportIssue.priority}
                      onChange={(e) => setReportIssue({...reportIssue, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportIssue.location}
                      onChange={(e) => setReportIssue({...reportIssue, location: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Kitchen Station 1, Oven #2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Reported By *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportIssue.reported_by}
                      onChange={(e) => setReportIssue({...reportIssue, reported_by: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Estimated Fix Time
                    </label>
                    <input
                      type="text"
                      value={reportIssue.estimated_fix_time}
                      onChange={(e) => setReportIssue({...reportIssue, estimated_fix_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., 2 hours, 1 day"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={reportIssue.description}
                      onChange={(e) => setReportIssue({...reportIssue, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe the issue in detail..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={reportIssue.notes}
                      onChange={(e) => setReportIssue({...reportIssue, notes: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowReportIssueModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Order Details - #{selectedOrder.id}</h2>
                <button
                  onClick={() => setShowOrderDetailsModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <h3 className="font-medium text-secondary-900 mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Name:</span>
                        <span className="font-medium text-secondary-900">{selectedOrder.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Table/Room:</span>
                        <span className="font-medium text-secondary-900">{selectedOrder.table}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Order Time:</span>
                        <span className="font-medium text-secondary-900">5 minutes ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <h3 className="font-medium text-secondary-900 mb-3">Order Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Status:</span>
                        <span className="font-medium text-yellow-600">Pending</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Est. Time:</span>
                        <span className="font-medium text-secondary-900">15 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Priority:</span>
                        <span className="font-medium text-secondary-900">Normal</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h3 className="font-medium text-secondary-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div>
                        <p className="font-medium text-secondary-900">Grilled Salmon</p>
                        <p className="text-sm text-secondary-600">Main Course</p>
                      </div>
                      <span className="font-medium text-secondary-900">$24.99</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-secondary-900">Caesar Salad</p>
                        <p className="text-sm text-secondary-600">Appetizer</p>
                      </div>
                      <span className="font-medium text-secondary-900">$12.99</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h3 className="font-medium text-secondary-900 mb-3">Special Instructions</h3>
                  <p className="text-sm text-secondary-700">No onions, medium rare</p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    onClick={() => setShowOrderDetailsModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleOrderAction('Start Cooking', selectedOrder.id)}
                    className="btn-primary"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    Start Cooking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
