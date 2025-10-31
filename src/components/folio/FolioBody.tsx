'use client';

import { useState, useMemo } from 'react';
import FolioStats from '@/components/folio/FolioStats';
import FolioTable from '@/components/folio/FolioTable';
import FolioHeader from '@/components/folio/FolioHeader';
import ServiceCategories from '@/components/folio/ServiceCategories';
import PaymentOverview from '@/components/folio/PaymentOverview';
import FolioSearch from '@/components/folio/FolioSearch';
import FolioModals from '@/components/folio/FolioModals';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { StayStatus, PaymentStatus } from '@/utils/enum';
import { OrderStatus } from '@/lib/server/order/enum';
import { PaymentMethod } from '@/utils/enum';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/helper';

interface FolioBodyProps {
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onRefetch?: () => void;
  isLoading?: boolean;
}

export default function FolioBody({ 
  selectedPeriod: externalPeriod,
  onPeriodChange,
  onRefetch,
  isLoading: externalIsLoading
}: FolioBodyProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolio, setSelectedFolio] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(externalPeriod || '30d');
  const router = useRouter();
  
  // Use analytics slice from Redux (same as accounting/analytics pages)
  const analytics = useSelector((state: RootState) => state.analytics);
  const hotel = useSelector((state: RootState) => state.hotel);
  const { stays, orders, scheduledServices } = analytics;
  
  // Get selected hotel and currency
  const selectedHotel = hotel.hotels?.find(h => h._id === hotel.selectedHotelId);
  const currency = selectedHotel?.currency || 'USD';

  // Transform stays, orders, and scheduled services to unified folio format
  const folios = useMemo(() => {
    const allFolios: any[] = [];

    // Transform stays data to folio format
    stays.forEach((stay) => {
      const totalAmount = stay.totalAmount || 0;
      const paidAmount = stay.paidAmount || 0;
      const balance = totalAmount - paidAmount;
      
      allFolios.push({
        id: stay._id,
        type: 'stay' as const,
        guest: stay.guestName,
        room: stay.roomId?.roomNumber || 'N/A',
        checkIn: stay.checkInDate,
        checkOut: stay.checkOutDate,
        totalCharges: totalAmount,
        totalPayments: paidAmount,
        balance: balance,
        status: stay.status,
        lastActivity: stay.checkInDate || stay.checkOutDate ? new Date(stay.checkInDate || stay.checkOutDate).toLocaleString() : 'N/A',
        paymentStatus: stay.paymentStatus,
        paymentMethod: stay.paymentMethod,
        email: stay.emailAddress,
        phone: stay.phoneNumber,
        address: stay.address,
        adults: stay.adults,
        children: stay.children,
        specialRequests: stay.specialRequests,
        originalData: stay
      });
    });

    // Transform orders data to folio format
    orders.forEach((order: any) => {
      const orderTotal = order.items?.reduce((sum: number, item: any) => 
        sum + ((item.priceWhenOrdered || 0) * (item.quantity || 1)), 0) || 0;
      const paidAmount = order.status === OrderStatus.PAID ? orderTotal - (order.discount || 0) : 0;
      const balance = orderTotal - (order.discount || 0) - paidAmount;
      
      const itemNames = order.items?.map((item: any) => item.menuId?.itemName || 'Item').slice(0, 2).join(', ') || 'Order items';
      const moreItems = order.items?.length > 2 ? ` +${order.items.length - 2} more` : '';
      
      allFolios.push({
        id: order._id,
        type: 'order' as const,
        guest: `Order #${order._id.slice(-6)}`,
        room: order.tableNumber ? `Table ${order.tableNumber}` : order.roomId || 'N/A',
        checkIn: order.createdAt,
        checkOut: order.createdAt,
        totalCharges: orderTotal - (order.discount || 0),
        totalPayments: paidAmount,
        balance: balance,
        status: order.status,
        lastActivity: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A',
        paymentStatus: order.status === OrderStatus.PAID ? PaymentStatus.PAID : PaymentStatus.PENDING,
        paymentMethod: order.paymentMethod,
        orderItems: itemNames + moreItems,
        orderType: order.orderType,
        originalData: order
      });
    });

    // Transform scheduled services data to folio format
    scheduledServices.forEach((service: any) => {
      const totalAmount = service.totalAmount || 0;
      const paidAmount = service.paymentStatus === PaymentStatus.PAID ? totalAmount : 0;
      const balance = totalAmount - paidAmount;
      
      allFolios.push({
        id: service._id,
        type: 'service' as const,
        guest: service.hotelServiceId?.name || 'Scheduled Service',
        room: service.hotelServiceId?.location || 'N/A',
        checkIn: service.scheduledAt,
        checkOut: service.scheduledAt,
        totalCharges: totalAmount,
        totalPayments: paidAmount,
        balance: balance,
        status: service.paymentStatus === PaymentStatus.PAID ? 'paid' : 'pending',
        lastActivity: service.scheduledAt ? new Date(service.scheduledAt).toLocaleString() : 'N/A',
        paymentStatus: service.paymentStatus,
        paymentMethod: service.paymentMethod,
        serviceCategory: service.hotelServiceId?.category?.replace('_', ' ') || 'Service',
        serviceNote: service.note,
        originalData: service
      });
    });

    // Sort by last activity (most recent first)
    return allFolios.sort((a, b) => {
      const dateA = new Date(a.checkIn || a.lastActivity).getTime();
      const dateB = new Date(b.checkIn || b.lastActivity).getTime();
      return dateB - dateA;
    });
  }, [stays, orders, scheduledServices]);

  const filteredFolios = [...folios].filter(folio =>
    folio.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    folio.room.includes(searchTerm) ||
    folio.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats from actual data (includes stays, orders, and scheduled services)
  const folioStats = useMemo(() => {
    return {
      totalFolios: folios.length,
      openFolios: folios.filter(f => {
        // Open folios are items with balance > 0 or pending status
        if (f.type === 'stay') {
          return f.status === StayStatus.CHECKED_IN || f.status === StayStatus.CONFIRMED || f.balance > 0;
        }
        if (f.type === 'order') {
          return f.status !== OrderStatus.PAID && f.status !== OrderStatus.CANCELLED;
        }
        if (f.type === 'service') {
          return f.paymentStatus !== PaymentStatus.PAID && f.paymentStatus !== PaymentStatus.CANCELLED;
        }
        return f.balance > 0;
      }).length,
      totalOutstanding: folios.reduce((sum, folio) => sum + (folio.balance > 0 ? folio.balance : 0), 0),
      totalCharges: folios.reduce((sum, folio) => sum + folio.totalCharges, 0)
    };
  }, [folios]);

  // Revenue Calculation (matching AccountingBody logic)
  const revenues = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Room revenue from stays
    // Only count stays where ALL conditions are met:
    // 1. checkInDate is in the past (guest has already checked in)
    // 2. Current date is within checkInDate and checkOutDate (active stay period)
    // 3. paymentStatus is PAID (only paid stays count as revenue)
    const stayRevenue = stays.length > 0 ? stays.reduce((sum: number, stay: any) => {
      const checkInDate = stay.checkInDate ? new Date(stay.checkInDate) : null;
      const checkOutDate = stay.checkOutDate ? new Date(stay.checkOutDate) : null;
      
      if (!checkInDate || !checkOutDate) return sum;
      
      const checkIn = new Date(checkInDate);
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(checkOutDate);
      checkOut.setHours(0, 0, 0, 0);
      
      const isCheckInPast = checkIn <= today;
      const isTodayWithinStayPeriod = today >= checkIn && today <= checkOut;
      const isPaid = stay.paymentStatus === PaymentStatus.PAID;
      
      if (isCheckInPast && isTodayWithinStayPeriod && isPaid) {
        return sum + (stay.totalAmount || 0);
      }
      
      return sum;
    }, 0) : 0;

    // F&B revenue from orders
    // Only count orders with status = PAID (pending orders cannot be counted as revenue)
    const orderRevenue = orders.length > 0 ? orders.reduce((sum: number, order: any) => {
      if (order.status !== OrderStatus.PAID) return sum;
      
      const orderTotal = order.items?.reduce((itemSum: number, item: any) => {
        return itemSum + ((item.priceWhenOrdered || 0) * (item.quantity || 1));
      }, 0) || 0;
      
      return sum + orderTotal - (order.discount || 0);
    }, 0) : 0;

    // Scheduled services revenue
    // Include paid or pending services (they are bookings within the period)
    const scheduledServicesRevenue = scheduledServices.length > 0 ? scheduledServices.reduce((sum: number, scheduledService: any) => {
      // Include paid or pending services
      if (scheduledService.paymentStatus !== PaymentStatus.PAID && scheduledService.paymentStatus !== PaymentStatus.PENDING) {
        return sum;
      }
      
      // Count the total amount (all scheduled services in period that are paid/pending)
      return sum + (scheduledService.totalAmount || 0);
    }, 0) : 0;

    return {
      stayRevenue,
      orderRevenue,
      scheduledServicesRevenue,
      totalRevenue: stayRevenue + orderRevenue + scheduledServicesRevenue
    };
  }, [stays, orders, scheduledServices]);

  const { stayRevenue, orderRevenue, scheduledServicesRevenue, totalRevenue } = revenues;

  // Navigation handlers
  const handleViewStays = () => {
    router.push('/stays');
  };

  const handleViewOrders = () => {
    router.push('/pos');
  };

  const handleViewServices = () => {
    router.push('/services');
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

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
      <FolioHeader 
        onAddCharge={() => setShowChargeModal(true)}
        onProcessPayment={() => setShowPaymentModal(true)}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onRefetch={onRefetch}
        isLoading={externalIsLoading}
      />

        {/* Stats */}
        <FolioStats 
          totalFolios={folioStats.totalFolios}
          openFolios={folioStats.openFolios}
          totalOutstanding={folioStats.totalOutstanding}
          totalCharges={folioStats.totalCharges}
          currency={currency}
        />

        {/* Revenue Summary - Accounting Dashboard Style */}
      <section className="my-6 w-full">
        <div className="flex flex-col md:flex-row md:space-x-8 w-full">
          {/* Total Revenue Card */}
          <div className="flex flex-col justify-center items-center bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 rounded-2xl border border-indigo-200 shadow-md px-8 py-6 mb-5 md:mb-0 flex-1">
            <div className="flex items-center mb-3">
              <svg className="w-10 h-10 text-indigo-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.104 0-2 .895-2 2s.896 2 2 2 2-.895 2-2-.896-2-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20C7.03 20 2 17.52 2 15c0-1.38 2.07-2.5 5.18-3.05A6.97 6.97 0 0112 5c1.91 0 3.63.76 4.82 2C19.93 8.5 22 9.62 22 11c0 2.52-5.03 5-10 5z" />
              </svg>
              <span className="text-xl md:text-2xl font-bold text-indigo-800 tracking-wide">Total Revenue</span>
            </div>
            <span className="text-3xl md:text-4xl text-indigo-700 font-extrabold tracking-tight ml-0">{formatPrice(totalRevenue, currency)}</span>
            <span className="text-sm text-gray-400 mt-1">Current period: all paid stays/orders/services included</span>
          </div>

          {/* Stays, Orders & Services Subcards */}
          <div className="flex flex-row flex-1 justify-evenly space-x-4">
            {/* Stays Revenue */}
            <div className="flex flex-col items-center bg-white/90 shadow rounded-xl border border-green-100 px-6 py-4 w-48">
              <svg className="w-7 h-7 text-green-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v11a1 1 0 001 1h16a1 1 0 001-1V10M16 3v7M8 3v7m.35 6a3.25 3.25 0 006.3 0M12 17v1.5" />
              </svg>
              <span className="text-base font-medium text-green-700">Stays</span>
              <span className="text-xl font-semibold text-green-800 mt-1">{formatPrice(stayRevenue, currency)}</span>
            </div>
            {/* Orders Revenue */}
            <div className="flex flex-col items-center bg-white/90 shadow rounded-xl border border-yellow-100 px-6 py-4 w-48">
              <svg className="w-7 h-7 text-yellow-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l1 8a1 1 0 001 1h10a1 1 0 001-1l1-8M3 7a2 2 0 012-2h14a2 2 0 012 2v2H3V7zM16 11V7M8 11V7" />
              </svg>
              <span className="text-base font-medium text-yellow-700">Orders</span>
              <span className="text-xl font-semibold text-yellow-800 mt-1">{formatPrice(orderRevenue, currency)}</span>
            </div>
            {/* Scheduled Services Revenue */}
            <div className="flex flex-col items-center bg-white/90 shadow rounded-xl border border-indigo-100 px-6 py-4 w-48">
              <svg className="w-7 h-7 text-indigo-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-base font-medium text-indigo-700">Services</span>
              <span className="text-xl font-semibold text-indigo-800 mt-1">{formatPrice(scheduledServicesRevenue, currency)}</span>
            </div>
          </div>
        </div>
      </section>

        {/* Service Payment Categories */}
      <ServiceCategories 
        stays={stays} 
        orders={orders}
        scheduledServices={scheduledServices}
        currency={currency}
        scheduledServicesRevenue={scheduledServicesRevenue}
        onViewStays={handleViewStays}
        onViewOrders={handleViewOrders}
        onViewPayments={handleViewPayments}
        onViewDetails={handleViewDetails}
        onViewServices={handleViewServices}
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
          currency={currency}
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
        currency={currency}
      />
      </div>
    
  );
}
