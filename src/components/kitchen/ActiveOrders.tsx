"use client";

import { useState } from "react";
import { Clock, Flame, CheckCircle, Utensils, X } from "lucide-react";
import { OrderStatus, OrderType } from "@/utils/enum";
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Order {
  id: string;
  customer: string;
  table: string;
  status: OrderStatus;
  orderTime: string;
  total: number;
  items: Array<{
    name: string;
    category: string;
    price: number;
    status: "pending" | "cooking" | "ready";
  }>;
}

interface ActiveOrdersProps {
  orders: Order[];
  onOrderAction: (action: string, orderId: string) => void;
  onViewOrderDetails: (order: Order) => void;
}

export default function ActiveOrders({
  orders,
  onOrderAction,
  onViewOrderDetails,
}: ActiveOrdersProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  const [activeTab, setActiveTab] = useState("all");

  // Filter orders based on active tab
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          switch (activeTab) {
            case "pending":
              return order.status === OrderStatus.PENDING;
            case "ready":
              return order.status === OrderStatus.READY;
            case "paid":
              return order.status === OrderStatus.PAID;
            case "cancelled":
              return order.status === OrderStatus.CANCELLED;
            default:
              return true;
          }
        });

  // Get order counts for each status
  const orderCounts = {
    all: orders.length,
    pending: orders.filter((order) => order.status === OrderStatus.PENDING).length,
    ready: orders.filter((order) => order.status === OrderStatus.READY).length,
    paid: orders.filter((order) => order.status === OrderStatus.PAID).length,
    cancelled: orders.filter((order) => order.status === OrderStatus.CANCELLED).length,
  };

  // Helper function to get status display text
  const getStatusDisplayText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Pending";
      case OrderStatus.READY:
        return "Ready";
      case OrderStatus.PAID:
        return "Paid";
      case OrderStatus.CANCELLED:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  // Helper function to get status color and icon
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          color: "yellow",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          icon: <Clock className="w-3 h-3 mr-1" />,
        };
      case OrderStatus.READY:
        return {
          color: "green",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
        };
      case OrderStatus.PAID:
        return {
          color: "blue",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
        };
      case OrderStatus.CANCELLED:
        return {
          color: "red",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <X className="w-3 h-3 mr-1" />,
        };
      default:
        return {
          color: "gray",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: <Clock className="w-3 h-3 mr-1" />,
        };
    }
  };

  // Helper function to get item status color
  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500";
      case "cooking":
        return "bg-blue-500";
      case "ready":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900">
          Active Orders
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-secondary-600">Live Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Order Status Tabs */}
        <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "all"
                ? "text-secondary-700 bg-white shadow-sm"
                : "text-secondary-600 hover:text-secondary-800 hover:bg-white/50"
            }`}
          >
            All ({orderCounts.all})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "pending"
                ? "text-secondary-700 bg-white shadow-sm"
                : "text-secondary-600 hover:text-secondary-800 hover:bg-white/50"
            }`}
          >
            Pending ({orderCounts.pending})
          </button>
          <button
            onClick={() => setActiveTab("ready")}
            className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "ready"
                ? "text-secondary-700 bg-white shadow-sm"
                : "text-secondary-600 hover:text-secondary-800 hover:bg-white/50"
            }`}
          >
            Ready ({orderCounts.ready})
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "paid"
                ? "text-secondary-700 bg-white shadow-sm"
                : "text-secondary-600 hover:text-secondary-800 hover:bg-white/50"
            }`}
          >
            Paid ({orderCounts.paid})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "cancelled"
                ? "text-secondary-700 bg-white shadow-sm"
                : "text-secondary-600 hover:text-secondary-800 hover:bg-white/50"
            }`}
          >
            Cancelled ({orderCounts.cancelled})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-500 text-lg font-medium">
                No orders found
              </p>
              <p className="text-secondary-400 text-sm">
                No orders match the selected filter
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col gap-3">
                      <div
                        className={`px-3 py-1 ${statusInfo.bgColor} rounded-full flex items-center justify-center min-w-0 flex-shrink-0`}
                      >
                        <span className="text-xs mr-1 ">OrderId: </span>{" "}
                        <span
                          className={`text-xs font-bold ${statusInfo.textColor} truncate`}
                        >
                          {order.id}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-secondary-900 truncate">
                          {order.table} - {order.customer}
                        </h3>
                        <div className="text-sm text-secondary-600">
                          <p className="font-medium">{order.orderTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                      >
                        {statusInfo.icon}
                        {getStatusDisplayText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-secondary-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600">Total:</span>
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(order.total, selectedHotel?.currency)}
                      </span>
                    </div>
                    <div className="text-sm text-secondary-500">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewOrderDetails(order)}
                        className="px-3 py-1 bg-secondary-200 text-secondary-700 text-xs rounded-md hover:bg-secondary-300"
                      >
                        View Details
                      </button>

                      {order.status === OrderStatus.PENDING && (
                        <>
                          <button
                            onClick={() =>
                              onOrderAction("Mark Ready", order.id)
                            }
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                          >
                            Mark Ready
                          </button>
                          <button
                            onClick={() =>
                              onOrderAction("Cancel Order", order.id)
                            }
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === OrderStatus.READY && (
                        <button
                          onClick={() =>
                            onOrderAction("Mark Paid", order.id)
                          }
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
