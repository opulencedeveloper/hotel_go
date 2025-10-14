'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import FolioStats from '@/components/folio/FolioStats';
import FolioTable from '@/components/folio/FolioTable';
import Modal from '@/components/common/Modal';
import { 
  Search, 
  Plus, 
  Printer, 
  Mail,
  Download,
  X
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
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Folio & Payments</h1>
            <p className="text-secondary-600">Manage guest financials, payments, and invoices</p>
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
              Record Payment
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Record Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
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
                    Payment Amount
                  </label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Payment Method
                  </label>
                  <select className="input">
                    <option value="">Select method</option>
                    <option value="cash">Cash</option>
                    <option value="card">Credit Card</option>
                    <option value="check">Check</option>
                    <option value="transfer">Bank Transfer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Reference/Notes
                  </label>
                  <textarea className="input" rows={3} placeholder="Payment reference or notes..."></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
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
                    Record Payment
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
    </Layout>
  );
}
