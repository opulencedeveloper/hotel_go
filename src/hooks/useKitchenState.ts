import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { OrderStatus, OrderType } from "@/utils/enum";
import { useHttp } from "@/hooks/useHttp";
import { orderActions } from "@/store/redux/order-slice";

// Define the interface that ActiveOrders component expects
interface KitchenOrder {
  id: string;
  customer: string;
  table: string;
  status: OrderStatus;
  orderTime: string;
  total: number;
  paymentMethod?: string;
  items: Array<{
    name: string;
    category: string;
    price: number;
    status: "pending" | "cooking" | "ready";
  }>;
}

export function useKitchenState() {
  const dispatch = useDispatch();

  // HTTP hook for order updates
  const {
    isLoading: isUpdatingOrder,
    sendHttpRequest: updateOrderRequest,
    error: updateOrderError,
  } = useHttp();

  // Get orders from Redux state
  const order = useSelector((state: RootState) => state.order);
  const { orders: reduxOrders } = order;

  // Transform Redux orders to match ActiveOrders component interface
  const orders: KitchenOrder[] =
    reduxOrders?.map((reduxOrder: any) => ({
      id: reduxOrder._id,
      customer:
        reduxOrder.orderType === OrderType.HOTEL_GUEST
          ? "Hotel Guest"
          : reduxOrder.orderType === OrderType.RESTAURANT
          ? "Restaurant Customer"
          : "Walk-in Customer",
      table: reduxOrder.tableNumber || reduxOrder.roomId || "N/A",
      status: reduxOrder.status,
       orderTime: (() => {
         if (reduxOrder.createdAt) {
           const orderDate = new Date(reduxOrder.createdAt);
           const now = new Date();
           const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
           
           let relativeTime = '';
           if (diffInMinutes < 1) {
             relativeTime = 'Just now';
           } else if (diffInMinutes < 60) {
             relativeTime = `${diffInMinutes} min ago`;
           } else if (diffInMinutes < 1440) {
             const hours = Math.floor(diffInMinutes / 60);
             relativeTime = `${hours} hour${hours > 1 ? 's' : ''} ago`;
           } else {
             const days = Math.floor(diffInMinutes / 1440);
             relativeTime = `${days} day${days > 1 ? 's' : ''} ago`;
           }
           
           const absoluteTime = orderDate.toLocaleString('en-US', {
             weekday: 'short',
             month: 'short',
             day: 'numeric',
             hour: 'numeric',
             minute: '2-digit',
             hour12: true
           });
           
           return `${relativeTime} (${absoluteTime})`;
         }
         return 'Order time not available';
       })(),
       total: reduxOrder.items?.reduce((sum: number, item: any) => sum + (item.priceWhenOrdered || 0), 0) || 0,
       paymentMethod: reduxOrder.paymentMethod,
      items:
        reduxOrder.items?.map((item: any) => ({
          name: item.menuId?.itemName || "Unknown Item",
          category: item.menuId?.category || "Unknown",
          price: item.priceWhenOrdered || 0,
          status: (reduxOrder.status === "pending"
            ? "pending"
            : reduxOrder.status === "completed"
            ? "ready"
            : "cooking") as "pending" | "cooking" | "ready",
        })) || [],
    })) || [];
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Modal states
  const [showViewOrdersModal, setShowViewOrdersModal] = useState(false);
  const [showKitchenTimerModal, setShowKitchenTimerModal] = useState(false);
  const [showMenuManagerModal, setShowMenuManagerModal] = useState(false);
  const [showMenuListModal, setShowMenuListModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [showStaffScheduleModal, setShowStaffScheduleModal] = useState(false);
  const [showInventoryCheckModal, setShowInventoryCheckModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderAction, setPendingOrderAction] = useState<{
    action: string;
    orderId: string;
  } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");

  const handleOrderAction = (action: string, orderId: string) => {
    setPendingOrderAction({ action, orderId });

    // If action is "Mark Paid", show payment method selection
    if (action === "Mark Paid") {
      setShowPaymentModal(true);
    } else {
      // For other actions, show confirmation modal
      setShowConfirmationModal(true);
    }
  };

  const confirmOrderAction = () => {
    if (!pendingOrderAction) return;

    const { action, orderId } = pendingOrderAction;
    let newStatus: OrderStatus;

    // Map action to status
    switch (action) {
      case "Mark Ready":
        newStatus = OrderStatus.READY;
        break;
      case "Mark Paid":
        newStatus = OrderStatus.PAID;
        break;
      case "Cancel Order":
        newStatus = OrderStatus.CANCELLED;
        break;
      default:
        return;
    }

    // Prepare request data
    const requestData: any = {
      status: newStatus,
    };

    // Add payment method if marking as paid
    if (action === "Mark Paid") {
      requestData.paymentMethod = selectedPaymentMethod;
    }

    const onSuccessHandler = (res: any) => {
      console.log("Order updated successfully:", res.data);
      const resData = res?.data?.data;
      const editedOrder = resData.editedOrder;

      // Update Redux state
      dispatch(orderActions.updateOrder(editedOrder));

      // Close modals
      setShowConfirmationModal(false);
      setShowPaymentModal(false);
      setPendingOrderAction(null);
    };

    updateOrderRequest({
      successRes: onSuccessHandler,
      requestConfig: {
        url: `/hotel/update-order-status?orderId=${orderId}`,
        method: "PUT",
        body: requestData,
        successMessage: `Order ${action.toLowerCase()} successfully`,
      },
    });
  };

  const cancelOrderAction = () => {
    setShowConfirmationModal(false);
    setShowPaymentModal(false);
    setPendingOrderAction(null);
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const handleKitchenTimerSubmit = (data: any) => {
    console.log("Starting kitchen timer:", data);
    setShowKitchenTimerModal(false);
  };

  const handleStaffScheduleSubmit = (data: any) => {
    console.log("Scheduling staff:", data);
    setShowStaffScheduleModal(false);
  };

  const handleInventoryCheckSubmit = (data: any) => {
    console.log("Checking inventory:", data);
    setShowInventoryCheckModal(false);
  };

  const handleReportIssueSubmit = (data: any) => {
    console.log("Reporting issue:", data);
    setShowReportIssueModal(false);
  };

  // Menu management handlers
  const handleEditMenu = (menuItem: any) => {
    setEditingMenuItem(menuItem);
    setIsEditingMenu(true);
    setShowMenuListModal(false);
    setShowMenuManagerModal(true);
  };

  const handleDeleteMenu = (menuId: string) => {
    console.log("Delete menu item:", menuId);
    // Handle delete logic
  };

  const handleAddNewMenu = () => {
    setEditingMenuItem(null);
    setIsEditingMenu(false);
    setShowMenuListModal(false);
    setShowMenuManagerModal(true);
  };

  const handleMenuManagerSuccess = () => {
    setShowMenuManagerModal(false);
    setEditingMenuItem(null);
    setIsEditingMenu(false);
    // Refresh menu items or show success message
    console.log("Menu item saved successfully");
  };

  return {
    // State
    orders,
    selectedOrder,

    // Modal states
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

    // Modal setters
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

    // Actions
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

    // HTTP states
    isUpdatingOrder,
    updateOrderError,
  };
}
