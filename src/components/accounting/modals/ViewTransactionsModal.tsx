'use client';

import { X, TrendingUp, Receipt, DollarSign, Calculator } from 'lucide-react';
import { formatPrice } from '@/helper';

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  balance?: number;
}

interface ViewTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalRevenue: number;
  totalOutstanding: number;
  transactions?: Transaction[];
  currency: string;
}

export default function ViewTransactionsModal({ 
  isOpen, 
  onClose, 
  totalRevenue, 
  totalOutstanding,
  transactions = [],
  currency
}: ViewTransactionsModalProps) {
  if (!isOpen) return null;
  
  const transactionCount = transactions.length || 0;
  const averageTransaction = transactionCount > 0 ? (totalRevenue / transactionCount) : 0;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Transaction History</h2>
          <button
            onClick={onClose}
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
              <p className="text-2xl font-bold text-green-900">{formatPrice(totalRevenue, currency)}</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Transactions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{transactionCount.toLocaleString()}</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Outstanding</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{formatPrice(totalOutstanding, currency)}</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Avg. Transaction</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{formatPrice(averageTransaction, currency)}</p>
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
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-secondary-100">
                        <td className="py-3 px-4 text-sm text-secondary-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-900">{transaction.type}</td>
                        <td className="py-3 px-4 text-sm text-secondary-900">{transaction.description}</td>
                        <td className={`py-3 px-4 text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPrice(Math.abs(transaction.amount), currency)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            transaction.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            transaction.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-secondary-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

