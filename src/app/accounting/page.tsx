'use client';

import Layout from '@/components/Layout';
import { Calculator, DollarSign, FileText, TrendingUp, Receipt, PieChart, Plus, Eye, Download } from 'lucide-react';
import { mockFolios, mockDashboardStats } from '@/data/mockData';
import { useState } from 'react';

export default function AccountingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const openFolios = mockFolios.filter(folio => folio.status === 'open');
  const closedFolios = mockFolios.filter(folio => folio.status === 'closed');

  const totalRevenue = mockDashboardStats.revenue_by_outlet.rooms + mockDashboardStats.revenue_by_outlet.f_and_b + mockDashboardStats.revenue_by_outlet.other;
  const totalOutstanding = openFolios.reduce((sum, folio) => sum + folio.balance, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Accounting & Finance</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Financial Management</span>
                </div>
              </div>
              
              <p className="text-green-100 text-lg mb-6">
                Comprehensive financial management and accounting tools for your hotel operations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Calculator className="w-4 h-4" />
                  <span className="text-green-100">Real-time Accounting</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-green-200">Fiscal Year:</span>
                  <span className="font-medium">2024</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-green-200">Last Reconciliation:</span>
                  <span className="font-medium">Today</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Receipt className="w-4 h-4" />
                  <span>View Transactions</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <PieChart className="w-4 h-4" />
                  <span>Financial Reports</span>
                </button>
                <button className="bg-white text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <FileText className="w-4 h-4" />
                  <span>Generate Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12.5% vs last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-secondary-900">${totalOutstanding.toLocaleString()}</p>
                <p className="text-sm text-orange-600">{openFolios.length} open folios</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Receipt className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Room Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">${mockDashboardStats.revenue_by_outlet.rooms.toLocaleString()}</p>
                <p className="text-sm text-blue-600">68% of total</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">F&B Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">${mockDashboardStats.revenue_by_outlet.f_and_b.toLocaleString()}</p>
                <p className="text-sm text-purple-600">25% of total</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Outlet */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Revenue by Outlet</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="font-medium text-secondary-900">Rooms</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary-900">${mockDashboardStats.revenue_by_outlet.rooms.toLocaleString()}</p>
                    <p className="text-sm text-secondary-500">68%</p>
                  </div>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="font-medium text-secondary-900">Food & Beverage</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary-900">${mockDashboardStats.revenue_by_outlet.f_and_b.toLocaleString()}</p>
                    <p className="text-sm text-secondary-500">25%</p>
                  </div>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="font-medium text-secondary-900">Other Services</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary-900">${mockDashboardStats.revenue_by_outlet.other.toLocaleString()}</p>
                    <p className="text-sm text-secondary-500">7%</p>
                  </div>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Recent Transactions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockFolios.slice(0, 5).map((folio) => (
                  <div key={folio.folio_id} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">Folio #{folio.folio_id.slice(-6)}</p>
                      <p className="text-sm text-secondary-600">
                        {folio.charges.length} charges • {folio.payments.length} payments
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${folio.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        ${Math.abs(folio.balance).toFixed(2)}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        folio.status === 'open' ? 'bg-orange-100 text-orange-800' : 
                        folio.status === 'closed' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {folio.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Open Folios */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Open Folios</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Folio</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Folio ID</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Booking ID</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Charges</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Payments</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {openFolios.map((folio) => (
                    <tr key={folio.folio_id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4 font-medium text-secondary-900">#{folio.folio_id.slice(-6)}</td>
                      <td className="py-3 px-4 text-secondary-600">#{folio.booking_id.slice(-6)}</td>
                      <td className="py-3 px-4 text-secondary-600">{folio.charges.length}</td>
                      <td className="py-3 px-4 text-secondary-600">{folio.payments.length}</td>
                      <td className="py-3 px-4 font-semibold text-orange-600">${folio.balance.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          {folio.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-secondary-400 hover:text-secondary-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600">
                            <Download className="w-4 h-4" />
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
      </div>
    </Layout>
  );
}
