'use client';

import { useState } from 'react';
import FolioStats from '@/components/folio/FolioStats';
import FolioTable from '@/components/folio/FolioTable';
import FolioHeader from '@/components/folio/FolioHeader';
import ServiceCategories from '@/components/folio/ServiceCategories';
import PaymentOverview from '@/components/folio/PaymentOverview';
import FolioSearch from '@/components/folio/FolioSearch';
import FolioModals from '@/components/folio/FolioModals';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { StayStatus } from '@/utils/enum';
import { useRouter } from 'next/navigation';

export default function FolioBody() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolio, setSelectedFolio] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const router = useRouter();
  const stay = useSelector((state: RootState) => state.stay);
  const order = useSelector((state: RootState) => state.order);
  const { stays } = stay;
  const { orders} = order;

  // Transform stays data to folio format
  const folios = stays.map((stay) => {
    const totalAmount = stay.totalAmount || 0;
    const paidAmount = stay.paidAmount || 0;
    const balance = totalAmount - paidAmount;
    
    return {
      id: stay._id,
      guest: stay.guestName,
      room: stay.roomId?.roomNumber || 'N/A',
      checkIn: stay.checkInDate,
      checkOut: stay.checkOutDate,
      totalCharges: totalAmount,
      totalPayments: paidAmount,
      balance: balance,
      status: stay.status,
      lastActivity: new Date(stay.updatedAt).toLocaleString(),
      paymentStatus: stay.paymentStatus,
      paymentMethod: stay.paymentMethod,
      email: stay.emailAddress,
      phone: stay.phoneNumber,
      address: stay.address,
      adults: stay.adults,
      children: stay.children,
      specialRequests: stay.specialRequests
    };
  });

  const filteredFolios = [...folios].filter(folio =>
    folio.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    folio.room.includes(searchTerm) ||
    folio.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats from actual data
  const folioStats = {
    totalFolios: folios.length,
    openFolios: [...folios].filter(f => f.status === StayStatus.CHECKED_IN || f.status === StayStatus.CONFIRMED).length,
    totalOutstanding: folios.reduce((sum, folio) => sum + folio.balance, 0),
    totalCharges: folios.reduce((sum, folio) => sum + folio.totalCharges, 0)
  };

  // Navigation handlers
  const handleViewStays = () => {
    router.push('/stays');
  };

  const handleViewOrders = () => {
    router.push('/pos');
  };

  const handleViewPayments = () => {
    // Filter folios by payment status and show in current view
    // For now, we'll just scroll to the folios table
    const foliosTable = document.getElementById('folios-table');
    if (foliosTable) {
      foliosTable.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetails = () => {
    // Show detailed analytics or open a modal
    // For now, we'll just scroll to the payment overview
    const paymentOverview = document.getElementById('payment-overview');
    if (paymentOverview) {
      paymentOverview.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
      <FolioHeader 
        onAddCharge={() => setShowChargeModal(true)}
        onProcessPayment={() => setShowPaymentModal(true)}
      />

        {/* Stats */}
        <FolioStats 
          totalFolios={folioStats.totalFolios}
          openFolios={folioStats.openFolios}
          totalOutstanding={folioStats.totalOutstanding}
          totalCharges={folioStats.totalCharges}
        />

        {/* Service Payment Categories */}
      <ServiceCategories 
        stays={stays} 
        orders={orders}
        onViewStays={handleViewStays}
        onViewOrders={handleViewOrders}
        onViewPayments={handleViewPayments}
        onViewDetails={handleViewDetails}
      />

        {/* Payment Methods Overview */}
      <div id="payment-overview">
        <PaymentOverview stays={stays} orders={orders} />
        </div>

        {/* Search and Filters */}
      <FolioSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

        {/* Folios Table */}
      <div id="folios-table">
        <FolioTable 
          folios={filteredFolios}
          onViewFolio={setSelectedFolio}
        />
              </div>
              
      {/* Modals */}
      <FolioModals 
        selectedFolio={selectedFolio}
        showPaymentModal={showPaymentModal}
        showChargeModal={showChargeModal}
        onCloseFolio={() => setSelectedFolio(null)}
        onClosePaymentModal={() => setShowPaymentModal(false)}
        onCloseChargeModal={() => setShowChargeModal(false)}
      />
      </div>
    
  );
}
