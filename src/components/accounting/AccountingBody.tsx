'use client';

import { Calculator, DollarSign, FileText, TrendingUp, Receipt, PieChart, Plus, Eye, Download, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { OrderType, StayType, PaymentStatus } from '@/utils/enum';
import { OrderStatus } from '@/lib/server/order/enum';
import AccountingHeader from './AccountingHeader';
import FinancialOverviewCards from './FinancialOverviewCards';
import RevenueBreakdown from './RevenueBreakdown';
import OpenFoliosTable from './OpenFoliosTable';
import RecentTransactions from './RecentTransactions';
import ViewTransactionsModal from './modals/ViewTransactionsModal';

interface AccountingBodyProps {
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onRefetch?: () => void;
  isLoading?: boolean;
}

export default function AccountingBody({ 
  selectedPeriod: externalPeriod, 
  onPeriodChange, 
  onRefetch, 
  isLoading: externalIsLoading 
}: AccountingBodyProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(externalPeriod || '30d');
  const [showViewTransactionsModal, setShowViewTransactionsModal] = useState(false);
  const [showFinancialReportsModal, setShowFinancialReportsModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [showReportGenerationModal, setShowReportGenerationModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedFolio, setSelectedFolio] = useState<any>(null);
  const [showFolioModal, setShowFolioModal] = useState(false);
  
  // Redux State (using analytics slice like analytics page)
  const analytics = useSelector((state: RootState) => state.analytics);
  const { stays, orders } = analytics;
  
  // Convert stays to folio-like structure from analytics Redux state - only real data
  const folios = useMemo(() => {
    if (!stays || stays.length === 0) return [];
    
    return stays.map(stay => {
      // Calculate charges from stay financial data
      const charges = [];
      if (stay.totalAmount && stay.totalAmount > 0) {
        charges.push({
          description: `Room ${stay.roomId?.roomNumber || ''} - ${stay.guestName}`,
          amount: stay.totalAmount,
          posted_at: stay.checkInDate || stay.reatedAt
        });
      }
      
      // Calculate payments from paid amount
      const payments = [];
      if (stay.paidAmount && stay.paidAmount > 0) {
        payments.push({
          amount: stay.paidAmount,
          method: stay.paymentMethod || 'unknown',
          processed_at: stay.paymentDate || stay.reatedAt
        });
      }
      
      // Determine stay type for display
      let stayType = 'Booking';
      if (stay.type === StayType.WALK_IN) {
        stayType = 'Walk-in';
      } else if (stay.type === StayType.BOOKED) {
        stayType = 'Booked';
      } else if (stay.type === StayType.RESERVED) {
        stayType = 'Reserved';
      }
      
      return {
        folio_id: stay._id,
        booking_id: stay._id,
        guest_name: stay.guestName,
        guest_email: stay.emailAddress,
        guest_phone: stay.phoneNumber,
        guest_address: stay.address,
        room_number: stay.roomId?.roomNumber || '',
        room_id: stay.roomId?._id || '',
        type: stayType,
        check_in: stay.checkInDate,
        check_out: stay.checkOutDate,
        adults: stay.adults,
        children: stay.children,
        total_amount: stay.totalAmount || 0,
        paid_amount: stay.paidAmount || 0,
        balance: (stay.totalAmount || 0) - (stay.paidAmount || 0),
        currency: 'USD',
        status: stay.paymentStatus === 'completed' ? 'closed' : 'open' as const,
        payment_status: stay.paymentStatus,
        payment_method: stay.paymentMethod,
        payment_date: stay.paymentDate,
        charges: charges,
        payments: payments
      };
    });
  }, [stays]);
  
  const openFolios = folios.filter(folio => folio.status === 'open');
  const closedFolios = folios.filter(folio => folio.status === 'closed');

  // Debug: Log all folios to understand balance and status
  console.log('All Folios:', folios.map(f => ({
    guest: f.guest_name,
    total_amount: f.total_amount,
    paid_amount: f.paid_amount,
    balance: f.balance,
    status: f.status,
    payment_status: f.payment_status
  })));
  
  // Debug: Log open folios data to understand balance calculation
  if (openFolios.length > 0) {
    console.log('Open Folios Data:', openFolios.map(f => ({
      guest: f.guest_name,
      total_amount: f.total_amount,
      paid_amount: f.paid_amount,
      balance: f.balance
    })));
  }
  
  // Debug: Calculate outstanding from all open folios
  const calculatedOutstanding = openFolios.reduce((sum, folio) => sum + folio.balance, 0);
  console.log('Calculated Outstanding:', calculatedOutstanding);

  // Convert stays and orders to transaction-like structure for RecentTransactions
  const recentTransactions = useMemo(() => {
    const allTransactions: any[] = [];
    
    // Convert stays to transactions
    if (stays && stays.length > 0) {
      stays.forEach(stay => {
        // Use the actual stay type value from the enum
        let transactionType = stay.type;
        if (stay.type === StayType.WALK_IN) {
          transactionType = 'Walk-in';
        } else if (stay.type === StayType.BOOKED) {
          transactionType = 'Booked';
        } else if (stay.type === StayType.RESERVED) {
          transactionType = 'Reserved';
        }
        
        allTransactions.push({
          id: stay._id,
          type: transactionType,
          category: 'stay',
          description: `${stay.guestName} - ${stay.roomId?.roomNumber || 'Room'}`,
          amount: stay.totalAmount || 0,
          date: stay.checkInDate || stay.reatedAt,
          status: stay.paymentStatus === PaymentStatus.PAID ? 'completed' : 
                  stay.paymentStatus === PaymentStatus.REFUNDED ? 'refunded' :
                  stay.paymentStatus === PaymentStatus.CANCELLED ? 'cancelled' :
                  'pending',
          balance: (stay.totalAmount || 0) - (stay.paidAmount || 0),
          status_label: stay.status
        });
      });
    }
    
    // Convert orders to transactions
    if (orders && orders.length > 0) {
      orders.forEach(order => {
        const orderTotal = order.items.reduce((sum, item) => {
          return sum + (item.priceWhenOrdered * item.quantity);
        }, 0) - (order.discount || 0);
        
        // Create a descriptive name for the order
        const firstItemName = order.items[0]?.menuId?.itemName || 'Items';
        const itemsCount = order.items.length;
        const description = itemsCount === 1 
          ? firstItemName 
          : `${firstItemName} and ${itemsCount - 1} more`;
        
        allTransactions.push({
          id: order._id,
          type: order.orderType === OrderType.HOTEL_GUEST ? 'Room Service' : 
                order.orderType === OrderType.RESTAURANT ? 'Restaurant' : 
                'Order',
          category: 'order',
          description: description,
          amount: orderTotal,
          date: order.createdAt,
          status: order.status === OrderStatus.PAID ? 'completed' : 
                  order.status === OrderStatus.READY ? 'ready' : 
                  order.status === OrderStatus.CANCELLED ? 'cancelled' : 
                  'pending',
          balance: orderTotal,
          status_label: order.status
        });
      });
    }
    
    // Sort by date (most recent first) and take top 5
    return allTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [stays, orders]);

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

  // Calculate revenue from Redux state (using analytics slice) - NO MOCK DATA
  const revenues = useMemo(() => {
    // Room revenue from stays
    const roomsRevenue = stays.length > 0 ? stays.reduce((sum, stay) => sum + (stay.totalAmount || 0), 0) : 0;
    
    // F&B revenue from orders
    const fAndBRevenue = orders.length > 0 ? orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (item.priceWhenOrdered * item.quantity);
      }, 0);
      return sum + orderTotal - (order.discount || 0);
    }, 0) : 0;
    
    // Return only real data from Redux - no mock fallback
    return {
      rooms: roomsRevenue,
      f_and_b: fAndBRevenue,
      other: 0 // No "other" revenue source in analytics state
    };
  }, [stays, orders]);
  
  const totalRevenue = revenues.rooms + revenues.f_and_b + revenues.other;
  const totalOutstanding = openFolios.reduce((sum, folio) => sum + folio.balance, 0);

  // Calculate performance metrics from Redux state
  const performanceMetrics = useMemo(() => {
    if (stays.length === 0) {
      return {
        occupancyRate: 'No data',
        adr: 'No data',
        revpar: 'No data',
        totalBookings: 0
      };
    }

    // Calculate total room nights (assuming average stay is 1 night for simplicity)
    const totalRoomNights = stays.length;
    
    // Calculate ADR (Average Daily Rate)
    const totalRevenueForADR = stays.reduce((sum, stay) => sum + (stay.totalAmount || 0), 0);
    const adr = totalRoomNights > 0 ? (totalRevenueForADR / totalRoomNights) : 0;
    
    // For simplicity, assume 100 rooms available (this would come from room data)
    // For now, we'll show "Calculating..." since we don't have room inventory data
    const occupancyRate = 'Calculating...';
    
    // RevPAR would also need room count
    const revpar = 'Calculating...';
    
    return {
      occupancyRate,
      adr: adr.toFixed(2),
      revpar,
      totalBookings: stays.length
    };
  }, [stays]);

  const handleViewFolio = (folio: any) => {
    setSelectedFolio(folio);
    setShowFolioModal(true);
  };

  const handleDownloadFolio = (folio: any) => {
    // Create a CSV or JSON file with folio data
    const folioData = {
      folio_id: folio.folio_id,
      guest_name: folio.guest_name,
      room_number: folio.room_number,
      balance: folio.balance,
      charges: folio.charges,
      payments: folio.payments,
      status: folio.status
    };
    
    const blob = new Blob([JSON.stringify(folioData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `folio_${folio.folio_id.slice(-6)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    <div className="space-y-6">
      {/* Header */}
      <AccountingHeader
        onViewTransactions={() => setShowViewTransactionsModal(true)}
        onFinancialReports={() => setShowFinancialReportsModal(true)}
        onGenerateInvoice={() => setShowGenerateInvoiceModal(true)}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange || setSelectedPeriod}
        onApplyFilter={onRefetch}
        isLoading={externalIsLoading}
      />

      {/* Financial Overview Cards */}
      <FinancialOverviewCards
        totalRevenue={totalRevenue}
        totalOutstanding={totalOutstanding}
        roomsRevenue={revenues.rooms}
        fAndBRevenue={revenues.f_and_b}
        openFoliosCount={openFolios.length}
      />

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Outlet */}
        <RevenueBreakdown
          roomsRevenue={revenues.rooms}
          fAndBRevenue={revenues.f_and_b}
          otherRevenue={revenues.other}
          totalRevenue={totalRevenue}
        />

        {/* Recent Transactions */}
        <RecentTransactions folios={recentTransactions} />
        </div>

      {/* Open Folios */}
      <OpenFoliosTable 
        openFolios={openFolios}
        onViewFolio={handleViewFolio}
        onDownloadFolio={handleDownloadFolio}
      />

      {/* View Transactions Modal */}
      <ViewTransactionsModal
        isOpen={showViewTransactionsModal}
        onClose={() => setShowViewTransactionsModal(false)}
        totalRevenue={totalRevenue}
        totalOutstanding={totalOutstanding}
        transactions={recentTransactions}
      />

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
                        <span className="font-medium text-green-900">${revenues.rooms.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Food & Beverage</span>
                        <span className="font-medium text-green-900">${revenues.f_and_b.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Other Services</span>
                        <span className="font-medium text-green-900">${revenues.other.toLocaleString()}</span>
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
                        <span className="font-medium text-blue-900">
                          {performanceMetrics.occupancyRate}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">ADR (Average Daily Rate)</span>
                        <span className="font-medium text-blue-900">
                          ${performanceMetrics.adr}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">RevPAR</span>
                        <span className="font-medium text-blue-900">
                          {performanceMetrics.revpar}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Total Bookings</span>
                        <span className="font-medium text-blue-900">{performanceMetrics.totalBookings}</span>
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

        {/* Folio Details Modal */}
        {showFolioModal && selectedFolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Folio Details - {selectedFolio.guest_name}
                </h2>
                <button
                  onClick={() => setShowFolioModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Guest Info */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h3 className="font-semibold text-secondary-900 mb-3">Guest Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-secondary-600">Guest Name:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.guest_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Email:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.guest_email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Phone:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.guest_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Room:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.room_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-secondary-900 mb-3">Stay Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-secondary-600">Check-in:</span>
                      <p className="font-medium text-secondary-900">
                        {selectedFolio.check_in ? new Date(selectedFolio.check_in).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Check-out:</span>
                      <p className="font-medium text-secondary-900">
                        {selectedFolio.check_out ? new Date(selectedFolio.check_out).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Adults:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.adults || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Children:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.children || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Type:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.type || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedFolio.status === 'open' ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedFolio.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-secondary-900 mb-3">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-secondary-600">Total Amount:</span>
                      <p className="font-semibold text-secondary-900">${selectedFolio.total_amount?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Paid Amount:</span>
                      <p className="font-semibold text-green-900">${selectedFolio.paid_amount?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Balance:</span>
                      <p className="font-semibold text-orange-600">${selectedFolio.balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-secondary-600">Payment Method:</span>
                      <p className="font-medium text-secondary-900">{selectedFolio.payment_method || 'N/A'}</p>
                    </div>
                    {selectedFolio.payment_date && (
                      <div>
                        <span className="text-secondary-600">Payment Date:</span>
                        <p className="font-medium text-secondary-900">
                          {new Date(selectedFolio.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Charges */}
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-3">Charges</h3>
                  {selectedFolio.charges && selectedFolio.charges.length > 0 ? (
                    <div className="space-y-2">
                      {selectedFolio.charges.map((charge: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                          <div>
                            <p className="font-medium text-secondary-900">{charge.description}</p>
                            <p className="text-xs text-secondary-600">
                              {charge.posted_at ? new Date(charge.posted_at).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <p className="font-semibold text-secondary-900">${charge.amount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary-500">No charges recorded</p>
                  )}
                </div>

                {/* Payments */}
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-3">Payments</h3>
                  {selectedFolio.payments && selectedFolio.payments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedFolio.payments.map((payment: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-green-900">Payment ({payment.method})</p>
                            <p className="text-xs text-green-700">
                              {payment.processed_at ? new Date(payment.processed_at).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <p className="font-semibold text-green-900">${payment.amount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary-500">No payments recorded</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setShowFolioModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
