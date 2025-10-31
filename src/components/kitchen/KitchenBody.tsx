"use client";

import { useKitchenState } from "@/hooks/useKitchenState";
import KitchenHeader from "./KitchenHeader";
import ActiveOrders from "./ActiveOrders";
import KitchenSidebar from "./KitchenSidebar";
import ViewOrdersModal from "./modals/ViewOrdersModal";
import KitchenTimerModal from "./modals/KitchenTimerModal";
import MenuManagerModal from "./modals/MenuManagerModal";
import MenuListModal from "./modals/MenuListModal";
import StaffScheduleModal from "./modals/StaffScheduleModal";
import InventoryCheckModal from "./modals/InventoryCheckModal";
import ReportIssueModal from "./modals/ReportIssueModal";
import OrderDetailsModal from "./modals/OrderDetailsModal";
import OrderConfirmationModal from "./modals/OrderConfirmationModal";
import OrderPaymentModal from "./modals/OrderPaymentModal";

export default function KitchenBody() {
  const {
    orders,
    selectedOrder,
    showViewOrdersModal,
    showKitchenTimerModal,
    showMenuManagerModal,
    showMenuListModal,
    showStaffScheduleModal,
    showInventoryCheckModal,
    showReportIssueModal,
    showOrderDetailsModal,
    showConfirmationModal,
    showPaymentModal,
    editingMenuItem,
    isEditingMenu,
    pendingOrderAction,
    selectedPaymentMethod,
    setShowViewOrdersModal,
    setShowKitchenTimerModal,
    setShowMenuManagerModal,
    setShowMenuListModal,
    setShowStaffScheduleModal,
    setShowInventoryCheckModal,
    setShowReportIssueModal,
    setShowOrderDetailsModal,
    setShowConfirmationModal,
    setShowPaymentModal,
    setSelectedPaymentMethod,
    handleOrderAction,
    handleViewOrderDetails,
    handleKitchenTimerSubmit,
    handleStaffScheduleSubmit,
    handleInventoryCheckSubmit,
    handleReportIssueSubmit,
    handleEditMenu,
    handleDeleteMenu,
    handleAddNewMenu,
    handleMenuManagerSuccess,
    confirmOrderAction,
    cancelOrderAction,
    isUpdatingOrder,
    updateOrderError,
  } = useKitchenState();

  return (
    <div className="space-y-6">
      {/* Header */}
      <KitchenHeader
        onViewOrders={() => setShowViewOrdersModal(true)}
        onKitchenTimer={() => setShowKitchenTimerModal(true)}
        onMenuManager={() => setShowMenuListModal(true)}
      />

      {/* Kitchen Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders */}
        <div className="lg:col-span-2">
        <ActiveOrders
            orders={orders}
            onOrderAction={handleOrderAction}
            onViewOrderDetails={handleViewOrderDetails}
          />
        </div>

        {/* Kitchen Stats & Tools */}
        <KitchenSidebar
          onMenuManager={() => setShowMenuListModal(true)}
          onStaffSchedule={() => setShowStaffScheduleModal(true)}
          onInventoryCheck={() => setShowInventoryCheckModal(true)}
          onReportIssue={() => setShowReportIssueModal(true)}
        />
      </div>

      {/* Modals */}
      <ViewOrdersModal
        isOpen={showViewOrdersModal}
        onClose={() => setShowViewOrdersModal(false)}
      />

      <KitchenTimerModal
        isOpen={showKitchenTimerModal}
        onClose={() => setShowKitchenTimerModal(false)}
        onSubmit={handleKitchenTimerSubmit}
      />

      {showMenuListModal && (
        <MenuListModal
          isOpen={showMenuListModal}
          onClose={() => setShowMenuListModal(false)}
          onEditMenu={handleEditMenu}
          onDeleteMenu={handleDeleteMenu}
          onAddNew={handleAddNewMenu}
        />
      )}

      <MenuManagerModal
        isOpen={showMenuManagerModal}
        onClose={() => setShowMenuManagerModal(false)}
        onSuccess={handleMenuManagerSuccess}
        editItem={editingMenuItem}
        isEditing={isEditingMenu}
      />

      <StaffScheduleModal
        isOpen={showStaffScheduleModal}
        onClose={() => setShowStaffScheduleModal(false)}
        onSubmit={handleStaffScheduleSubmit}
      />

      <InventoryCheckModal
        isOpen={showInventoryCheckModal}
        onClose={() => setShowInventoryCheckModal(false)}
        onSubmit={handleInventoryCheckSubmit}
      />

      <ReportIssueModal
        isOpen={showReportIssueModal}
        onClose={() => setShowReportIssueModal(false)}
        onSubmit={handleReportIssueSubmit}
      />

      <OrderDetailsModal
        isOpen={showOrderDetailsModal}
        onClose={() => setShowOrderDetailsModal(false)}
        order={selectedOrder}
        onOrderAction={handleOrderAction}
      />

      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        onClose={cancelOrderAction}
        onConfirm={confirmOrderAction}
        action={pendingOrderAction?.action || ""}
        orderId={pendingOrderAction?.orderId || ""}
        isLoading={isUpdatingOrder}
      />

      <OrderPaymentModal
        isOpen={showPaymentModal}
        onClose={cancelOrderAction}
        onConfirm={confirmOrderAction}
        orderId={pendingOrderAction?.orderId || ""}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        isLoading={isUpdatingOrder}
      />
    </div>
  );
}
