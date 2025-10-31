'use client';

import { useEffect, useState } from 'react';
import { X, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { MenuStatus } from '@/utils/enum';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner';
import { menuActions } from '@/store/redux/menu-slice';
import { useHttp } from '@/hooks/useHttp';

interface MenuListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditMenu?: (menuItem: any) => void;
  onDeleteMenu?: (menuId: string) => void;
  onAddNew?: () => void;
}

export default function MenuListModal({
  isOpen,
  onClose,
  onEditMenu,
  onDeleteMenu,
  onAddNew
}: MenuListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');


   const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    sendHttpRequest: fetchUserAndHotelInfoReq,
  } = useHttp();
  const menu = useSelector((state: RootState) => state.menu);
  const { fetchedData, menus } = menu;

  useEffect(() => {
    setMounted(true);

    if (fetchedData) return;

    const onFetchUserAndHotelInfoReq = (res: any) => {
      const resData = res?.data?.data;
      const menus = resData?.menus;

      console.log("menus", menus);

      dispatch(menuActions.setMenus(menus));
    };

    fetchUserAndHotelInfoReq({
      successRes: onFetchUserAndHotelInfoReq,
      requestConfig: {
        url: "/hotel/get-menus",
        method: "GET",
      },
    });
  }, [dispatch, fetchedData]);

  if (isLoading || !mounted) {
    return<div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"> <PageLoadingSpinner /></div>;
  }

  if (error) {
    const handleRetry = () => {
      if (fetchedData) return;

      const onFetchUserAndHotelInfoReq = (res: any) => {
        const resData = res?.data?.data;
        const menus = resData?.menus;

        console.log("menus", menus);

        dispatch(menuActions.setMenus(menus));
      };

      fetchUserAndHotelInfoReq({
        successRes: onFetchUserAndHotelInfoReq,
        requestConfig: {
          url: "/hotel/get-menus",
          method: "GET",
        },
      });
    };

    return (
       <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="max-w-md w-full">
          <ErrorDisplay
            error={error}
            title="Failed to load dashboard"
            description="We couldn't load your dashboard information. This might be due to a network issue or server problem."
            onRetry={handleRetry}
            showRetry={true}
            size="large"
            variant="error"
          />
        </div>
      </div>
    );
  }

  // Filter menus based on search and filters
  const filteredMenus = menus?.filter((menuItem: any) => {
    const matchesSearch = menuItem.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menuItem.ingredients.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || menuItem.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || menuItem.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
      case 'Unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
      case 'appetizer':
      case 'main_course':
      case 'dessert':
        return '🍽️';
      case 'beverage':
      case 'drink':
        return '🥤';
      case 'service':
        return '⚙️';
      default:
        return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Menu Management</h2>
            <p className="text-secondary-600">View and manage all menu items</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onAddNew}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-secondary-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="appetizer">Appetizer</option>
              <option value="main_course">Main Course</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
              <option value="service">Service</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-secondary-600">
              <Filter className="w-4 h-4 mr-2" />
              {filteredMenus.length} item{filteredMenus.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="p-6">
          {filteredMenus.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">No menu items found</h3>
              <p className="text-secondary-600 mb-4">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first menu item'
                }
              </p>
              {(!searchTerm && categoryFilter === 'all' && statusFilter === 'all') && (
                <button
                  onClick={onAddNew}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Menu Item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenus.map((menuItem: any) => (
                <div key={menuItem._id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getCategoryIcon(menuItem.category)}</span>
                      <div>
                        <h3 className="font-semibold text-secondary-900">{menuItem.itemName}</h3>
                        <p className="text-sm text-secondary-600 capitalize">{menuItem.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">${menuItem.price}</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(menuItem.status)}`}>
                        {menuItem.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <span className="font-medium">Prep Time:</span>
                      <span className="ml-2">{menuItem.prepTime} min</span>
                    </div>
                    {menuItem.ingredients && (
                      <div className="text-sm text-secondary-600">
                        <span className="font-medium">Ingredients:</span>
                        <p className="mt-1 text-xs line-clamp-2">{menuItem.ingredients}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditMenu?.(menuItem)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteMenu?.(menuItem._id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
