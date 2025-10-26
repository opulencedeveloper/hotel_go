"use client";

import { useState } from "react";
import {
  Package,
  User,
  Bed,
  Utensils,
  ShoppingBag,
  Calendar,
  Clock,
  Search,
  Filter,
  Eye,
  X,
} from "lucide-react";
import { InventoryDestination } from "@/utils/enum";
import { InventoryLog } from "@/store/redux/inventory-slice";
import { formatPrice } from '@/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface InventoryLogsProps {
  logs: InventoryLog[];
}

export default function InventoryLogs({ logs }: InventoryLogsProps) {
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDestination, setFilterDestination] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<InventoryLog | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  // Filter logs based on search and destination
  const filteredLogs = logs.filter((log) => {
    const staffName = `${log.staff.firstName} ${log.staff.lastName}`;
    const matchesSearch = 
      staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.inventories.some(item => 
        item.inventoryInfo.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDestination = 
      filterDestination === "all" || log.destination === filterDestination;

    return matchesSearch && matchesDestination;
  });

  const handleViewLog = (log: InventoryLog) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const handleCloseModal = () => {
    setSelectedLog(null);
    setShowLogModal(false);
  };

  const getDestinationIcon = (destination: InventoryDestination) => {
    switch (destination) {
      case InventoryDestination.HOTEL_GUEST:
        return <Bed className="w-4 h-4" />;
      case InventoryDestination.RESTAURANT:
        return <Utensils className="w-4 h-4" />;
      case InventoryDestination.WALK_IN:
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getDestinationLabel = (destination: InventoryDestination) => {
    switch (destination) {
      case InventoryDestination.HOTEL_GUEST:
        return "Room Guest";
      case InventoryDestination.RESTAURANT:
        return "Restaurant";
      case InventoryDestination.WALK_IN:
        return "Walk-in Guest";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      {/* Header */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Collection Logs
            </h2>
            <p className="text-secondary-600 text-sm">
              History of inventory collections and distributions
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-600">
            <Package className="w-4 h-4" />
            <span>{logs.length} total logs</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by staff, room, table, guest, or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Destination Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-secondary-500" />
            <select
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Destinations</option>
              <option value={InventoryDestination.HOTEL_GUEST}>Room Guest</option>
              <option value={InventoryDestination.RESTAURANT}>Restaurant</option>
              <option value={InventoryDestination.WALK_IN}>Walk-in Guest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="divide-y divide-secondary-200">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No collection logs found
            </h3>
            <p className="text-secondary-600">
              {searchTerm || filterDestination !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No inventory collections have been recorded yet"}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log._id}
              className="p-6 hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getDestinationIcon(log.destination)}
                      <span className="text-sm font-medium text-secondary-700">
                        {getDestinationLabel(log.destination)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-500">
                      <User className="w-4 h-4" />
                      <span>{log.staff.firstName} {log.staff.lastName}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-secondary-600">
                    {log.destination === InventoryDestination.HOTEL_GUEST && log.room?.roomNumber && (
                      <div className="flex items-center space-x-1">
                        <Bed className="w-4 h-4" />
                        <span>Room {log.room.roomNumber}</span>
                      </div>
                    )}
                    {log.destination === InventoryDestination.RESTAURANT && (
                      <div className="flex items-center space-x-1">
                        <Utensils className="w-4 h-4" />
                        <span>Restaurant</span>
                      </div>
                    )}
                    {log.destination === InventoryDestination.WALK_IN && (
                      <div className="flex items-center space-x-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Walk-in Guest</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(log.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          {log.inventories.length} items • {formatPrice(log.inventories.reduce((sum, item) => sum + (item.quantity * item.inventoryInfo.costPerUnit), 0), selectedHotel?.currency)} value
                        </p>
                        <p className="text-xs text-secondary-500">
                          {log.inventories.map(item => 
                            `${item.inventoryInfo.itemName} (${item.quantity} ${item.inventoryInfo.unit})`
                          ).join(", ")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewLog(log)}
                        className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Details Modal */}
      {showLogModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-secondary-200">
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  Collection Details
                </h2>
                <p className="text-secondary-600">
                  {formatDate(selectedLog.createdAt)} at {formatTime(selectedLog.createdAt)}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Staff Information */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-900 mb-2">Staff Member</h3>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">{selectedLog.staff.firstName} {selectedLog.staff.lastName}</p>
                    <p className="text-sm text-orange-700">{selectedLog.staff.userRole}</p>
                    <p className="text-xs text-orange-600">{selectedLog.staff.email}</p>
                  </div>
                </div>
              </div>

              {/* Destination Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Destination</h3>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getDestinationIcon(selectedLog.destination)}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      {getDestinationLabel(selectedLog.destination)}
                    </p>
                    {selectedLog.room?.roomNumber && (
                      <p className="text-sm text-blue-700">Room: {selectedLog.room.roomNumber}</p>
                    )}
                    {selectedLog.roomType && (
                      <p className="text-sm text-blue-700">Room Type: {selectedLog.roomType.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Collected */}
              <div>
                <h3 className="font-medium text-secondary-900 mb-3">Items Collected</h3>
                <div className="space-y-2">
                  {selectedLog.inventories.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-secondary-900">{item.inventoryInfo.itemName}</p>
                        <p className="text-sm text-secondary-600">
                          {item.quantity} {item.inventoryInfo.unit}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {formatPrice(item.inventoryInfo.costPerUnit, selectedHotel?.currency)} per {item.inventoryInfo.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-secondary-900">
                          {formatPrice(item.quantity * item.inventoryInfo.costPerUnit, selectedHotel?.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-900">Total Value</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(selectedLog.inventories.reduce((sum, item) => sum + (item.quantity * item.inventoryInfo.costPerUnit), 0), selectedHotel?.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedLog.notes && (
                <div>
                  <h3 className="font-medium text-secondary-900 mb-2">Notes</h3>
                  <p className="text-secondary-600 bg-secondary-50 p-3 rounded-lg">
                    {selectedLog.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
