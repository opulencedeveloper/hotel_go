'use client';

import { useState } from 'react';
import FolioStats from '@/components/folio/FolioStats';
import FolioTable from '@/components/folio/FolioTable';
import Modal from '@/components/common/Modal';
import { 
  Search, 
  Plus, 
  Printer, 
  Mail,
  Download,
  X,
  Bed,
  Utensils,
  Heart,
  Calendar,
  CreditCard,
  DollarSign,
  Building2,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function FolioPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolio, setSelectedFolio] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);

  const folios = [
    {
      id: 'F001',
      guest: 'John Doe',
      room: '201',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      totalCharges: 450.00,
      totalPayments: 300.00,
      balance: 150.00,
      status: 'open',
      lastActivity: '2 hours ago'
    },
    {
      id: 'F002',
      guest: 'Jane Smith',
      room: '305',
      checkIn: '2024-01-16',
      checkOut: '2024-01-20',
      totalCharges: 680.00,
      totalPayments: 680.00,
      balance: 0.00,
      status: 'closed',
      lastActivity: '1 day ago'
    },
    {
      id: 'F003',
      guest: 'Bob Johnson',
      room: '108',
      checkIn: '2024-01-17',
      checkOut: '2024-01-19',
      totalCharges: 320.00,
      totalPayments: 200.00,
      balance: 120.00,
      status: 'open',
      lastActivity: '30 minutes ago'
    }
  ];


  const filteredFolios = folios.filter(folio =>
    folio.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    folio.room.includes(searchTerm) ||
    folio.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const folioStats = {
    totalFolios: folios.length,
    openFolios: folios.filter(f => f.status === 'open').length,
    totalOutstanding: folios.reduce((sum, f) => sum + f.balance, 0),
    totalCharges: folios.reduce((sum, f) => sum + f.totalCharges, 0)
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Payment Management</h1>
            <p className="text-secondary-600">Centralized payment processing for all hotel services</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button 
              onClick={() => setShowChargeModal(true)}
              className="btn-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Charge
            </button>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Process Payment
            </button>
          </div>
        </div>

        {/* Stats */}
        <FolioStats 
          totalFolios={folioStats.totalFolios}
          openFolios={folioStats.openFolios}
          totalOutstanding={folioStats.totalOutstanding}
          totalCharges={folioStats.totalCharges}
        />

        {/* Service Payment Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Room Payments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Bed className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600">Room Revenue</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Today's Revenue</span>
                <span className="text-sm font-medium text-secondary-900">$2,450.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Pending Payments</span>
                <span className="text-sm font-medium text-orange-600">$850.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Occupancy Rate</span>
                <span className="text-sm font-medium text-green-600">78%</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View Room Payments
            </button>
          </div>

          {/* Restaurant Payments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">F&B Revenue</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Today's Revenue</span>
                <span className="text-sm font-medium text-secondary-900">$1,280.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Pending Orders</span>
                <span className="text-sm font-medium text-orange-600">$245.75</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Avg Order Value</span>
                <span className="text-sm font-medium text-green-600">$32.50</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
              View F&B Payments
            </button>
          </div>

          {/* Spa & Wellness Payments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600">Spa & Wellness</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Today's Revenue</span>
                <span className="text-sm font-medium text-secondary-900">$890.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Booked Services</span>
                <span className="text-sm font-medium text-orange-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Avg Service Value</span>
                <span className="text-sm font-medium text-green-600">$74.17</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
              View Spa Payments
            </button>
          </div>

          {/* Event & Conference Payments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-orange-600">Events & Conferences</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Today's Revenue</span>
                <span className="text-sm font-medium text-secondary-900">$3,200.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Active Events</span>
                <span className="text-sm font-medium text-orange-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Avg Event Value</span>
                <span className="text-sm font-medium text-green-600">$1,066.67</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
              View Event Payments
            </button>
          </div>
        </div>

        {/* Payment Methods Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Payment Methods Today</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-secondary-900">Credit Card</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-secondary-900">$4,850.25</div>
                  <div className="text-sm text-secondary-600">68% of total</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-secondary-900">Cash</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-secondary-900">$1,280.00</div>
                  <div className="text-sm text-secondary-600">18% of total</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-secondary-900">Bank Transfer</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-secondary-900">$980.50</div>
                  <div className="text-sm text-secondary-600">14% of total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">Room 205 - John Doe</div>
                    <div className="text-sm text-secondary-600">Credit Card • 2 min ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">+$450.00</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">Restaurant - Table 12</div>
                    <div className="text-sm text-secondary-600">Cash • 15 min ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">+$89.50</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">Spa Treatment - Jane Smith</div>
                    <div className="text-sm text-secondary-600">Credit Card • 32 min ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">+$150.00</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">Conference Room A</div>
                    <div className="text-sm text-secondary-600">Pending • 1 hour ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-orange-600">$1,200.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by guest name, room, or folio ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="input">
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
              <button className="btn-secondary">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Folios Table */}
        <FolioTable 
          folios={filteredFolios}
          onViewFolio={setSelectedFolio}
        />

        {/* Folio Details Modal */}
        {selectedFolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Folio Details - {selectedFolio.id}</h3>
                <button
                  onClick={() => setSelectedFolio(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Guest Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h4 className="font-medium text-secondary-900 mb-3">Guest Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-secondary-600">Name: {selectedFolio.guest}</p>
                      <p className="text-sm text-secondary-600">Room: {selectedFolio.room}</p>
                      <p className="text-sm text-secondary-600">
                        Stay: {new Date(selectedFolio.checkIn).toLocaleDateString()} - {new Date(selectedFolio.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="card">
                    <h4 className="font-medium text-secondary-900 mb-3">Financial Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary-600">Total Charges:</span>
                        <span className="text-sm font-medium text-secondary-900">${selectedFolio.totalCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary-600">Total Payments:</span>
                        <span className="text-sm font-medium text-secondary-900">${selectedFolio.totalPayments.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-secondary-900">Balance:</span>
                        <span className={`text-sm font-bold ${
                          selectedFolio.balance > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ${selectedFolio.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itemized Charges */}
                <div className="card">
                  <h4 className="font-medium text-secondary-900 mb-3">Itemized Charges</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Room Rate - 3 nights</p>
                        <p className="text-xs text-secondary-600">Jan 15-18, 2024</p>
                      </div>
                      <span className="text-sm font-medium text-secondary-900">$300.00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Restaurant - Dinner</p>
                        <p className="text-xs text-secondary-600">Jan 16, 2024</p>
                      </div>
                      <span className="text-sm font-medium text-secondary-900">$45.50</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Mini Bar</p>
                        <p className="text-xs text-secondary-600">Jan 17, 2024</p>
                      </div>
                      <span className="text-sm font-medium text-secondary-900">$28.75</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Tax</p>
                        <p className="text-xs text-secondary-600">8.5%</p>
                      </div>
                      <span className="text-sm font-medium text-secondary-900">$31.75</span>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="card">
                  <h4 className="font-medium text-secondary-900 mb-3">Payment History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Credit Card Payment</p>
                        <p className="text-xs text-secondary-600">Jan 15, 2024 - 2:30 PM</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">$200.00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Cash Payment</p>
                        <p className="text-xs text-secondary-600">Jan 16, 2024 - 10:15 AM</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">$100.00</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                  <button className="btn-secondary">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Invoice
                  </button>
                  <button className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-secondary-900">Process Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Service Type *
                    </label>
                    <select className="input" required>
                      <option value="">Select service</option>
                      <option value="room">Room & Accommodation</option>
                      <option value="restaurant">Restaurant & F&B</option>
                      <option value="spa">Spa & Wellness</option>
                      <option value="event">Events & Conferences</option>
                      <option value="retail">Retail & Gift Shop</option>
                      <option value="transport">Transportation</option>
                      <option value="other">Other Services</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Customer/Guest *
                    </label>
                    <input type="text" className="input" placeholder="Enter customer name" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room/Table/Service ID
                    </label>
                    <input type="text" className="input" placeholder="e.g., Room 205, Table 12" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Payment Amount *
                    </label>
                    <input type="number" step="0.01" className="input" placeholder="0.00" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Payment Method *
                    </label>
                    <select className="input" required>
                      <option value="">Select method</option>
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="check">Check</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_payment">Mobile Payment</option>
                      <option value="cryptocurrency">Cryptocurrency</option>
                      <option value="voucher">Voucher/Coupon</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Currency
                    </label>
                    <select className="input">
                      <option value="USD">🇺🇸 USD</option>
                      <option value="EUR">🇪🇺 EUR</option>
                      <option value="GBP">🇬🇧 GBP</option>
                      <option value="JPY">🇯🇵 JPY</option>
                      <option value="CAD">🇨🇦 CAD</option>
                      <option value="AUD">🇦🇺 AUD</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Service Description
                  </label>
                  <textarea className="input" rows={3} placeholder="Describe the service or items purchased..."></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Staff Member
                    </label>
                    <input type="text" className="input" placeholder="Staff member processing payment" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Reference/Transaction ID
                    </label>
                    <input type="text" className="input" placeholder="Payment reference or transaction ID" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea className="input" rows={2} placeholder="Any additional notes or special instructions..."></textarea>
                </div>
                
                {/* Payment Summary */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Service Type:</span>
                      <span className="font-medium text-secondary-900">Selected service</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Amount:</span>
                      <span className="font-medium text-secondary-900">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Payment Method:</span>
                      <span className="font-medium text-secondary-900">Selected method</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium text-secondary-900">Total:</span>
                      <span className="font-bold text-secondary-900">$0.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Process Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Charge Modal */}
        {showChargeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Add Charge</h3>
                <button
                  onClick={() => setShowChargeModal(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Folio ID
                  </label>
                  <input type="text" className="input" placeholder="Enter folio ID" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Description
                  </label>
                  <input type="text" className="input" placeholder="Charge description" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Amount
                  </label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Category
                  </label>
                  <select className="input">
                    <option value="">Select category</option>
                    <option value="room">Room Service</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="spa">Spa</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChargeModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Charge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    
  );
}
