"use client";

import { useState, useEffect, useMemo } from "react";
import { PaymentStatus, StayStatus, StayType } from "@/utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/useHttp";
import { stayActions } from "@/store/redux/stay-slice";

// Import individual stay components
import StaysHeader from './StaysHeader';
import StaysTabs from './StaysTabs';
import StaysFilters from './StaysFilters';
import StaysTable from './StaysTable';
import StayFormModal from './StayFormModal';
import StayViewModal from './StayViewModal';
import StaysErrorDisplay from './StaysErrorDisplay';

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


  

  return (
    <div className="space-y-6">
      {/* Header */}
      <StaysHeader onCreateStay={handleCreateStay} />

      {/* Tabs */}
      <StaysTabs 
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        stays={stays}
      />

      {/* Filters */}
      <StaysFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusChange={setPaymentStatusFilter}
        selectedTab={selectedTab}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
          setPaymentStatusFilter("");
        }}
      />

      {/* Error Messages */}
      <StaysErrorDisplay 
        updateError={updateError}
        deleteError={deleteError}
      />

      {/* Stays Table */}
      <StaysTable
        filteredStays={filteredStays}
        selectedTab={selectedTab}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        paymentStatusFilter={paymentStatusFilter}
        onViewStay={handleViewStay}
        onEditStay={handleEditStay}
        onDeleteStay={handleDeleteStay}
        isDeleting={isDeleting}
      />

      {/* Stay Form Modal */}
      <StayFormModal
        isOpen={showForm}
        onClose={handleFormCancel}
        editingStay={editingStay}
        setEditingStay={setEditingStay}
        selectedTab={selectedTab}
        onFormSuccess={handleFormSuccess}
        isUpdating={isUpdating}
      />

      {/* View Stay Modal */}
      <StayViewModal
        viewingStay={viewingStay}
        onClose={() => setViewingStay(null)}
      />
    </div>
  );
}
