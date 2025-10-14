'use client';

import Layout from '@/components/Layout';
import { Calculator, DollarSign, FileText, TrendingUp, Receipt, PieChart, Plus, Eye, Download, X } from 'lucide-react';
import { mockFolios, mockDashboardStats } from '@/data/mockData';
import { useState } from 'react';

export default function AccountingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showViewTransactionsModal, setShowViewTransactionsModal] = useState(false);
  const [showFinancialReportsModal, setShowFinancialReportsModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [showReportGenerationModal, setShowReportGenerationModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  const openFolios = mockFolios.filter(folio => folio.status === 'open');
  const closedFolios = mockFolios.filter(folio => folio.status === 'closed');

  // Generate Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    invoice_date: '',
    due_date: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax_rate: 0.1,
    tax_amount: 0,
    total_amount: 0,
    notes: ''
  });

  // Report Generation Form State
  const [reportForm, setReportForm] = useState({
    report_type: '',
    start_date: '',
    end_date: '',
    format: 'pdf',
    include_charts: true,
    include_details: true,
    email_to: '',
    notes: ''
  });

  const totalRevenue = mockDashboardStats.revenue_by_outlet.rooms + mockDashboardStats.revenue_by_outlet.f_and_b + mockDashboardStats.revenue_by_outlet.other;
  const totalOutstanding = openFolios.reduce((sum, folio) => sum + folio.balance, 0);

  const handleGenerateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating invoice:', invoiceForm);
    setShowGenerateInvoiceModal(false);
    // Reset form
    setInvoiceForm({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      invoice_date: '',
      due_date: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      tax_rate: 0.1,
      tax_amount: 0,
      total_amount: 0,
      notes: ''
    });
  };

  const handleReportSelection = (report: any) => {
    setSelectedReport(report);
    setReportForm({
      report_type: report.name.toLowerCase().replace(' ', '_'),
      start_date: '',
      end_date: '',
      format: 'pdf',
      include_charts: true,
      include_details: true,
      email_to: '',
      notes: ''
    });
    setShowReportGenerationModal(true);
  };

  const handleReportGenerationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating report:', { selectedReport, reportForm });
    setShowReportGenerationModal(false);
    setSelectedReport(null);
    // Reset form
    setReportForm({
      report_type: '',
      start_date: '',
      end_date: '',
      format: 'pdf',
      include_charts: true,
      include_details: true,
      email_to: '',
      notes: ''
    });
  };

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
                <button 
                  onClick={() => setShowViewTransactionsModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Transactions</span>
                </button>
                <button 
                  onClick={() => setShowFinancialReportsModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <PieChart className="w-4 h-4" />
                  <span>Financial Reports</span>
                </button>
                <button 
                  onClick={() => setShowGenerateInvoiceModal(true)}
                  className="bg-white text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
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

        {/* View Transactions Modal */}
        {showViewTransactionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Transaction History</h2>
                <button
                  onClick={() => setShowViewTransactionsModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Total Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Receipt className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Transactions</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">1,247</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Outstanding</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">${totalOutstanding.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-800">Avg. Transaction</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">${(totalRevenue / 1247).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Recent Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-secondary-200">
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Description</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: '2024-01-15', type: 'Payment', description: 'Room 101 - Checkout', amount: 245.50, status: 'Completed' },
                          { date: '2024-01-15', type: 'Charge', description: 'Restaurant - Table 5', amount: 89.75, status: 'Pending' },
                          { date: '2024-01-15', type: 'Payment', description: 'Room 203 - Deposit', amount: 150.00, status: 'Completed' },
                          { date: '2024-01-14', type: 'Charge', description: 'Spa Services', amount: 120.00, status: 'Completed' },
                          { date: '2024-01-14', type: 'Refund', description: 'Cancellation - Room 105', amount: -200.00, status: 'Completed' }
                        ].map((transaction, index) => (
                          <tr key={index} className="border-b border-secondary-100">
                            <td className="py-3 px-4 text-sm text-secondary-900">{transaction.date}</td>
                            <td className="py-3 px-4 text-sm text-secondary-900">{transaction.type}</td>
                            <td className="py-3 px-4 text-sm text-secondary-900">{transaction.description}</td>
                            <td className={`py-3 px-4 text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${Math.abs(transaction.amount).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setShowViewTransactionsModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Financial Reports Modal */}
        {showFinancialReportsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Financial Reports</h2>
                <button
                  onClick={() => setShowFinancialReportsModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <PieChart className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-800">Revenue Breakdown</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Rooms</span>
                        <span className="font-medium text-green-900">${mockDashboardStats.revenue_by_outlet.rooms.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Food & Beverage</span>
                        <span className="font-medium text-green-900">${mockDashboardStats.revenue_by_outlet.f_and_b.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Other Services</span>
                        <span className="font-medium text-green-900">${mockDashboardStats.revenue_by_outlet.other.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-green-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-green-800">Total Revenue</span>
                          <span className="font-bold text-green-900">${totalRevenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-800">Performance Metrics</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Occupancy Rate</span>
                        <span className="font-medium text-blue-900">{mockDashboardStats.occupancy.today}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">ADR (Average Daily Rate)</span>
                        <span className="font-medium text-blue-900">$185.50</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">RevPAR</span>
                        <span className="font-medium text-blue-900">$144.69</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Total Bookings</span>
                        <span className="font-medium text-blue-900">1,247</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Available Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Income Statement', description: 'Monthly revenue and expense report', icon: FileText },
                      { name: 'Balance Sheet', description: 'Assets, liabilities, and equity', icon: PieChart },
                      { name: 'Cash Flow Statement', description: 'Cash inflows and outflows', icon: TrendingUp },
                      { name: 'Tax Report', description: 'Tax calculations and deductions', icon: Calculator }
                    ].map((report, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleReportSelection(report)}
                        className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <report.icon className="w-5 h-5 text-green-600" />
                          <div>
                            <h4 className="font-medium text-secondary-900">{report.name}</h4>
                            <p className="text-sm text-secondary-600">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setShowFinancialReportsModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
                <button className="btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generate Invoice Modal */}
        {showGenerateInvoiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Generate Invoice</h2>
                <button
                  onClick={() => setShowGenerateInvoiceModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleGenerateInvoiceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceForm.customer_name}
                      onChange={(e) => setInvoiceForm({...invoiceForm, customer_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Customer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={invoiceForm.customer_email}
                      onChange={(e) => setInvoiceForm({...invoiceForm, customer_email: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="customer@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Customer Phone
                    </label>
                    <input
                      type="tel"
                      value={invoiceForm.customer_phone}
                      onChange={(e) => setInvoiceForm({...invoiceForm, customer_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1-555-000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Invoice Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={invoiceForm.invoice_date}
                      onChange={(e) => setInvoiceForm({...invoiceForm, invoice_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={invoiceForm.due_date}
                      onChange={(e) => setInvoiceForm({...invoiceForm, due_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={invoiceForm.tax_rate * 100}
                      onChange={(e) => setInvoiceForm({...invoiceForm, tax_rate: parseFloat(e.target.value) / 100 || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-secondary-900">Invoice Items</h3>
                    <button
                      type="button"
                      onClick={() => setInvoiceForm({
                        ...invoiceForm,
                        items: [...invoiceForm.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
                      })}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {invoiceForm.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-secondary-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Description
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...invoiceForm.items];
                              newItems[index].description = e.target.value;
                              setInvoiceForm({...invoiceForm, items: newItems});
                            }}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Item description"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...invoiceForm.items];
                              newItems[index].quantity = parseInt(e.target.value) || 1;
                              newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                              setInvoiceForm({...invoiceForm, items: newItems});
                            }}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Rate ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => {
                              const newItems = [...invoiceForm.items];
                              newItems[index].rate = parseFloat(e.target.value) || 0;
                              newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                              setInvoiceForm({...invoiceForm, items: newItems});
                            }}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Amount ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.amount}
                            readOnly
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={invoiceForm.notes}
                    onChange={(e) => setInvoiceForm({...invoiceForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Additional notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowGenerateInvoiceModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Generation Modal */}
        {showReportGenerationModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Generate Report</h2>
                <button
                  onClick={() => setShowReportGenerationModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Selected Report Display */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <selectedReport.icon className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">{selectedReport.name}</h3>
                    <p className="text-green-700">{selectedReport.description}</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleReportGenerationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={reportForm.start_date}
                      onChange={(e) => setReportForm({...reportForm, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={reportForm.end_date}
                      onChange={(e) => setReportForm({...reportForm, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Report Format
                    </label>
                    <select
                      value={reportForm.format}
                      onChange={(e) => setReportForm({...reportForm, format: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email To
                    </label>
                    <input
                      type="email"
                      value={reportForm.email_to}
                      onChange={(e) => setReportForm({...reportForm, email_to: e.target.value})}
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
                          checked={reportForm.include_charts}
                          onChange={(e) => setReportForm({...reportForm, include_charts: e.target.checked})}
                          className="w-4 h-4 text-green-600 border-secondary-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-secondary-700">Include charts and graphs</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={reportForm.include_details}
                          onChange={(e) => setReportForm({...reportForm, include_details: e.target.checked})}
                          className="w-4 h-4 text-green-600 border-secondary-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-secondary-700">Include detailed breakdowns</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={reportForm.notes}
                      onChange={(e) => setReportForm({...reportForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes or special requirements..."
                    />
                  </div>
                </div>
                
                {/* Report Preview */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-2">Report Preview</h4>
                  <div className="text-sm text-secondary-600 space-y-1">
                    <p><strong>Type:</strong> {selectedReport.name}</p>
                    <p><strong>Period:</strong> {reportForm.start_date && reportForm.end_date ? `${reportForm.start_date} to ${reportForm.end_date}` : 'Select dates'}</p>
                    <p><strong>Format:</strong> {reportForm.format.toUpperCase()}</p>
                    <p><strong>Charts:</strong> {reportForm.include_charts ? 'Yes' : 'No'}</p>
                    <p><strong>Details:</strong> {reportForm.include_details ? 'Yes' : 'No'}</p>
                    {reportForm.email_to && <p><strong>Email:</strong> {reportForm.email_to}</p>}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowReportGenerationModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
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
