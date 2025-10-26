'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { InventoryItem } from '@/store/redux/inventory-slice';
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface InventoryListProps {
  inventories: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (itemId: string) => void;
  onView?: (item: InventoryItem) => void;
}

export default function InventoryList({ 
  inventories, 
  onEdit, 
  onDelete, 
  onView 
}: InventoryListProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and sort inventories
  const filteredInventories = inventories
    .filter(item => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'low' && item.currentStock < 10) ||
                          (stockFilter === 'out' && item.currentStock === 0) ||
                          (stockFilter === 'in-stock' && item.currentStock > 0);
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.itemName.localeCompare(b.itemName);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'stock':
          comparison = a.currentStock - b.currentStock;
          break;
        case 'cost':
          comparison = a.costPerUnit - b.costPerUnit;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const categories = [
    'all', 'amenities', 'linen', 'food', 'beverage', 
    'cleaning', 'kitchen', 'office', 'maintenance'
  ];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'text-red-600', bg: 'bg-red-50', icon: X };
    if (stock < 10) return { status: 'low', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertTriangle };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      {/* Header */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Inventory Items</h2>
            <p className="text-secondary-600 text-sm">
              {filteredInventories.length} of {inventories.length} items
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="stock">Sort by Stock</option>
            <option value="cost">Sort by Cost</option>
            <option value="date">Sort by Date</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex items-center justify-center space-x-2"
          >
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      {/* Inventory List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {filteredInventories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-secondary-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                  <p className="text-lg font-medium">No inventory items found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              filteredInventories.map((item) => {
                const stockStatus = getStockStatus(item.currentStock);
                const StatusIcon = stockStatus.icon;
                
                return (
                  <tr key={item._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {item.itemName}
                          </div>
                          {item.description && (
                            <div className="text-sm text-secondary-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          )}
                          {item.supplier && (
                            <div className="text-xs text-secondary-400 flex items-center mt-1">
                              <User className="w-3 h-3 mr-1" />
                              {item.supplier}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className={`w-4 h-4 mr-2 ${stockStatus.color}`} />
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {formatPrice(item.costPerUnit, selectedHotel?.currency)}
                      </div>
                      <div className="text-xs text-secondary-500">
                        per {item.unit}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-secondary-400" />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {/* {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded"
                            title="Edit item"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )} */}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {filteredInventories.length > 0 && (
        <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-secondary-600">In Stock:</span>
              <span className="font-medium">
                {filteredInventories.filter(item => item.currentStock > 0).length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-secondary-600">Low Stock:</span>
              <span className="font-medium">
                {filteredInventories.filter(item => item.currentStock < 10 && item.currentStock > 0).length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <X className="w-4 h-4 text-red-600" />
              <span className="text-secondary-600">Out of Stock:</span>
              <span className="font-medium">
                {filteredInventories.filter(item => item.currentStock === 0).length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-secondary-600">Total Value:</span>
              <span className="font-medium">
                {formatPrice(filteredInventories.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0), selectedHotel?.currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
