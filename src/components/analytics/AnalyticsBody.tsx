'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatPrice } from '@/helper';
import { PaymentStatus } from '@/utils/enum';
import { OrderStatus } from '@/lib/server/order/enum';

// Import component sections
import AnalyticsHeader from './AnalyticsHeader';
import KPICards from './KPICards';
import StatsSummary from './StatsSummary';
import RevenueChart from './RevenueChart';
import DemographicsChart from './DemographicsChart';
import MetricsGrid from './MetricsGrid';
import RoomStatusChart from './RoomStatusChart';
import RecentActivity from './RecentActivity';
import BookingsBreakdown from './BookingsBreakdown';

// Import modals
import ExportModal from './modals/ExportModal';
import RefreshModal from './modals/RefreshModal';
import FiltersModal from './modals/FiltersModal';

interface AnalyticsBodyProps {
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onRefetch?: () => void;
  isLoading?: boolean;
}

export default function AnalyticsBody({ 
  selectedPeriod = '30d',
  onPeriodChange,
  onRefetch,
  isLoading = false
}: AnalyticsBodyProps) {
  const [isClient, setIsClient] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Get Redux state - only from analytics slice and hotel for currency
  const analytics = useSelector((state: RootState) => state.analytics);
  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);

  // Form states
  const [exportForm, setExportForm] = useState({
    reportType: 'comprehensive',
    format: 'pdf',
    includeDetails: true
  });

  const [refreshForm, setRefreshForm] = useState({
    dataSource: 'all',
    refreshType: 'full',
    includeRealTime: true
  });

  const [filtersForm, setFiltersForm] = useState({
    dateRange: '30d',
    roomTypes: [] as string[],
    revenueRange: { min: 0, max: 1000000 },
    occupancyRange: { min: 0, max: 100 },
    guestSegments: [] as string[],
    channels: [] as string[]
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate analytics data from analytics Redux state
  const { stays, orders, scheduledServices, hotelRooms } = analytics;

  // Calculate room revenue from stays
  // Calculate revenue based on full stay duration (checkInDate to checkOutDate)
  // Only count stays where paymentStatus is PAID (only paid stays count as revenue)
  // Revenue = number of nights × room rate (matching backend calculation)
  const totalRevenueFromStays = useMemo(() => {
    return stays.reduce((sum, stay) => {
      // Check if stay should be included in revenue
      const checkInDate = stay.checkInDate ? new Date(stay.checkInDate) : null;
      const checkOutDate = stay.checkOutDate ? new Date(stay.checkOutDate) : null;
      
      if (!checkInDate || !checkOutDate) return sum;
      
      // Check if payment status is PAID - only paid stays count as revenue
      const isPaid = stay.paymentStatus === PaymentStatus.PAID;
      
      if (!isPaid) return sum;
      
      // Calculate number of nights between checkInDate and checkOutDate
      const checkIn = new Date(checkInDate);
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(checkOutDate);
      checkOut.setHours(0, 0, 0, 0);
      
      // Calculate nights (minimum 1 night)
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const numberOfNights = Math.max(1, diffDays);
      
      // Get room rate - prefer roomRateAtPayment if available
      let roomRate = stay.roomRateAtPayment || 0;
      
      // If still no rate, use totalAmount / numberOfNights as fallback
      if (!roomRate && stay.totalAmount && numberOfNights > 0) {
        roomRate = stay.totalAmount / numberOfNights;
      }
      
      // Calculate revenue: nights × room rate
      // Use totalAmount if available and valid, otherwise calculate based on nights × rate
      const revenue = stay.totalAmount && stay.totalAmount > 0 && numberOfNights > 0
        ? stay.totalAmount
        : roomRate * numberOfNights;
      
      return sum + revenue;
    }, 0);
  }, [stays]);

  // Calculate F&B revenue from orders
  // Only count orders with status = PAID (pending orders cannot be counted as revenue)
  const totalRevenueFromOrders = useMemo(() => {
    return orders.reduce((sum, order) => {
      // Only include PAID orders - pending/ready/cancelled orders don't count as revenue
      if (order.status !== OrderStatus.PAID) return sum;
      
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (item.priceWhenOrdered * item.quantity);
      }, 0);
      return sum + orderTotal - (order.discount || 0);
    }, 0);
  }, [orders]);

  // Calculate scheduled services revenue
  // Include paid or pending services (they are bookings within the period)
  const totalRevenueFromScheduledServices = useMemo(() => {
    return scheduledServices.reduce((sum, scheduledService) => {
      // Include paid or pending services
      // - Paid: Already collected revenue
      // - Pending: Booked but not yet paid (still counts as revenue for accounting purposes)
      if (scheduledService.paymentStatus !== PaymentStatus.PAID && scheduledService.paymentStatus !== PaymentStatus.PENDING) {
        return sum;
      }
      
      // Count the total amount (all scheduled services in period that are paid/pending)
      return sum + (scheduledService.totalAmount || 0);
    }, 0);
  }, [scheduledServices]);

  // Total revenue (room + F&B + scheduled services)
  const totalRevenue = useMemo(() => 
    totalRevenueFromStays + totalRevenueFromOrders + totalRevenueFromScheduledServices,
    [totalRevenueFromStays, totalRevenueFromOrders, totalRevenueFromScheduledServices]
  );

  // Filter stays that are checked in or completed (for analytics)
  const activeStays = stays.filter(stay => 
    stay.status === 'checked_in' || stay.status === 'checked_out'
  );

  // Calculate total bookings with status breakdown
  const totalBookings = stays.length;
  
  // Status breakdown for better analytics visibility
  const bookingsByStatus = useMemo(() => {
    return {
      confirmed: stays.filter(s => s.status === 'confirmed').length,
      checkedIn: stays.filter(s => s.status === 'checked_in').length,
      checkedOut: stays.filter(s => s.status === 'checked_out').length,
      cancelled: stays.filter(s => s.status === 'cancelled').length,
    };
  }, [stays]);

  // Calculate average stay duration (only for checked in or completed stays)
  const averageStay = useMemo(() => {
    if (activeStays.length === 0) return 0;
    const totalNights = activeStays.reduce((sum, stay) => {
      const checkIn = new Date(stay.checkInDate);
      const checkOut = new Date(stay.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
    return totalNights / activeStays.length;
  }, [activeStays]);

  // Calculate room statistics
  const totalRooms = hotelRooms.length;
  const availableRooms = hotelRooms.filter(room => room.roomStatus === 'available').length;
  const occupiedRooms = hotelRooms.filter(room => room.roomStatus === 'occupied').length;
  const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0.0';
  
  // Calculate monthly revenue from stays
  // Revenue = number of nights × room rate for paid stays (based on full stay duration)
  const monthlyRevenue = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Get last 6 months
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      
      // Calculate revenue for this month - only paid stays, based on full stay duration
      const monthRevenue = stays
        .filter(stay => {
          // Filter by check-in date month and payment status
          const checkInDate = stay.checkInDate ? new Date(stay.checkInDate) : null;
          if (!checkInDate) return false;
          return checkInDate.getMonth() === monthIndex && stay.paymentStatus === PaymentStatus.PAID;
        })
        .reduce((sum, stay) => {
          const checkInDate = stay.checkInDate ? new Date(stay.checkInDate) : null;
          const checkOutDate = stay.checkOutDate ? new Date(stay.checkOutDate) : null;
          
          if (!checkInDate || !checkOutDate) return sum;
          
          // Calculate number of nights
          const checkIn = new Date(checkInDate);
          checkIn.setHours(0, 0, 0, 0);
          const checkOut = new Date(checkOutDate);
          checkOut.setHours(0, 0, 0, 0);
          
          const diffTime = checkOut.getTime() - checkIn.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const numberOfNights = Math.max(1, diffDays);
          
          // Get room rate
          let roomRate = stay.roomRateAtPayment || 0;
          if (!roomRate && stay.totalAmount && numberOfNights > 0) {
            roomRate = stay.totalAmount / numberOfNights;
          }
          
          // Calculate revenue: nights × room rate
          const revenue = stay.totalAmount && stay.totalAmount > 0 && numberOfNights > 0
            ? stay.totalAmount
            : roomRate * numberOfNights;
          
          return sum + revenue;
        }, 0);
      
      // Count bookings for this month (all stays, not just paid)
      const monthBookings = stays.filter(stay => {
        const checkInDate = stay.checkInDate ? new Date(stay.checkInDate) : null;
        if (!checkInDate) return false;
        return checkInDate.getMonth() === monthIndex;
      }).length;
      
      last6Months.push({
        month: monthName,
        revenue: monthRevenue,
        bookings: monthBookings
      });
    }
    
    return last6Months;
  }, [stays]);

  // Calculate guest demographics from stays data
  const guestDemographics = useMemo(() => {
    let totalAdults = 0;
    let totalChildren = 0;
    let totalGuests = 0;
    
    stays.forEach(stay => {
      totalAdults += stay.adults || 0;
      totalChildren += stay.children || 0;
      totalGuests += (stay.adults || 0) + (stay.children || 0);
    });
    
    return {
      totalAdults,
      totalChildren,
      totalGuests,
      adultPercentage: totalGuests > 0 ? ((totalAdults / totalGuests) * 100).toFixed(1) : '0',
      childrenPercentage: totalGuests > 0 ? ((totalChildren / totalGuests) * 100).toFixed(1) : '0',
    };
  }, [stays]);

  // Calculate top performing metrics from Redux data
  const topMetrics = useMemo(() => {
    // Calculate ADR (Average Daily Rate)
    const adr = totalBookings > 0 && averageStay > 0 
      ? totalRevenueFromStays / (totalBookings * averageStay)
      : 0;
    
    // Calculate RevPAR (Revenue per Available Room)
    const revpar = totalRooms > 0 
      ? totalRevenueFromStays / totalRooms
      : 0;
    
    // Calculate average order value from orders
    const avgOrderValue = orders.length > 0
      ? orders.reduce((sum, order) => {
          const orderTotal = order.items.reduce((itemSum, item) => 
            itemSum + (item.priceWhenOrdered * item.quantity), 0
          );
          return sum + orderTotal;
        }, 0) / orders.length
      : 0;
    
    return [
      { 
        name: 'ADR (Average Daily Rate)', 
        value: formatPrice(adr, selectedHotel?.currency), 
        change: '', 
        trend: 'up' as const 
      },
      { 
        name: 'RevPAR (Revenue per Available Room)', 
        value: formatPrice(revpar, selectedHotel?.currency), 
        change: '', 
        trend: 'up' as const 
      },
      { 
        name: 'Occupancy Rate', 
        value: `${occupancyRate}%`, 
        change: '', 
        trend: 'up' as const 
      },
      { 
        name: 'Avg Order Value', 
        value: formatPrice(avgOrderValue, selectedHotel?.currency), 
        change: '', 
        trend: 'up' as const 
      }
    ];
  }, [totalRevenueFromStays, totalBookings, averageStay, totalRooms, occupancyRate, orders, selectedHotel?.currency]);

  // Form handlers
  const handleExportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare export data
      const exportData = {
        stays,
        orders,
        hotelRooms,
        totalRevenue,
        totalBookings,
        averageStay,
        occupancyRate,
        monthlyRevenue,
        guestDemographics,
        topMetrics,
        period: selectedPeriod,
        exportDate: new Date().toISOString(),
        hotel: selectedHotel?.hotelName,
        currency: selectedHotel?.currency,
      };

      if (exportForm.format === 'pdf') {
        // Convert to PDF (simple text-based export)
        const content = generatePDFContent(exportData, exportForm);
        downloadTextFile(content, 'analytics-report.txt');
      } else if (exportForm.format === 'excel' || exportForm.format === 'csv') {
        // CSV export
        const csvContent = generateCSVContent(exportData, exportForm);
        downloadTextFile(csvContent, `analytics-report-${new Date().getTime()}.csv`);
      } else if (exportForm.format === 'json') {
        // JSON export
        const jsonContent = JSON.stringify(exportData, null, 2);
        downloadTextFile(jsonContent, `analytics-report-${new Date().getTime()}.json`);
      }

      // Close modal and reset form
      setShowExportModal(false);
      setExportForm({
        reportType: 'comprehensive',
        format: 'pdf',
        includeDetails: true
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Helper function to generate PDF content based on report type
  const generatePDFContent = (data: any, form: any) => {
    const reportType = form.reportType || 'comprehensive';
    const showDetails = form.includeDetails;
    
    let content = `${reportType.toUpperCase()} ANALYTICS REPORT\n`;
    content += '='.repeat(60) + '\n\n';
    content += `Hotel: ${data.hotel}\n`;
    content += `Period: ${data.period}\n`;
    content += `Export Date: ${new Date(data.exportDate).toLocaleString()}\n`;
    content += '\n' + '='.repeat(60) + '\n\n';
    
    // Generate content based on report type
    if (reportType === 'revenue' || reportType === 'comprehensive') {
      content += 'REVENUE ANALYSIS\n';
      content += '-'.repeat(60) + '\n';
      content += `Total Revenue: ${formatPrice(data.totalRevenue, data.currency)}\n`;
      if (showDetails && data.monthlyRevenue) {
        content += '\nMonthly Revenue Breakdown:\n';
        data.monthlyRevenue.forEach((month: any) => {
          content += `  ${month.month}: ${formatPrice(month.revenue, data.currency)} (${month.bookings} bookings)\n`;
        });
      }
      content += '\n';
    }
    
    if (reportType === 'occupancy' || reportType === 'comprehensive') {
      content += 'OCCUPANCY METRICS\n';
      content += '-'.repeat(60) + '\n';
      content += `Occupancy Rate: ${data.occupancyRate}%\n`;
      content += `Total Rooms: ${data.hotelRooms.length}\n`;
      if (showDetails) {
        const availableRooms = data.hotelRooms.filter((r: any) => r.roomStatus === 'available').length;
        const occupiedRooms = data.hotelRooms.filter((r: any) => r.roomStatus === 'occupied').length;
        content += `  Available: ${availableRooms}\n`;
        content += `  Occupied: ${occupiedRooms}\n`;
      }
      content += '\n';
    }
    
    if (reportType === 'guest' || reportType === 'comprehensive') {
      content += 'GUEST ANALYTICS\n';
      content += '-'.repeat(60) + '\n';
      content += `Total Guests: ${data.guestDemographics.totalGuests}\n`;
      if (showDetails && data.guestDemographics) {
        content += `  Adults: ${data.guestDemographics.totalAdults} (${data.guestDemographics.adultPercentage}%)\n`;
        content += `  Children: ${data.guestDemographics.totalChildren} (${data.guestDemographics.childrenPercentage}%)\n`;
      }
      content += '\n';
    }
    
    if (reportType === 'performance' || reportType === 'comprehensive') {
      content += 'PERFORMANCE METRICS\n';
      content += '-'.repeat(60) + '\n';
      content += `Total Bookings: ${data.totalBookings}\n`;
      content += `Average Stay: ${data.averageStay.toFixed(1)} nights\n`;
      content += `Total Orders: ${data.orders.length}\n`;
      if (showDetails && data.topMetrics) {
        content += '\nAdvanced Metrics:\n';
        data.topMetrics.forEach((metric: any) => {
          content += `  ${metric.name}: ${metric.value}\n`;
        });
      }
      content += '\n';
    }
    
    return content;
  };

  // Helper function to generate CSV content based on report type
  const generateCSVContent = (data: any, form: any) => {
    const reportType = form.reportType || 'comprehensive';
    let csv = 'Metric,Value\n';
    
    if (reportType === 'revenue' || reportType === 'comprehensive') {
      csv += `Total Revenue,${data.totalRevenue}\n`;
    }
    if (reportType === 'performance' || reportType === 'comprehensive') {
      csv += `Total Bookings,${data.totalBookings}\n`;
      csv += `Average Stay,${data.averageStay}\n`;
      csv += `Total Orders,${data.orders.length}\n`;
    }
    if (reportType === 'occupancy' || reportType === 'comprehensive') {
      csv += `Occupancy Rate,${data.occupancyRate}\n`;
    }
    if (reportType === 'guest' || reportType === 'comprehensive') {
      csv += `Total Guests,${data.guestDemographics.totalGuests}\n`;
    }
    
    return csv;
  };

  // Helper function to download text file
  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefreshSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Refreshing data:', refreshForm);
    setShowRefreshModal(false);
    setRefreshForm({
      dataSource: 'all',
      refreshType: 'full',
      includeRealTime: true
    });
  };

  const handleFiltersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Applying filters:', filtersForm);
    setShowFiltersModal(false);
    setFiltersForm({
      dateRange: '30d',
      roomTypes: [] as string[],
      revenueRange: { min: 0, max: 1000000 },
      occupancyRange: { min: 0, max: 100 },
      guestSegments: [] as string[],
      channels: [] as string[]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnalyticsHeader
        onExportClick={() => setShowExportModal(true)}
        onRefreshClick={onRefetch || (() => {})}
        onFiltersClick={() => setShowFiltersModal(true)}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
        onApplyFilter={onRefetch}
        isLoading={isLoading}
      />

      {/* Key Performance Indicators */}
      <KPICards
        totalRevenue={totalRevenue}
        totalBookings={totalBookings}
        averageStay={averageStay}
        occupancyRate={Number(occupancyRate)}
        currency={selectedHotel?.currency}
      />

      {/* Additional Statistics */}
      <StatsSummary
        stays={stays}
        orders={orders}
        scheduledServices={scheduledServices}
        currency={selectedHotel?.currency}
      />

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          selectedPeriod={selectedPeriod}
          monthlyRevenue={monthlyRevenue}
          currency={selectedHotel?.currency}
        />
        <DemographicsChart demographics={guestDemographics} />
      </div>

      {/* Bookings Status Breakdown */}
      <BookingsBreakdown 
        bookingsByStatus={bookingsByStatus}
        currency={selectedHotel?.currency}
      />

      {/* Performance Metrics */}
      <MetricsGrid metrics={topMetrics} />

      {/* Room Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoomStatusChart
          availableRooms={availableRooms}
          totalRooms={totalRooms}
        />
        <RecentActivity
          stays={stays}
          orders={orders}
          scheduledServices={scheduledServices}
          isClient={isClient}
          currency={selectedHotel?.currency}
        />
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        formData={exportForm}
        onFormChange={(field, value) => setExportForm({ ...exportForm, [field]: value })}
        onSubmit={handleExportSubmit}
      />

      <RefreshModal
        isOpen={showRefreshModal}
        onClose={() => setShowRefreshModal(false)}
        formData={refreshForm}
        onFormChange={(field, value) => setRefreshForm({ ...refreshForm, [field]: value })}
        onSubmit={handleRefreshSubmit}
        totalBookings={totalBookings}
        totalRooms={totalRooms}
        isClient={isClient}
      />

      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        formData={filtersForm}
        onFormChange={(field, value) => setFiltersForm({ ...filtersForm, [field]: value })}
        onSubmit={handleFiltersSubmit}
      />
    </div>
  );
}
