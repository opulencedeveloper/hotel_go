'use client';

import { useState } from 'react';
import { Package, TrendingUp, Users, BarChart3, History, List } from 'lucide-react';
import ItemUpload from '@/components/procurement/ItemUpload';
import InventoryList from '@/components/procurement/InventoryList';
import InventoryItemModal from '@/components/procurement/InventoryItemModal';
import InventoryCollection from '@/components/procurement/InventoryCollection';
import InventoryLogs from '@/components/procurement/InventoryLogs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { InventoryItem } from '@/store/redux/inventory-slice';
import { formatPrice } from '@/helper';

export default function ProcurementBody() {
  const inventory = useSelector((state: RootState) => state.inventory);
  const hotel = useSelector((state: RootState) => state.hotel);
  const { inventories, inventoryLogs } = inventory;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'inventory' | 'logs'>('inventory');

  // Calculate analytics from actual inventory data
  const totalItems = inventories?.length || 0;
  const availableItems = inventories?.filter(item => item.currentStock > 0).length || 0;
  const availableValue = inventories?.filter(item => item.currentStock > 0).reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0) || 0;
  const lowStockItems = inventories?.filter(item => item.currentStock < 10 && item.currentStock > 0).length || 0;
  const outOfStockItems = inventories?.filter(item => item.currentStock === 0).length || 0;

  const handleItemAdded = (item: any) => {
    // This will be handled by Redux when the API call succeeds
    console.log('Item added:', item);
  };

  const handleEditItem = (item: any) => {
    // TODO: Implement edit functionality
    console.log('Edit item:', item);
  };

  const handleDeleteItem = (itemId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete item:', itemId);
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowItemModal(false);
  };

  const handleCollectionSubmit = (collection: any) => {
    // TODO: Implement collection submission
    console.log('Collection submitted:', collection);
    // This would typically update inventory stock and create usage records
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">Hotel Item Management</h1>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                <span className="text-sm font-medium">Track Usage & Consumption</span>
              </div>
            </div>
            
            <p className="text-orange-100 text-lg mb-6">
              Manage hotel items, track usage by room/table/guest, and monitor consumption patterns.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <Package className="w-4 h-4" />
                <span className="text-orange-100">Item Tracking Active</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-orange-200">Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-orange-200">Available Value:</span>
                <span className="font-medium">${availableValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards - Available Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Available Items</p>
              <p className="text-2xl font-bold text-secondary-900">{availableItems}</p>
              <p className="text-sm text-blue-600">Items in stock</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Available Value</p>
              <p className="text-2xl font-bold text-secondary-900">{formatPrice(availableValue, selectedHotel?.currency)}</p>
              <p className="text-sm text-green-600">Value of stocked items</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Components */}
      <ItemUpload onItemAdded={handleItemAdded} />
      
      {/* Inventory Collection */}
      <InventoryCollection 
        inventories={inventories || []}
        onCollectionSubmit={handleCollectionSubmit}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span>Inventory Items</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Collection Logs</span>
                {inventoryLogs && inventoryLogs.length > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                    {inventoryLogs.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-0">
          {activeTab === 'inventory' && (
            <InventoryList 
              inventories={inventories || []}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onView={handleViewItem}
            />
          )}
          
          {activeTab === 'logs' && (
            <InventoryLogs logs={inventoryLogs || []} />
          )}
        </div>
      </div>

      {/* Item Details Modal */}
      <InventoryItemModal
        item={selectedItem}
        isOpen={showItemModal}
        onClose={handleCloseModal}
      />
      
    </div>
  );
}
