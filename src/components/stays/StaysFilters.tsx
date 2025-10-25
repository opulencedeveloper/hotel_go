'use client';

import { Search } from "lucide-react";
import { StayType, StayStatus, PaymentStatus } from "@/utils/enum";

interface StaysFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (status: string) => void;
  selectedTab: StayType;
  onClearFilters: () => void;
}

export default function StaysFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  selectedTab,
  onClearFilters,
}: StaysFiltersProps) {
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: StayStatus.CONFIRMED, label: "Confirmed" },
    { value: StayStatus.CHECKED_IN, label: "Checked In" },
    { value: StayStatus.CHECKED_OUT, label: "Checked Out" },
    { value: StayStatus.CANCELLED, label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "", label: "All Payment Status" },
    { value: PaymentStatus.PAID, label: "Paid" },
    { value: PaymentStatus.PENDING, label: "Pending" },
    { value: PaymentStatus.REFUNDED, label: "Refunded" },
    { value: PaymentStatus.CANCELLED, label: "Cancelled" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search by guest name, room, or ID..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {(selectedTab === StayType.RESERVED || selectedTab === StayType.BOOKED) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => onPaymentStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}




