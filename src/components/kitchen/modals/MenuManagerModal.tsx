"use client";

import React, { useState } from "react";
import { X, ChefHat } from "lucide-react";
import { menuCategories } from "@/resources/hotel-service";
import { useHttp } from "@/hooks/useHttp";
import { MenuStatus } from "@/utils/enum";
import { useDispatch } from "react-redux";
import { menuActions } from "@/store/redux/menu-slice";

interface MenuManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editItem?: any; // Menu item to edit (if editing)
  isEditing?: boolean;
}

interface MenuManagerData {
  itemName: string;
  category: string;
  price: number;
  prepTime: number;
  ingredients: string;
  status: MenuStatus;
}

export default function MenuManagerModal({
  isOpen,
  onClose,
  onSuccess,
  editItem,
  isEditing = false,
}: MenuManagerModalProps) {
  const [menuManager, setMenuManager] = useState<MenuManagerData>({
    itemName: "",
    category: "appetizer",
    price: 0,
    prepTime: 15,
    ingredients: "",
    status: MenuStatus.Available,
  });
  const dispatch = useDispatch();

  // Update form when editing
  React.useEffect(() => {
    if (isEditing && editItem) {
      setMenuManager({
        itemName: editItem.itemName || "",
        category: editItem.category || "appetizer",
        price: editItem.price || 0,
        prepTime: editItem.prepTime || 15,
        ingredients: editItem.ingredients || "",
        status: editItem.status || MenuStatus.Available,
      });
    } else {
      // Reset form for new item
      setMenuManager({
        itemName: "",
        category: "appetizer",
        price: 0,
        prepTime: 15,
        ingredients: "",
        status: MenuStatus.Available,
      });
    }
  }, [isEditing, editItem]);

  // HTTP hook for menu operations
  const { isLoading, sendHttpRequest: menuRequest, error } = useHttp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const onSuccessHandler = (res: any) => {
      console.log(
        `Menu item ${isEditing ? "updated" : "created"} successfully:`,
        res.data
      );
      const resData = res?.data?.data;

      if (!isEditing) {
        const newMenu = resData.newMenu;

        dispatch(menuActions.addMenu(newMenu));
      } else {
        const updatedMenu = resData.updatedMenu;
        dispatch(menuActions.updateMenu(updatedMenu));
      }

      setMenuManager({
        itemName: "",
        category: "appetizer",
        price: 0,
        prepTime: 15,
        ingredients: "",
        status: MenuStatus.Available,
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    };

    // Prepare request data
    const requestData = isEditing ? { ...menuManager } : menuManager;

    menuRequest({
      successRes: onSuccessHandler,
      requestConfig: {
        url: isEditing
          ? `/hotel/update-menu?menuId=${editItem._id}`
          : "/hotel/create-menu",
        method: isEditing ? "PUT" : "POST",
        body: requestData,
        successMessage: isEditing
          ? "Menu item updated successfully"
          : "Menu item created successfully",
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-secondary-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 border-b border-secondary-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ChefHat className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
                </h2>
                <p className="text-sm text-secondary-600">
                  {isEditing ? "Update menu item details" : "Create a new menu item for your restaurant"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 text-secondary-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-secondary-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-800 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={menuManager.itemName}
                onChange={(e) =>
                  setMenuManager({ ...menuManager, itemName: e.target.value })
                }
                className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Enter dish name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-800 mb-2">
                Category
              </label>
              <select
                value={menuManager.category}
                onChange={(e) =>
                  setMenuManager({ ...menuManager, category: e.target.value })
                }
                className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                {menuCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-800 mb-2">
                Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={menuManager.price}
                  onChange={(e) =>
                    setMenuManager({
                      ...menuManager,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="input pl-8 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-800 mb-2">
                Prep Time (minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={menuManager.prepTime}
                  onChange={(e) =>
                    setMenuManager({
                      ...menuManager,
                      prepTime: parseInt(e.target.value) || 15,
                    })
                  }
                  className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="15"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 text-sm">min</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-800 mb-2">
                Status
              </label>
              <select
                value={menuManager.status}
                onChange={(e) =>
                  setMenuManager({
                    ...menuManager,
                    status: e.target.value as MenuStatus,
                  })
                }
                className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value={MenuStatus.Available}>Available</option>
                <option value={MenuStatus.Unavailable}>Unavailable</option>
              </select>
            </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-secondary-400 rounded-full"></div>
              <h3 className="text-lg font-semibold text-secondary-900">Additional Details</h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-800 mb-2">
                Ingredients
              </label>
              <textarea
                value={menuManager.ingredients}
                onChange={(e) =>
                  setMenuManager({
                    ...menuManager,
                    ingredients: e.target.value,
                  })
                }
                rows={4}
                className="input resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="List ingredients separated by commas..."
              />
              <p className="text-xs text-secondary-500 mt-1">Separate multiple ingredients with commas</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-secondary-50 -mx-6 -mb-6 px-6 py-4 border-t border-secondary-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 text-secondary-600 hover:text-secondary-800 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center px-6 py-2 font-medium"
              >
                <ChefHat className="w-4 h-4 mr-2" />
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Menu Item"
                  : "Save Menu Item"}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
