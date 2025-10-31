"use client";

import { useState } from "react";
import {
  User,
  Package,
  Bed,
  Utensils,
  ShoppingBag,
  Plus,
  Minus,
  X,
  CheckCircle,
  AlertTriangle,
  Search,
} from "lucide-react";
import { inventoryActions, InventoryItem } from "@/store/redux/inventory-slice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/useHttp";
import { formatPrice } from "@/helper";
import { staffActions } from "@/store/redux/staff-slice";
import { InventoryDestination } from "@/utils/enum";

interface InventoryCollectionProps {
  inventories: InventoryItem[];
  onCollectionSubmit?: (collection: any) => void;
}

interface CollectionItem {
  item: InventoryItem;
  quantity: number;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export default function InventoryCollection({
  inventories,
  onCollectionSubmit,
}: InventoryCollectionProps) {
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [guestType, setGuestType] = useState<InventoryDestination>(
    InventoryDestination.HOTEL_GUEST
  );
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  // HTTP hook for fetching staff
  const {
    isLoading: isLoadingStaff,
    sendHttpRequest: fetchStaffRequest,
    error: fetchStaffError,
  } = useHttp();

  // HTTP hook for submitting collection
  const {
    isLoading: isSubmittingCollection,
    sendHttpRequest: submitCollectionRequest,
    error: submitCollectionError,
  } = useHttp();

  // Get staff from Redux
  const staffState = useSelector((state: RootState) => state.staff);
  const hotel = useSelector((state: RootState) => state.hotel);
  const { staffs: allStaff, fetchedData: staffFetchedData } = staffState || {
    staffs: [],
    fetchedData: false,
  };
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  // Filter for active staff
  const staff =
    allStaff?.filter(
      (member: any) => member.status === "active" || member.isActive === true
    ) || [];

  // Filter available inventory items (in stock)
  const availableItems = inventories.filter((item) => item.currentStock > 0);

  // Filter items based on search
  const filteredItems = availableItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch staff function
  const handleFetchStaff = () => {
    const successHandler = (res: any) => {
      const resData = res?.data?.data;
      const staffs = resData?.staffs;

      console.log("staffs", staffs);

      dispatch(staffActions.setStaffs(staffs));
    };

    fetchStaffRequest({
      successRes: successHandler,
      requestConfig: {
        url: "/hotel/get-staffs",
        method: "GET",
        successMessage: "Staff loaded successfully",
      },
    });
  };

  const handleAddItem = (item: InventoryItem) => {
    const existingItem = collectionItems.find((ci) => ci.item._id === item._id);

    // Calculate available stock (original stock minus already collected)
    const alreadyCollected = existingItem ? existingItem.quantity : 0;
    const availableStock = item.currentStock - alreadyCollected;

    if (availableStock <= 0) {
      return; // No more items available
    }

    if (existingItem) {
      setCollectionItems((prev) =>
        prev.map((ci) =>
          ci.item._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
    } else {
      setCollectionItems((prev) => [...prev, { item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCollectionItems((prev) => prev.filter((ci) => ci.item._id !== itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = availableItems.find((i) => i._id === itemId);
    if (item) {
      // Calculate available stock (original stock minus already collected)
      const existingItem = collectionItems.find((ci) => ci.item._id === itemId);
      const alreadyCollected = existingItem ? existingItem.quantity : 0;
      const availableStock = item.currentStock - alreadyCollected;

      // Ensure quantity doesn't exceed available stock
      const maxQuantity = item.currentStock;
      const newQuantity = Math.min(Math.max(quantity, 0), maxQuantity);

      // If quantity is 0, remove the item from collection
      if (newQuantity === 0) {
        setCollectionItems((prev) =>
          prev.filter((ci) => ci.item._id !== itemId)
        );
      } else {
        setCollectionItems((prev) =>
          prev.map((ci) =>
            ci.item._id === itemId ? { ...ci, quantity: newQuantity } : ci
          )
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStaff || collectionItems.length === 0) {
      return;
    }

    // Validate required fields based on destination
    if (guestType === InventoryDestination.HOTEL_GUEST && !roomNumber) {
      return;
    }
    if (guestType === InventoryDestination.RESTAURANT && !tableNumber) {
      return;
    }
    if (guestType === InventoryDestination.WALK_IN && !roomNumber) {
      return;
    }

    // Prepare payload according to API specification
    const payload = {
      staffId: selectedStaff.id,
      destination: guestType,
      tableNumber:
        guestType === InventoryDestination.RESTAURANT ? tableNumber : undefined,
      roomNumber:
        guestType === InventoryDestination.HOTEL_GUEST
          ? roomNumber
          : guestType === InventoryDestination.WALK_IN
          ? ""
          : "",
      guestName:
        guestType === InventoryDestination.WALK_IN ? roomNumber : undefined,
      inventories: collectionItems.map((item) => ({
        inventoryId: item.item._id,
        quantity: item.quantity,
      })),
      notes: notes || undefined,
    };

    // Success handler
    const successHandler = (res: any) => {
      console.log("Collection submitted successfully:", res.data);
      const resData = res?.data?.data;

      const inventoryLog = resData.inventoryLog;

      console.log("collectionItems", collectionItems);

      const inventoryToUpdate = collectionItems.map((entry) => ({
        inventoryId: entry.item._id,
        quantity: entry.quantity,
      }));
      dispatch(inventoryActions.reduceInventoryQuantity(inventoryToUpdate));
      dispatch(inventoryActions.addInventoryLog(inventoryLog));

      // Call the callback for local state management
      const collection = {
        staff: selectedStaff,
        items: collectionItems,
        roomNumber:
          guestType === InventoryDestination.HOTEL_GUEST ? roomNumber : null,
        tableNumber:
          guestType === InventoryDestination.RESTAURANT ? tableNumber : null,
        guestType,
        notes,
        timestamp: new Date().toISOString(),
      };
      onCollectionSubmit?.(collection);

      // Reset form
      setSelectedStaff(null);
      setCollectionItems([]);
      setRoomNumber("");
      setTableNumber("");
      setNotes("");
      setShowCollectionForm(false);
    };

    // Make HTTP request
    submitCollectionRequest({
      successRes: successHandler,
      requestConfig: {
        url: "/hotel/add-inventory-logs",
        method: "POST",
        body: payload,
        successMessage: "Collection submitted successfully",
      },
    });
  };

  const totalItems = collectionItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalValue = collectionItems.reduce(
    (sum, item) => sum + item.quantity * item.item.costPerUnit,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      {/* Header */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Inventory Collection
            </h2>
            <p className="text-secondary-600 text-sm">
              Staff can collect items for rooms, guests, or restaurant
            </p>
          </div>
          <button
            onClick={() => setShowCollectionForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Collect Items</span>
          </button>
        </div>
      </div>

      {/* Collection Form Modal */}
      {showCollectionForm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-secondary-200">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  Collect Inventory Items
                </h2>
                <p className="text-secondary-600">
                  Select staff, items, and destination
                </p>
              </div>
              <button
                onClick={() => setShowCollectionForm(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Error Display */}
              {submitCollectionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 text-sm font-medium">
                      Error
                    </span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    {submitCollectionError}
                  </p>
                </div>
              )}

              {/* Staff Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Staff Member
                </h3>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Select Staff Member *
                  </label>
                  {staffFetchedData && staff.length > 0 ? (
                    <select
                      required
                      value={selectedStaff?.id || ""}
                      onChange={(e) => {
                        const member = staff.find(
                          (m: any) => m._id === e.target.value
                        );
                        if (member) {
                          setSelectedStaff({
                            id: member._id,
                            name: `${member.firstName} ${member.lastName}`,
                            role: member.userRole,
                            email: member.email,
                          });
                        }
                      }}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select a staff member...</option>
                      {staff.map((member: any) => (
                        <option key={member._id} value={member._id}>
                          {member.firstName} {member.lastName} -{" "}
                          {member.userRole} ({member.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={handleFetchStaff}
                        disabled={isLoadingStaff}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {staffFetchedData && staff.length === 0 ? (
                          <>No Active Staff Available</>
                        ) : isLoadingStaff ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                            Loading staff...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Load Staff Members
                          </>
                        )}
                      </button>
                      {fetchStaffError && (
                        <p className="mt-1 text-sm text-red-600">
                          Failed to load staff. Please try again.
                        </p>
                      )}
                    </div>
                  )}
                  {selectedStaff && (
                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-orange-900">
                            {selectedStaff.name}
                          </p>
                          <p className="text-sm text-orange-700">
                            {selectedStaff.role}
                          </p>
                          <p className="text-xs text-orange-600">
                            {selectedStaff.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Guest Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Destination
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setGuestType(InventoryDestination.HOTEL_GUEST)
                    }
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      guestType === InventoryDestination.HOTEL_GUEST
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-secondary-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Bed className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Room Guest</p>
                        <p className="text-sm text-secondary-500">
                          Hotel room guest
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGuestType(InventoryDestination.WALK_IN)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      guestType === InventoryDestination.WALK_IN
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-secondary-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Walk-in Guest</p>
                        <p className="text-sm text-secondary-500">
                          Non-resident guest
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setGuestType(InventoryDestination.RESTAURANT)
                    }
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      guestType === InventoryDestination.RESTAURANT
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-secondary-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Utensils className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Restaurant</p>
                        <p className="text-sm text-secondary-500">
                          Restaurant table
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Room/Table Number */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {guestType === InventoryDestination.HOTEL_GUEST
                    ? "Room Number"
                    : guestType === InventoryDestination.RESTAURANT
                    ? "Table Number"
                    : "Guest Details"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guestType === InventoryDestination.HOTEL_GUEST && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Room Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., 101, 205, 301"
                      />
                    </div>
                  )}

                  {guestType === InventoryDestination.RESTAURANT && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Table Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., T1, T5, T12"
                      />
                    </div>
                  )}

                  {guestType === InventoryDestination.WALK_IN && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Guest Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter guest name"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Item Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Available Iatems
                  </h3>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                  {filteredItems.map((item) => {
                    // Calculate available stock for this item
                    const existingItem = collectionItems.find(
                      (ci) => ci.item._id === item._id
                    );
                    const alreadyCollected = existingItem
                      ? existingItem.quantity
                      : 0;
                    const availableStock = item.currentStock - alreadyCollected;
                    const canAddMore = availableStock > 0;

                    return (
                      <div
                        key={item._id}
                        className={`border rounded-lg p-4 ${
                          canAddMore
                            ? "border-secondary-200"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-secondary-900">
                            {item.itemName}
                          </h4>
                          <div className="text-right">
                            <span className="text-sm text-secondary-500">
                              {availableStock} {item.unit} available
                            </span>
                            {alreadyCollected > 0 && (
                              <span className="text-xs text-orange-600 block">
                                ({alreadyCollected} selected)
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-secondary-600 mb-3">
                          {item.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            {formatPrice(item.costPerUnit, selectedHotel?.currency)}/{item.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddItem(item)}
                            disabled={!canAddMore}
                            className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${
                              canAddMore
                                ? "bg-orange-600 text-white hover:bg-orange-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>{canAddMore ? "Add" : "No Stock"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Items */}
              {collectionItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Selected Items
                  </h3>
                  <div className="space-y-2">
                    {collectionItems.map((collectionItem) => {
                      // Calculate available stock for this item
                      const alreadyCollected = collectionItem.quantity;
                      const availableStock =
                        collectionItem.item.currentStock - alreadyCollected;
                      const canAddMore = availableStock > 0;

                      return (
                        <div
                          key={collectionItem.item._id}
                          className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-secondary-900">
                              {collectionItem.item.itemName}
                            </p>
                            <p className="text-sm text-secondary-600">
                              {collectionItem.item.category}
                            </p>
                            {!canAddMore && (
                              <p className="text-xs text-red-600 mt-1">
                                No more stock available
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    collectionItem.item._id,
                                    collectionItem.quantity - 1
                                  )
                                }
                                className="p-1 hover:bg-secondary-200 rounded"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center">
                                {collectionItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    collectionItem.item._id,
                                    collectionItem.quantity + 1
                                  )
                                }
                                disabled={!canAddMore}
                                className={`p-1 rounded transition-colors ${
                                  canAddMore
                                    ? "hover:bg-secondary-200"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveItem(collectionItem.item._id)
                              }
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Collection Summary */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-900">
                          Collection Summary
                        </p>
                        <p className="text-sm text-orange-700">
                          {totalItems} items • {formatPrice(totalValue, selectedHotel?.currency)} value
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-orange-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Ready to collect
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Additional notes or special instructions..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                <button
                  type="button"
                  onClick={() => setShowCollectionForm(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !selectedStaff ||
                    collectionItems.length === 0 ||
                    isSubmittingCollection
                  }
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingCollection ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Collection</span>
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
