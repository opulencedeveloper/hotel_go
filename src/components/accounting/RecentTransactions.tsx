'use client';

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  balance?: number;
  status_label?: string;
}

interface RecentTransactionsProps {
  folios: Transaction[];
}

export default function RecentTransactions({ folios }: RecentTransactionsProps) {
  if (!folios || folios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 text-secondary-500">
            <p className="text-sm">No recent transactions available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-900">Recent Transactions</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {folios.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-secondary-900">{transaction.description}</p>
                <p className="text-sm text-secondary-600">
                  {transaction.type} • {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${(transaction.balance || 0) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  transaction.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                  transaction.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  transaction.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

