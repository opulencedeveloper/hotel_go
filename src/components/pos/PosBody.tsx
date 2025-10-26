"use client";

import { usePOSState } from "@/hooks/usePOSState";
import POSHeader from "./POSHeader";
import POSStats from "./POSStats";
import MenuItems from "./MenuItems";
import OrderCart from "./OrderCart";
import RecentOrders from "./RecentOrders";
import OrderDetailsModal from "./modals/OrderDetailsModal";
import NewOrderModal from "./modals/NewOrderModal";
import ItemDetailsModal from "./modals/ItemDetailsModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function () {
  const menu = useSelector((state: RootState) => state.menu);
  const { menus } = menu;

  const {
    // State
    items,
    orders,
    cart,
    searchTerm,
    categoryFilter,
    selectedOrder,
    tableNumber,
    roomNumber,
    showNewOrderModal,
    newOrderForm,
    filteredItems,
    posStats,
    showItemDetailsModal,
    selectedItem,
    customerType,

    // Setters
    setSearchTerm,
    setCategoryFilter,
    setSelectedOrder,
    setTableNumber,
    setRoomNumber,
    setShowNewOrderModal,
    setNewOrderForm,
    setShowItemDetailsModal,
    setCustomerType,

    // Functions
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    createOrder,
    updateOrderStatus,
    handleNewOrderSubmit,
    handleViewItemDetails,
    
    // HTTP States
    isCreatingOrder,
    createOrderError,
  } = usePOSState();

  return (
      <div className="space-y-6">
        {/* Header */}
      <POSHeader onNewOrder={() => setShowNewOrderModal(true)} />

        {/* POS Stats */}
      <POSStats
        totalOrders={posStats.totalOrders}
        pendingOrders={posStats.pendingOrders}
        preparingOrders={posStats.preparingOrders}
        readyOrders={posStats.readyOrders}
        totalRevenue={posStats.totalRevenue}
      />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Menu Items - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <MenuItems
              items={filteredItems}
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              onSearchChange={setSearchTerm}
              onCategoryFilterChange={setCategoryFilter}
              onAddToCart={addToCart}
              onViewDetails={handleViewItemDetails}
            />
          </div>

          {/* Right Sidebar - Cart and Orders */}
          <div className="lg:col-span-1 space-y-4">
            <OrderCart
              cart={cart}
              tableNumber={tableNumber}
              roomNumber={roomNumber}
              customerType={customerType}
              onTableNumberChange={setTableNumber}
              onRoomNumberChange={setRoomNumber}
              onCustomerTypeChange={setCustomerType}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onProcessOrder={createOrder}
              getTotal={getTotal}
              isCreatingOrder={isCreatingOrder}
              createOrderError={createOrderError || undefined}
            />

            <RecentOrders
              onViewOrder={setSelectedOrder}
              onUpdateOrderStatus={updateOrderStatus}
            />
          </div>
        </div>

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        items={items}
        onClose={() => setSelectedOrder(null)}
      />

      <NewOrderModal
        isOpen={showNewOrderModal}
        cart={cart}
        newOrderForm={newOrderForm}
        onClose={() => setShowNewOrderModal(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onFormChange={(field, value) =>
          setNewOrderForm({ ...newOrderForm, [field]: value })
        }
        onSubmit={handleNewOrderSubmit}
        getTotal={getTotal}
      />

      <ItemDetailsModal
        isOpen={showItemDetailsModal}
        onClose={() => setShowItemDetailsModal(false)}
        item={selectedItem}
                        />
                      </div>
  );
}
