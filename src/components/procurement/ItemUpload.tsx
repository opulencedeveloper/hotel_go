"use client";

import { useState } from "react";
import { Plus, X, Package, CheckCircle } from "lucide-react";
import { InventoryCategory, InventoryUnit } from "@/utils/enum";
import { useHttp } from "@/hooks/useHttp";
import { useDispatch } from "react-redux";
import { inventoryActions } from "@/store/redux/inventory-slice";
import { inventoryCategories } from "@/resources/inventory";

interface HotelItem {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  cost_per_unit: number;
  supplier: string;
  location: string;
  current_stock: number;
}

interface ItemUploadProps {
  onItemAdded: (item: HotelItem) => void;
}

export default function ItemUpload({ onItemAdded }: ItemUploadProps) {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([
    {
      id: 1,
      name: "",
      category: "amenities",
      description: "",
      unit: "pieces",
      cost_per_unit: 0,
      supplier: "",
      location: "",
      current_stock: 0,
    },
  ]);
  const dispatch = useDispatch();

  // HTTP hook for adding inventory items
  const {
    isLoading: isAddingItems,
    sendHttpRequest: addItemsRequest,
    error: addItemsError,
  } = useHttp();


  const units = [
    InventoryUnit.PIECES,
    InventoryUnit.KG,
    InventoryUnit.LITERS,
    InventoryUnit.BOXES,
    InventoryUnit.ROLLS,
    InventoryUnit.BOTTLES,
    InventoryUnit.CANS,
    InventoryUnit.PACKS,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter valid items (items with names)
    const validItems = items.filter((item) => item.name.trim() !== "");

    if (validItems.length === 0) {
      return;
    }

    // Transform items to match API payload structure
    const payload = {
      items: validItems.map((item) => ({
        itemName: item.name,
        category: item.category,
        unit: item.unit,
        costPerUnit: item.cost_per_unit,
        supplier: item.supplier || undefined,
        storageLocation: item.location || undefined,
        currentStock: item.current_stock,
        description: item.description || undefined,
      })),
    };

    // Success handler
    const successHandler = (res: any) => {
      console.log("Items added successfully:", res.data);

      const resData = res?.data?.data;

      const addedItems = resData.addedItems;

      console.log("addedItems", addedItems)

      dispatch(inventoryActions.addInventoryItem(addedItems));

      // Call the onItemAdded callback for each item (for local state management)
      validItems.forEach((item) => {
        const newItem: HotelItem = {
          id: Date.now().toString() + Math.random().toString(),
          name: item.name,
          category: item.category,
          description: item.description,
          unit: item.unit,
          cost_per_unit: item.cost_per_unit,
          supplier: item.supplier,
          location: item.location,
          current_stock: item.current_stock,
        };
        onItemAdded(newItem);
      });

      // Reset form
      setItems([
        {
          id: 1,
          name: "",
          category: "amenities",
          description: "",
          unit: "pieces",
          cost_per_unit: 0,
          supplier: "",
          location: "",
          current_stock: 0,
        },
      ]);
      setShowForm(false);
    };

    // Make HTTP request
    addItemsRequest({
      successRes: successHandler,
      requestConfig: {
        url: "/hotel/add-inventory",
        method: "POST",
        body: payload,
        successMessage: `${validItems.length} item${
          validItems.length > 1 ? "s" : ""
        } added successfully`,
      },
    });
  };

  const addItemGroup = () => {
    const newId = Math.max(...items.map((item) => item.id)) + 1;
    setItems([
      ...items,
      {
        id: newId,
        name: "",
        category: "amenities",
        description: "",
        unit: "pieces",
        cost_per_unit: 0,
        supplier: "",
        location: "",
        current_stock: 0,
      },
    ]);
  };

  const removeItemGroup = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">
            Hotel Items Management
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Upload Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-secondary-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Manual Entry
              </h3>
            </div>
            <p className="text-secondary-600 mb-4">
              Add individual items one by one with detailed information.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Inventory Item
            </button>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showForm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Add Hotel Items
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {addItemsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 text-sm font-medium">
                      Error
                    </span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{addItemsError}</p>
                </div>
              )}

              {/* Multiple Items */}
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-secondary-200 rounded-lg p-6 bg-secondary-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Item {index + 1}
                      </h3>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemGroup(item.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Remove this item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Item Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Bath Towel, Coffee, Soap"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          value={item.category}
                          onChange={(e) =>
                            updateItem(item.id, "category", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {inventoryCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.icon} {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Unit *
                        </label>
                        <select
                          required
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(item.id, "unit", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {units.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Cost per Unit ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.cost_per_unit}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "cost_per_unit",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Supplier
                        </label>
                        <input
                          type="text"
                          value={item.supplier}
                          onChange={(e) =>
                            updateItem(item.id, "supplier", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Supplier name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Storage Location
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) =>
                            updateItem(item.id, "location", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Housekeeping Storage, Kitchen Pantry"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Current Stock *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={item.current_stock}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "current_stock",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Item description and specifications..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Items Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addItemGroup}
                  className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Item</span>
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingItems}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingItems ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding Items...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Add{" "}
                        {items.filter((item) => item.name.trim() !== "").length}{" "}
                        Item
                        {items.filter((item) => item.name.trim() !== "")
                          .length !== 1
                          ? "s"
                          : ""}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
