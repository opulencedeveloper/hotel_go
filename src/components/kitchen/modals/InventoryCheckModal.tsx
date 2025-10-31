'use client';

import { useState } from 'react';
import { X, Utensils } from 'lucide-react';

interface InventoryCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InventoryCheckData) => void;
}

interface InventoryCheckData {
  item_name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  expiry_date: string;
  supplier: string;
  notes: string;
}

export default function InventoryCheckModal({ isOpen, onClose, onSubmit }: InventoryCheckModalProps) {
  const [inventoryCheck, setInventoryCheck] = useState<InventoryCheckData>({
    item_name: '',
    current_stock: 0,
    minimum_stock: 0,
    unit: 'pieces',
    expiry_date: '',
    supplier: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inventoryCheck);
    setInventoryCheck({
      item_name: '',
      current_stock: 0,
      minimum_stock: 0,
      unit: 'pieces',
      expiry_date: '',
      supplier: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Inventory Check</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={inventoryCheck.item_name}
                onChange={(e) => setInventoryCheck({...inventoryCheck, item_name: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter item name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Unit
              </label>
              <select
                value={inventoryCheck.unit}
                onChange={(e) => setInventoryCheck({...inventoryCheck, unit: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pieces">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="lbs">Pounds</option>
                <option value="liters">Liters</option>
                <option value="gallons">Gallons</option>
                <option value="boxes">Boxes</option>
                <option value="cases">Cases</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Current Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={inventoryCheck.current_stock}
                onChange={(e) => setInventoryCheck({...inventoryCheck, current_stock: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Minimum Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={inventoryCheck.minimum_stock}
                onChange={(e) => setInventoryCheck({...inventoryCheck, minimum_stock: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={inventoryCheck.expiry_date}
                onChange={(e) => setInventoryCheck({...inventoryCheck, expiry_date: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={inventoryCheck.supplier}
                onChange={(e) => setInventoryCheck({...inventoryCheck, supplier: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Supplier name"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes
              </label>
              <textarea
                value={inventoryCheck.notes}
                onChange={(e) => setInventoryCheck({...inventoryCheck, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional notes about the inventory item..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Utensils className="w-4 h-4 mr-2" />
              Update Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
