'use client';

import { Truck, Package, ShoppingCart, AlertTriangle, TrendingUp, CheckCircle, Plus, Eye, Edit, Download, X } from 'lucide-react';
import { mockSuppliers } from '@/data/mockData';
import { useState } from 'react';

export default function ProcurementPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);
  const [showInventoryReportModal, setShowInventoryReportModal] = useState(false);
  const [showTrackDeliveriesModal, setShowTrackDeliveriesModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedReorderItem, setSelectedReorderItem] = useState<any>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  
  // Mock inventory data
  const mockInventory = [
    { id: '1', name: 'Fresh Vegetables', category: 'food', qty_on_hand: 45, min_stock: 20, max_stock: 100, unit_cost: 2.50, supplier: 'Fresh Food Supply Co.', status: 'good' },
    { id: '2', name: 'Cleaning Supplies', category: 'housekeeping', qty_on_hand: 8, min_stock: 15, max_stock: 50, unit_cost: 12.99, supplier: 'CleanPro Solutions', status: 'low' },
    { id: '3', name: 'Towels', category: 'linen', qty_on_hand: 120, min_stock: 50, max_stock: 200, unit_cost: 8.50, supplier: 'Linen Direct', status: 'good' },
    { id: '4', name: 'Coffee Beans', category: 'beverage', qty_on_hand: 5, min_stock: 10, max_stock: 30, unit_cost: 15.99, supplier: 'Premium Coffee Co.', status: 'critical' },
    { id: '5', name: 'Toilet Paper', category: 'housekeeping', qty_on_hand: 25, min_stock: 20, max_stock: 80, unit_cost: 3.99, supplier: 'CleanPro Solutions', status: 'good' },
  ];

  const mockPurchaseOrders = [
    { id: 'PO-001', supplier: 'Fresh Food Supply Co.', date: '2024-01-15', status: 'confirmed', total: 1250.00, items: 12 },
    { id: 'PO-002', supplier: 'CleanPro Solutions', date: '2024-01-14', status: 'pending', total: 450.00, items: 8 },
    { id: 'PO-003', supplier: 'Linen Direct', date: '2024-01-13', status: 'received', total: 680.00, items: 15 },
  ];

  const lowStockItems = mockInventory.filter(item => item.status === 'low' || item.status === 'critical');
  const totalInventoryValue = mockInventory.reduce((sum, item) => sum + (item.qty_on_hand * item.unit_cost), 0);

  // Place Order Form State
  const [placeOrderForm, setPlaceOrderForm] = useState({
    supplier: '',
    order_date: '',
    expected_delivery: '',
    items: [{ name: '', quantity: 1, unit_cost: 0, total: 0 }],
    notes: '',
    priority: 'normal'
  });

  // Inventory Report Form State
  const [inventoryReportForm, setInventoryReportForm] = useState({
    report_type: 'stock_levels',
    category: 'all',
    format: 'pdf',
    include_suppliers: true,
    include_costs: true,
    email_to: ''
  });

  // Track Deliveries Form State
  const [trackDeliveriesForm, setTrackDeliveriesForm] = useState({
    tracking_number: '',
    supplier: '',
    order_id: '',
    status: 'all'
  });

  // Reorder Form State
  const [reorderForm, setReorderForm] = useState({
    item_name: '',
    current_stock: 0,
    min_stock: 0,
    max_stock: 0,
    reorder_quantity: 0,
    unit_cost: 0,
    supplier: '',
    priority: 'high',
    notes: ''
  });

  // Add Item Form State
  const [addItemForm, setAddItemForm] = useState({
    name: '',
    category: 'food',
    qty_on_hand: 0,
    min_stock: 0,
    max_stock: 0,
    unit_cost: 0,
    supplier: '',
    description: '',
    unit: 'pieces',
    location: '',
    notes: ''
  });

  // Add Category Form State
  const [addCategoryForm, setAddCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'package'
  });

  // Add Supplier Form State
  const [addSupplierForm, setAddSupplierForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    payment_terms: '30',
    currency: 'USD',
    notes: ''
  });

  const filteredInventory = selectedCategory === 'all' 
    ? mockInventory 
    : mockInventory.filter(item => item.category === selectedCategory);

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Placing order:', placeOrderForm);
    setShowPlaceOrderModal(false);
    // Reset form
    setPlaceOrderForm({
      supplier: '',
      order_date: '',
      expected_delivery: '',
      items: [{ name: '', quantity: 1, unit_cost: 0, total: 0 }],
      notes: '',
      priority: 'normal'
    });
  };

  const handleInventoryReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating inventory report:', inventoryReportForm);
    setShowInventoryReportModal(false);
    // Reset form
    setInventoryReportForm({
      report_type: 'stock_levels',
      category: 'all',
      format: 'pdf',
      include_suppliers: true,
      include_costs: true,
      email_to: ''
    });
  };

  const handleTrackDeliveriesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tracking deliveries:', trackDeliveriesForm);
    setShowTrackDeliveriesModal(false);
    // Reset form
    setTrackDeliveriesForm({
      tracking_number: '',
      supplier: '',
      order_id: '',
      status: 'all'
    });
  };

  const handleReorderItem = (item: any) => {
    setSelectedReorderItem(item);
    setReorderForm({
      item_name: item.name,
      current_stock: item.qty_on_hand,
      min_stock: item.min_stock,
      max_stock: item.max_stock,
      reorder_quantity: item.max_stock - item.qty_on_hand,
      unit_cost: item.unit_cost,
      supplier: item.supplier,
      priority: 'high',
      notes: ''
    });
    setShowReorderModal(true);
  };

  const handleReorderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reordering item:', { selectedReorderItem, reorderForm });
    setShowReorderModal(false);
    setSelectedReorderItem(null);
    // Reset form
    setReorderForm({
      item_name: '',
      current_stock: 0,
      min_stock: 0,
      max_stock: 0,
      reorder_quantity: 0,
      unit_cost: 0,
      supplier: '',
      priority: 'high',
      notes: ''
    });
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new item:', addItemForm);
    setShowAddItemModal(false);
    // Reset form
    setAddItemForm({
      name: '',
      category: 'food',
      qty_on_hand: 0,
      min_stock: 0,
      max_stock: 0,
      unit_cost: 0,
      supplier: '',
      description: '',
      unit: 'pieces',
      location: '',
      notes: ''
    });
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new category:', addCategoryForm);
    setShowAddCategoryModal(false);
    // Reset form
    setAddCategoryForm({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: 'package'
    });
  };

  const handleAddSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new supplier:', addSupplierForm);
    setShowAddSupplierModal(false);
    // Reset form
    setAddSupplierForm({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postal_code: '',
      payment_terms: '30',
      currency: 'USD',
      notes: ''
    });
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Procurement & Inventory</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Supply Chain Management</span>
                </div>
              </div>
              
              <p className="text-orange-100 text-lg mb-6">
                Streamline your supply chain and manage inventory efficiently across all hotel operations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Package className="w-4 h-4" />
                  <span className="text-orange-100">Inventory Tracking Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-orange-200">Active Suppliers:</span>
                  <span className="font-medium">{mockSuppliers.length}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-orange-200">Low Stock Items:</span>
                  <span className="font-medium">{lowStockItems.length}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowPlaceOrderModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Place Order</span>
                </button>
                <button 
                  onClick={() => setShowInventoryReportModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Package className="w-4 h-4" />
                  <span>Inventory Report</span>
                </button>
                <button 
                  onClick={() => setShowTrackDeliveriesModal(true)}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Deliveries</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Inventory Value</p>
                <p className="text-2xl font-bold text-secondary-900">${totalInventoryValue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+5.2% vs last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-secondary-900">{lowStockItems.length}</p>
                <p className="text-sm text-orange-600">Requires attention</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Active Suppliers</p>
                <p className="text-2xl font-bold text-secondary-900">{mockSuppliers.length}</p>
                <p className="text-sm text-blue-600">All active</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Pending Orders</p>
                <p className="text-2xl font-bold text-secondary-900">{mockPurchaseOrders.filter(po => po.status === 'pending').length}</p>
                <p className="text-sm text-purple-600">Awaiting confirmation</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-800">Low Stock Alerts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="bg-white border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-secondary-900">{item.name}</h3>
                      <p className="text-sm text-secondary-600">Current: {item.qty_on_hand} • Min: {item.min_stock}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleReorderItem(item)}
                    className="mt-3 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    Reorder Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Management */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Inventory Management</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food</option>
                  <option value="beverage">Beverage</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="linen">Linen</option>
                </select>
                <button 
                  onClick={() => setShowAddCategoryModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
                <button 
                  onClick={() => setShowAddSupplierModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Supplier</span>
                </button>
                <button 
                  onClick={() => setShowAddItemModal(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Item</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Current Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Min/Max</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Unit Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Supplier</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4 font-medium text-secondary-900">{item.name}</td>
                      <td className="py-3 px-4 text-secondary-600 capitalize">{item.category}</td>
                      <td className="py-3 px-4 font-semibold text-secondary-900">{item.qty_on_hand}</td>
                      <td className="py-3 px-4 text-secondary-600">{item.min_stock}/{item.max_stock}</td>
                      <td className="py-3 px-4 text-secondary-600">${item.unit_cost}</td>
                      <td className="py-3 px-4 text-secondary-600">{item.supplier}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'good' ? 'bg-green-100 text-green-800' :
                          item.status === 'low' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="Edit Item">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="Reorder">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Purchase Orders & Suppliers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Purchase Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Recent Purchase Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockPurchaseOrders.map((order) => (
                  <div key={order.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{order.id}</h3>
                        <p className="text-sm text-secondary-600">{order.supplier}</p>
                        <p className="text-sm text-secondary-500">{order.date} • {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary-900">${order.total.toFixed(2)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suppliers */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Suppliers</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockSuppliers.map((supplier) => (
                  <div key={supplier.supplier_id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{supplier.name}</h3>
                        <p className="text-sm text-secondary-600">{supplier.contact_person}</p>
                        <p className="text-sm text-secondary-500">{supplier.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary-600">Credit Limit</p>
                        <p className="font-semibold text-secondary-900">${supplier.credit_limit?.toLocaleString()}</p>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {supplier.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Place Order Modal */}
        {showPlaceOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Place New Order</h2>
                <button
                  onClick={() => setShowPlaceOrderModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handlePlaceOrderSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Supplier *
                    </label>
                    <select
                      required
                      value={placeOrderForm.supplier}
                      onChange={(e) => setPlaceOrderForm({...placeOrderForm, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select supplier</option>
                      <option value="Fresh Food Supply Co.">Fresh Food Supply Co.</option>
                      <option value="CleanPro Solutions">CleanPro Solutions</option>
                      <option value="Linen Direct">Linen Direct</option>
                      <option value="Premium Coffee Co.">Premium Coffee Co.</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Order Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={placeOrderForm.order_date}
                      onChange={(e) => setPlaceOrderForm({...placeOrderForm, order_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Expected Delivery
                    </label>
                    <input
                      type="date"
                      value={placeOrderForm.expected_delivery}
                      onChange={(e) => setPlaceOrderForm({...placeOrderForm, expected_delivery: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={placeOrderForm.priority}
                      onChange={(e) => setPlaceOrderForm({...placeOrderForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Order Items
                  </label>
                  <div className="space-y-4">
                    {placeOrderForm.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-secondary-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Item Name
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...placeOrderForm.items];
                              newItems[index].name = e.target.value;
                              setPlaceOrderForm({...placeOrderForm, items: newItems});
                            }}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter item name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...placeOrderForm.items];
                              newItems[index].quantity = parseInt(e.target.value) || 1;
                              newItems[index].total = newItems[index].quantity * newItems[index].unit_cost;
                              setPlaceOrderForm({...placeOrderForm, items: newItems});
                            }}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Unit Cost ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_cost}
                            onChange={(e) => {
                              const newItems = [...placeOrderForm.items];
                              newItems[index].unit_cost = parseFloat(e.target.value) || 0;
                              newItems[index].total = newItems[index].quantity * newItems[index].unit_cost;
                              setPlaceOrderForm({...placeOrderForm, items: newItems});
                            }}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Total ($)
                          </label>
                          <input
                            type="number"
                            value={item.total}
                            readOnly
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={placeOrderForm.notes}
                    onChange={(e) => setPlaceOrderForm({...placeOrderForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Additional notes or special instructions..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowPlaceOrderModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Inventory Report Modal */}
        {showInventoryReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Generate Inventory Report</h2>
                <button
                  onClick={() => setShowInventoryReportModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleInventoryReportSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Report Type
                    </label>
                    <select
                      value={inventoryReportForm.report_type}
                      onChange={(e) => setInventoryReportForm({...inventoryReportForm, report_type: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="stock_levels">Stock Levels</option>
                      <option value="low_stock">Low Stock Alert</option>
                      <option value="inventory_value">Inventory Value</option>
                      <option value="usage_analysis">Usage Analysis</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category
                    </label>
                    <select
                      value={inventoryReportForm.category}
                      onChange={(e) => setInventoryReportForm({...inventoryReportForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="food">Food</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="linen">Linen</option>
                      <option value="beverage">Beverage</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Format
                    </label>
                    <select
                      value={inventoryReportForm.format}
                      onChange={(e) => setInventoryReportForm({...inventoryReportForm, format: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email To
                    </label>
                    <input
                      type="email"
                      value={inventoryReportForm.email_to}
                      onChange={(e) => setInventoryReportForm({...inventoryReportForm, email_to: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Report Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={inventoryReportForm.include_suppliers}
                          onChange={(e) => setInventoryReportForm({...inventoryReportForm, include_suppliers: e.target.checked})}
                          className="w-4 h-4 text-orange-600 border-secondary-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-secondary-700">Include supplier information</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={inventoryReportForm.include_costs}
                          onChange={(e) => setInventoryReportForm({...inventoryReportForm, include_costs: e.target.checked})}
                          className="w-4 h-4 text-orange-600 border-secondary-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-secondary-700">Include cost information</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowInventoryReportModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Generate Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Track Deliveries Modal */}
        {showTrackDeliveriesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Track Deliveries</h2>
                <button
                  onClick={() => setShowTrackDeliveriesModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleTrackDeliveriesSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackDeliveriesForm.tracking_number}
                      onChange={(e) => setTrackDeliveriesForm({...trackDeliveriesForm, tracking_number: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Supplier
                    </label>
                    <select
                      value={trackDeliveriesForm.supplier}
                      onChange={(e) => setTrackDeliveriesForm({...trackDeliveriesForm, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">All Suppliers</option>
                      <option value="Fresh Food Supply Co.">Fresh Food Supply Co.</option>
                      <option value="CleanPro Solutions">CleanPro Solutions</option>
                      <option value="Linen Direct">Linen Direct</option>
                      <option value="Premium Coffee Co.">Premium Coffee Co.</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={trackDeliveriesForm.order_id}
                      onChange={(e) => setTrackDeliveriesForm({...trackDeliveriesForm, order_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter order ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status
                    </label>
                    <select
                      value={trackDeliveriesForm.status}
                      onChange={(e) => setTrackDeliveriesForm({...trackDeliveriesForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
                
                {/* Sample Delivery Tracking Results */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-3">Recent Deliveries</h4>
                  <div className="space-y-3">
                    {mockPurchaseOrders.map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-secondary-200">
                        <div className="flex items-center space-x-3">
                          <Truck className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="font-medium text-secondary-900">{order.id}</p>
                            <p className="text-sm text-secondary-600">{order.supplier}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary-600">{order.date}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowTrackDeliveriesModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Track Deliveries
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reorder Modal */}
        {showReorderModal && selectedReorderItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Reorder Item</h2>
                <button
                  onClick={() => setShowReorderModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Selected Item Display */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-orange-800">{selectedReorderItem.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedReorderItem.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedReorderItem.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-orange-700">Current Stock:</span>
                    <span className="font-medium text-orange-900 ml-1">{selectedReorderItem.qty_on_hand}</span>
                  </div>
                  <div>
                    <span className="text-orange-700">Min Stock:</span>
                    <span className="font-medium text-orange-900 ml-1">{selectedReorderItem.min_stock}</span>
                  </div>
                  <div>
                    <span className="text-orange-700">Max Stock:</span>
                    <span className="font-medium text-orange-900 ml-1">{selectedReorderItem.max_stock}</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleReorderSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={reorderForm.item_name}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={reorderForm.supplier}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Reorder Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={reorderForm.reorder_quantity}
                      onChange={(e) => setReorderForm({...reorderForm, reorder_quantity: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      Suggested: {reorderForm.max_stock - reorderForm.current_stock} units
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Unit Cost ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={reorderForm.unit_cost}
                      onChange={(e) => setReorderForm({...reorderForm, unit_cost: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={reorderForm.priority}
                      onChange={(e) => setReorderForm({...reorderForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Total Cost ($)
                    </label>
                    <input
                      type="number"
                      value={(reorderForm.reorder_quantity * reorderForm.unit_cost).toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-600"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={reorderForm.notes}
                    onChange={(e) => setReorderForm({...reorderForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Additional notes or special instructions..."
                  />
                </div>
                
                {/* Stock Level Warning */}
                <div className={`p-4 rounded-lg border ${
                  selectedReorderItem.status === 'critical' 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-5 h-5 ${
                      selectedReorderItem.status === 'critical' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                    <span className={`font-medium ${
                      selectedReorderItem.status === 'critical' ? 'text-red-800' : 'text-orange-800'
                    }`}>
                      {selectedReorderItem.status === 'critical' 
                        ? 'Critical Stock Level - Immediate reorder required'
                        : 'Low Stock Level - Reorder recommended'
                      }
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    selectedReorderItem.status === 'critical' ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    Current stock ({selectedReorderItem.qty_on_hand}) is below minimum required ({selectedReorderItem.min_stock})
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowReorderModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Place Reorder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Inventory Item</h2>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddItemSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addItemForm.name}
                      onChange={(e) => setAddItemForm({...addItemForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter item name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={addItemForm.category}
                      onChange={(e) => setAddItemForm({...addItemForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="food">Food</option>
                      <option value="beverage">Beverage</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="linen">Linen</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="office">Office Supplies</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Current Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={addItemForm.qty_on_hand}
                      onChange={(e) => setAddItemForm({...addItemForm, qty_on_hand: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={addItemForm.unit}
                      onChange={(e) => setAddItemForm({...addItemForm, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="liters">Liters</option>
                      <option value="boxes">Boxes</option>
                      <option value="rolls">Rolls</option>
                      <option value="bottles">Bottles</option>
                      <option value="cans">Cans</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Minimum Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={addItemForm.min_stock}
                      onChange={(e) => setAddItemForm({...addItemForm, min_stock: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Maximum Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={addItemForm.max_stock}
                      onChange={(e) => setAddItemForm({...addItemForm, max_stock: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Unit Cost ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={addItemForm.unit_cost}
                      onChange={(e) => setAddItemForm({...addItemForm, unit_cost: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Supplier *
                    </label>
                    <select
                      required
                      value={addItemForm.supplier}
                      onChange={(e) => setAddItemForm({...addItemForm, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select supplier</option>
                      <option value="Fresh Food Supply Co.">Fresh Food Supply Co.</option>
                      <option value="CleanPro Solutions">CleanPro Solutions</option>
                      <option value="Linen Direct">Linen Direct</option>
                      <option value="Premium Coffee Co.">Premium Coffee Co.</option>
                      <option value="Office Depot">Office Depot</option>
                      <option value="Maintenance Plus">Maintenance Plus</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Storage Location
                    </label>
                    <input
                      type="text"
                      value={addItemForm.location}
                      onChange={(e) => setAddItemForm({...addItemForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Kitchen Pantry, Storage Room A"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={addItemForm.description}
                      onChange={(e) => setAddItemForm({...addItemForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Item description and specifications..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={addItemForm.notes}
                      onChange={(e) => setAddItemForm({...addItemForm, notes: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes or special handling instructions..."
                    />
                  </div>
                </div>
                
                {/* Stock Level Preview */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-3">Stock Level Preview</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-secondary-600">Current Stock:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addItemForm.qty_on_hand} {addItemForm.unit}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Min Stock:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addItemForm.min_stock} {addItemForm.unit}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Max Stock:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addItemForm.max_stock} {addItemForm.unit}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-secondary-600">Total Value:</span>
                    <span className="font-medium text-secondary-900 ml-1">${(addItemForm.qty_on_hand * addItemForm.unit_cost).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Category</h2>
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddCategorySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addCategoryForm.name}
                      onChange={(e) => setAddCategoryForm({...addCategoryForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter category name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={addCategoryForm.color}
                        onChange={(e) => setAddCategoryForm({...addCategoryForm, color: e.target.value})}
                        className="w-12 h-10 border border-secondary-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={addCategoryForm.color}
                        onChange={(e) => setAddCategoryForm({...addCategoryForm, color: e.target.value})}
                        className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={addCategoryForm.icon}
                      onChange={(e) => setAddCategoryForm({...addCategoryForm, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="package">📦 Package</option>
                      <option value="food">🍽️ Food</option>
                      <option value="beverage">🥤 Beverage</option>
                      <option value="cleaning">🧽 Cleaning</option>
                      <option value="linen">🛏️ Linen</option>
                      <option value="maintenance">🔧 Maintenance</option>
                      <option value="office">📋 Office</option>
                      <option value="medical">🏥 Medical</option>
                      <option value="safety">🛡️ Safety</option>
                      <option value="electronics">📱 Electronics</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={addCategoryForm.description}
                      onChange={(e) => setAddCategoryForm({...addCategoryForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter category description..."
                    />
                  </div>
                </div>
                
                {/* Category Preview */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-3">Category Preview</h4>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: addCategoryForm.color }}
                    >
                      {addCategoryForm.icon === 'package' && '📦'}
                      {addCategoryForm.icon === 'food' && '🍽️'}
                      {addCategoryForm.icon === 'beverage' && '🥤'}
                      {addCategoryForm.icon === 'cleaning' && '🧽'}
                      {addCategoryForm.icon === 'linen' && '🛏️'}
                      {addCategoryForm.icon === 'maintenance' && '🔧'}
                      {addCategoryForm.icon === 'office' && '📋'}
                      {addCategoryForm.icon === 'medical' && '🏥'}
                      {addCategoryForm.icon === 'safety' && '🛡️'}
                      {addCategoryForm.icon === 'electronics' && '📱'}
                    </div>
                    <div>
                      <span className="font-medium text-secondary-900">{addCategoryForm.name || 'Category Name'}</span>
                      <p className="text-sm text-secondary-600">{addCategoryForm.description || 'Category description...'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Supplier Modal */}
        {showAddSupplierModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Supplier</h2>
                <button
                  onClick={() => setShowAddSupplierModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddSupplierSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSupplierForm.name}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSupplierForm.contact_person}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, contact_person: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter contact person name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={addSupplierForm.email}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addSupplierForm.phone}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSupplierForm.address}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, address: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSupplierForm.city}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSupplierForm.country}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, country: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={addSupplierForm.postal_code}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, postal_code: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter postal code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Payment Terms (Days)
                    </label>
                    <select
                      value={addSupplierForm.payment_terms}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, payment_terms: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="0">Cash on Delivery</option>
                      <option value="7">7 Days</option>
                      <option value="15">15 Days</option>
                      <option value="30">30 Days</option>
                      <option value="45">45 Days</option>
                      <option value="60">60 Days</option>
                      <option value="90">90 Days</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={addSupplierForm.currency}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, currency: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="USD">🇺🇸 US Dollar (USD)</option>
                      <option value="EUR">🇪🇺 Euro (EUR)</option>
                      <option value="GBP">🇬🇧 British Pound (GBP)</option>
                      <option value="JPY">🇯🇵 Japanese Yen (JPY)</option>
                      <option value="CAD">🇨🇦 Canadian Dollar (CAD)</option>
                      <option value="AUD">🇦🇺 Australian Dollar (AUD)</option>
                      <option value="CHF">🇨🇭 Swiss Franc (CHF)</option>
                      <option value="CNY">🇨🇳 Chinese Yuan (CNY)</option>
                      <option value="INR">🇮🇳 Indian Rupee (INR)</option>
                      <option value="BRL">🇧🇷 Brazilian Real (BRL)</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={addSupplierForm.notes}
                      onChange={(e) => setAddSupplierForm({...addSupplierForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes about the supplier..."
                    />
                  </div>
                </div>
                
                {/* Supplier Preview */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-3">Supplier Preview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-secondary-600">Company:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addSupplierForm.name || 'Company Name'}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Contact:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addSupplierForm.contact_person || 'Contact Person'}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Email:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addSupplierForm.email || 'email@example.com'}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Phone:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addSupplierForm.phone || '+1234567890'}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Location:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addSupplierForm.city}, {addSupplierForm.country}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Payment:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addSupplierForm.payment_terms} days</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Currency:</span>
                      <span className="font-medium text-secondary-900 ml-1">{addSupplierForm.currency}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowAddSupplierModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    
  );
}
