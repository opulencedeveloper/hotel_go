'use client';

import Layout from '@/components/Layout';
import { Truck, Package, ShoppingCart, AlertTriangle, TrendingUp, CheckCircle, Plus, Eye, Edit, Download } from 'lucide-react';
import { mockSuppliers } from '@/data/mockData';
import { useState } from 'react';

export default function ProcurementPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
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

  const filteredInventory = selectedCategory === 'all' 
    ? mockInventory 
    : mockInventory.filter(item => item.category === selectedCategory);

  return (
    <Layout>
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
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Place Order</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Package className="w-4 h-4" />
                  <span>Inventory Report</span>
                </button>
                <button className="bg-white text-orange-600 hover:bg-orange-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
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
                  <button className="mt-3 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
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
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
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
      </div>
    </Layout>
  );
}
