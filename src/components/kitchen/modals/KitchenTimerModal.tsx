'use client';

import { useState } from 'react';
import { X, Timer } from 'lucide-react';

interface KitchenTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: KitchenTimerData) => void;
}

interface KitchenTimerData {
  order_id: string;
  item_name: string;
  estimated_time: number;
  start_time: string;
  notes: string;
}

export default function KitchenTimerModal({ isOpen, onClose, onSubmit }: KitchenTimerModalProps) {
  const [kitchenTimer, setKitchenTimer] = useState<KitchenTimerData>({
    order_id: '',
    item_name: '',
    estimated_time: 15,
    start_time: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(kitchenTimer);
    setKitchenTimer({
      order_id: '',
      item_name: '',
      estimated_time: 15,
      start_time: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Kitchen Timer</h2>
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
                Order ID
              </label>
              <input
                type="text"
                value={kitchenTimer.order_id}
                onChange={(e) => setKitchenTimer({...kitchenTimer, order_id: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Order number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={kitchenTimer.item_name}
                onChange={(e) => setKitchenTimer({...kitchenTimer, item_name: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Dish name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={kitchenTimer.estimated_time}
                onChange={(e) => setKitchenTimer({...kitchenTimer, estimated_time: parseInt(e.target.value) || 15})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={kitchenTimer.start_time}
                onChange={(e) => setKitchenTimer({...kitchenTimer, start_time: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes
              </label>
              <textarea
                value={kitchenTimer.notes}
                onChange={(e) => setKitchenTimer({...kitchenTimer, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Special instructions..."
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
              <Timer className="w-4 h-4 mr-2" />
              Start Timer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
