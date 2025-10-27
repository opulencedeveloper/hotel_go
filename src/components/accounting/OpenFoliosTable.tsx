'use client';

import { Plus, Eye, Download } from 'lucide-react';

interface Folio {
  folio_id: string;
  booking_id: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_address?: string;
  room_number?: string;
  room_id?: string;
  type?: string;
  check_in?: string;
  check_out?: string;
  adults?: number;
  children?: number;
  total_amount?: number;
  paid_amount?: number;
  charges: any[];
  payments: any[];
  balance: number;
  status: string;
  payment_status?: string;
  payment_method?: string;
  payment_date?: string;
}

interface OpenFoliosTableProps {
  openFolios: Folio[];
  onNewFolio?: () => void;
  onViewFolio?: (folio: Folio) => void;
  onDownloadFolio?: (folio: Folio) => void;
}

export default function OpenFoliosTable({ openFolios, onNewFolio, onViewFolio, onDownloadFolio }: OpenFoliosTableProps) {
  if (!openFolios || openFolios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary-900">Open Folios</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 text-secondary-500">
            <p className="text-sm">No open folios available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Open Folios</h2>
          {/* <button 
            onClick={onNewFolio}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Folio</span>
          </button> */}
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Guest</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Room</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Charges</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Payments</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {openFolios.map((folio) => (
                <tr key={folio.folio_id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-3 px-4 font-medium text-secondary-900">{folio.guest_name || 'N/A'}</td>
                  <td className="py-3 px-4 text-secondary-600">{folio.room_number || 'N/A'}</td>
                  <td className="py-3 px-4 text-secondary-600">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {folio.type || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary-600">{folio.charges.length}</td>
                  <td className="py-3 px-4 text-secondary-600">{folio.payments.length}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      {folio.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onViewFolio && onViewFolio(folio)}
                        className="p-1 text-secondary-400 hover:text-secondary-600"
                      >
                        <Eye className="w-4 h-4" />
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
  );
}

