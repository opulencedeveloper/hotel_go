"use client";

import { useState, useEffect, useMemo } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { UserRole } from "@/lib/auth";
import Modal from "@/components/common/Modal";
import Layout from "@/app/(dashboard)/layout";
import { PaymentStatus, StayStatus, StayType } from "@/utils/enum";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  CreditCard,
  User,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/useHttp";
import { stayActions } from "@/store/redux/stay-slice";

export default function StaysBody() {
  const [selectedTab, setSelectedTab] = useState<StayType>(StayType.RESERVED);
  const [showForm, setShowForm] = useState(false);
  const [editingStay, setEditingStay] = useState<any>(null);
  const [viewingStay, setViewingStay] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const dispatch = useDispatch();
  const stay = useSelector((state: RootState) => state.stay);
  const { stays } = stay;

  console.log("component stays", stays);

  // HTTP hooks for different operations
  const {
    isLoading: isUpdating,
    sendHttpRequest: updateStayRequest,
    error: updateError,
  } = useHttp();

  const {
    isLoading: isDeleting,
    sendHttpRequest: deleteStayRequest,
    error: deleteError,
  } = useHttp();

  // Filter stays based on selected tab, search term, and filters
  const filteredStays = useMemo(() => {
    let filtered = stays.filter((stay) => stay.type === selectedTab);

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((stay) => stay.status === statusFilter);
    }

    // Filter by payment status (only for reservations and bookings)
    if (
      paymentStatusFilter &&
      (selectedTab === StayType.RESERVED || selectedTab === StayType.BOOKED)
    ) {
      filtered = filtered.filter(
        (stay) => stay.paymentStatus === paymentStatusFilter
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (stay) =>
          stay.guestName.toLowerCase().includes(searchLower) ||
          stay.emailAddress?.toLowerCase().includes(searchLower) ||
          stay.roomId.roomNumber.toLowerCase().includes(searchLower)
        // stay.id.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [selectedTab, searchTerm, statusFilter, paymentStatusFilter, stays]);

  const handleCreateStay = () => {
    setEditingStay(null);
    setShowForm(true);
  };

  const handleEditStay = (stay: any) => {
    setEditingStay(stay);
    setShowForm(true);
  };

  const handleViewStay = (stay: any) => {
    setViewingStay(stay);
  };

  const handleFormSuccess = () => {
    if (editingStay) {
      // Update existing stay
      updateStayRequest({
        successRes: (res: any) => {
          const resData = res?.data.data;
          console.log("Stay updated successfully:", res.data);
         // alert("Stay updated successfully!");
          setShowForm(false);
          setEditingStay(null);

          console.log("(resData.editedStay", resData.editedStay)
          // In a real app, you might want to refresh the stays data here
          dispatch(stayActions.updateStay(resData.editedStay));
        },
        requestConfig: {
          url: `/hotel/update-stay/?stayId=${editingStay._id}`,
          method: "PUT",
          body: {
            guestName: editingStay.guestName,
            emailAddress: editingStay.emailAddress,
            phoneNumber: editingStay.phoneNumber,
            status: editingStay.status,
            paymentStatus: editingStay.paymentStatus,
            specialRequests: editingStay.specialRequests,
          },
          successMessage: "Stay updated successfully!",
        },
      });
    } else {
      // Create new stay
      console.log("Creating new stay");
      setShowForm(false);
      setEditingStay(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStay(null);
  };

  const handleDeleteStay = (stay: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete this stay for ${stay.guestName}?`
      )
    ) {
      deleteStayRequest({
        successRes: (res: any) => {
          console.log("Stay deleted successfully:", res.data);
          alert("Stay deleted successfully!");
          // In a real app, you might want to refresh the stays data here
          // dispatch(stayActions.refreshStays());
        },
        requestConfig: {
          url: `/stays/${stay._id}`,
          method: "DELETE",
          successMessage: "Stay deleted successfully!",
        },
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case StayStatus.CONFIRMED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case StayStatus.CHECKED_IN:
        return <User className="w-4 h-4 text-blue-500" />;
      case StayStatus.CHECKED_OUT:
        return <Clock className="w-4 h-4 text-gray-500" />;
      case StayStatus.CANCELLED:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (paymentStatus) {
      case PaymentStatus.PAID:
        return `${baseClasses} bg-green-100 text-green-800`;
      case PaymentStatus.PENDING:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case PaymentStatus.REFUNDED:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case PaymentStatus.CANCELLED:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeIcon = (type: StayType) => {
    switch (type) {
      case StayType.RESERVED:
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case StayType.BOOKED:
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case StayType.WALK_IN:
        return <User className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const tabs = [
    {
      value: StayType.RESERVED,
      label: "Reservations",
      count: stays.filter((s) => s.type === StayType.RESERVED).length,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: StayType.BOOKED,
      label: "Bookings",
      count: stays.filter((s) => s.type === StayType.BOOKED).length,
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      value: StayType.WALK_IN,
      label: "Walk-ins",
      count: stays.filter((s) => s.type === StayType.WALK_IN).length,
      icon: <User className="w-4 h-4" />,
    },
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: StayStatus.CONFIRMED, label: "Confirmed" },
    { value: StayStatus.CHECKED_IN, label: "Checked In" },
    { value: StayStatus.CHECKED_OUT, label: "Checked Out" },
    { value: StayStatus.CANCELLED, label: "Cancelled" },
  ];

   const statusOptionsDropDown = [
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

   const paymentStatusDropDown = [
    { value: PaymentStatus.PAID, label: "Paid" },
    { value: PaymentStatus.PENDING, label: "Pending" },
    { value: PaymentStatus.REFUNDED, label: "Refunded" },
    { value: PaymentStatus.CANCELLED, label: "Cancelled" },
  ];

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stay Management</h1>
          <p className="text-gray-600">
            Manage reservations, bookings, and walk-ins
          </p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager", "front_desk"]}>
          <button
            onClick={handleCreateStay}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Stay
          </button>
        </RoleGuard>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`${
                selectedTab === tab.value
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  selectedTab === tab.value
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(selectedTab === StayType.RESERVED ||
            selectedTab === StayType.BOOKED) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
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
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPaymentStatusFilter("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

       {/* Error Messages */}
       {(updateError || deleteError) && (
         <div className="bg-red-50 border border-red-200 rounded-md p-4">
           <div className="flex">
             <div className="ml-3">
               <h3 className="text-sm font-medium text-red-800">Error</h3>
               <div className="mt-2 text-sm text-red-700">
                 {updateError && <p>Update failed: {updateError}</p>}
                 {deleteError && <p>Delete failed: {deleteError}</p>}
               </div>
             </div>
           </div>
         </div>
       )}

      {/* Stays Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stay Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStays.map((stay) => (
                <tr key={stay._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(stay.type as StayType)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {stay._id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stay.type.charAt(0).toUpperCase() +
                            stay.type.slice(1).replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {stay.guestName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stay.emailAddress}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stay.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Room {stay.roomId.roomNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stay.roomId.roomTypeId.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        Check-in:{" "}
                        {new Date(stay.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Check-out:{" "}
                        {new Date(stay.checkOutDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stay.adults} adults, {stay.children} children
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {stay.paymentMethod.replace("_", " ").toUpperCase()}
                      </div>
                      <span
                        className={getPaymentStatusBadge(stay.paymentStatus)}
                      >
                        {stay.paymentStatus}
                      </span>
                      {stay.paymentDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Due: {new Date(stay.paymentDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(stay.status)}
                      <span className="ml-2 text-sm text-gray-900">
                        {stay.status.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewStay(stay)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditStay(stay)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                        title="Edit Stay"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStay(stay)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Stay"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

         {filteredStays.length === 0 && (
           <div className="text-center py-12">
             <Calendar className="mx-auto h-12 w-12 text-gray-400" />
             <h3 className="mt-2 text-sm font-medium text-gray-900">
               No stays found
             </h3>
             <p className="mt-1 text-sm text-gray-500">
               {searchTerm || statusFilter || paymentStatusFilter
                 ? "Try adjusting your filters"
                 : `No ${selectedTab.toLowerCase()} found`}
             </p>
           </div>
         )}
      </div>

      {/* Stay Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={editingStay ? `Edit ${selectedTab}` : `New ${selectedTab}`}
        size="lg"
      >
        <div className="p-6">
          {editingStay ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Stay Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={editingStay.guestName || ""}
                    onChange={(e) =>
                      setEditingStay({
                        ...editingStay,
                        guestName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingStay.emailAddress || ""}
                    onChange={(e) =>
                      setEditingStay({
                        ...editingStay,
                        emailAddress: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editingStay.phoneNumber || ""}
                    onChange={(e) =>
                      setEditingStay({
                        ...editingStay,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingStay.status || ""}
                    onChange={(e) =>
                      setEditingStay({ ...editingStay, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {statusOptionsDropDown.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {(editingStay.type === StayType.RESERVED ||
                  editingStay.type === StayType.BOOKED) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={editingStay.paymentStatus || ""}
                      onChange={(e) =>
                        setEditingStay({
                          ...editingStay,
                          paymentStatus: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      { paymentStatusDropDown.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    value={editingStay.specialRequests || ""}
                    onChange={(e) =>
                      setEditingStay({
                        ...editingStay,
                        specialRequests: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                Create a new stay - This would integrate with your existing form
                components.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleFormCancel}
              disabled={isUpdating}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSuccess}
              disabled={isUpdating}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUpdating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {editingStay ? "Update Stay" : "Create Stay"}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Stay Modal */}
      <Modal
        isOpen={!!viewingStay}
        onClose={() => setViewingStay(null)}
        title={`Stay Details - ${viewingStay?._id}`}
        size="lg"
      >
        {viewingStay && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Guest Information</h4>
                <p className="text-sm text-gray-600">
                  Name: {viewingStay.guestName}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {viewingStay.emailAddress}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {viewingStay.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Address: {viewingStay.address}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Stay Information</h4>
                <p className="text-sm text-gray-600">
                  Room: {viewingStay.roomId?.roomNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {viewingStay.roomId?.roomTypeId?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Check-in:{" "}
                  {new Date(viewingStay.checkInDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Check-out:{" "}
                  {new Date(viewingStay.checkOutDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Payment Information
                </h4>
                <p className="text-sm text-gray-600">
                  Method: {viewingStay.paymentMethod}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {viewingStay.paymentStatus}
                </p>
                {viewingStay.paymentDate && (
                  <p className="text-sm text-gray-600">
                    Due:{" "}
                    {new Date(viewingStay.paymentDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Special Requests</h4>
                <p className="text-sm text-gray-600">
                  {viewingStay.specialRequests || "None"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
