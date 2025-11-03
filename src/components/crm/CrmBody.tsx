'use client';

import { RootState } from "@/store";
import { useSelector } from "react-redux";
import FeatureGuard from "@/components/auth/FeatureGuard";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Bed,
  DollarSign,
  Activity,
  UserCheck,
  UserX,
  CalendarDays,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Download,
  Eye,
  MessageSquare,
  Heart,
  Award,
  X
} from "lucide-react";
import { formatPrice } from "@/helper";
import { StayStatus } from "@/utils/enum";
import { useState } from "react";

export default function CRMBody() {
     const stay = useSelector((state: RootState) => state.stay);
  const hotel = useSelector((state: RootState) => state.hotel);
     const { stays } = stay;

  // State for confirmation dialog
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactInfo, setContactInfo] = useState<{
    type: 'email' | 'phone';
    value: string;
    guestName: string;
  } | null>(null);
  
  // State for guest details modal
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  
  // Get selected hotel and currency
  const selectedHotel = hotel.hotels?.find(h => h._id === hotel.selectedHotelId);
  const currency = selectedHotel?.currency || 'USD';

  // Calculate CRM metrics
  const totalGuests = stays.length;
  const activeStays = stays.filter(stay => 
    stay.status === StayStatus.CHECKED_IN || stay.status === StayStatus.CONFIRMED
  ).length;
  const completedStays = stays.filter(stay => 
    stay.status === StayStatus.CHECKED_OUT
  ).length;
  const totalRevenue = stays.reduce((sum, stay) => sum + (stay.totalAmount || 0), 0);
  const averageStayDuration = stays.length > 0 
    ? stays.reduce((sum, stay) => {
        const checkIn = new Date(stay.checkInDate);
        const checkOut = new Date(stay.checkOutDate);
        return sum + (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / stays.length 
    : 0;

  // Guest demographics
  const guestStaysMap = new Map<string, number>();
  stays.forEach(stay => {
    if (stay.emailAddress) {
      guestStaysMap.set(stay.emailAddress, (guestStaysMap.get(stay.emailAddress) || 0) + 1);
    }
  });
  
  const uniqueGuests = guestStaysMap.size;
  const newGuests = Array.from(guestStaysMap.values()).filter(count => count === 1).length;
  const repeatGuestsCount = uniqueGuests - newGuests;
  const repeatGuestRate = uniqueGuests > 0 ? (repeatGuestsCount / uniqueGuests) * 100 : 0;
  const newGuestRate = uniqueGuests > 0 ? (newGuests / uniqueGuests) * 100 : 0;

  // Recent stays (last 7 days)
  const recentStays = stays.filter(stay => {
    const stayDate = new Date(stay.checkInDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return stayDate >= weekAgo;
  });

  // Top performing guests by revenue
  const guestRevenue = stays.reduce((acc, stay) => {
    const email = stay.emailAddress;
    if (!email) return acc; // Skip stays without email
    
    if (!acc[email]) {
      acc[email] = {
        name: stay.guestName,
        email: email,
        phone: stay.phoneNumber,
        totalSpent: 0,
        stays: 0,
        lastStay: stay.checkInDate
      };
    }
    acc[email].totalSpent += stay.totalAmount || 0;
    acc[email].stays += 1;
    if (new Date(stay.checkInDate) > new Date(acc[email].lastStay)) {
      acc[email].lastStay = stay.checkInDate;
    }
    return acc;
  }, {} as Record<string, any>);

  const topGuests = Object.values(guestRevenue)
    .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // Contact handlers
  const handleEmailClick = (email: string, guestName: string) => {
    setContactInfo({
      type: 'email',
      value: email,
      guestName: guestName
    });
    setShowContactDialog(true);
  };

  const handlePhoneClick = (phone: string, guestName: string) => {
    setContactInfo({
      type: 'phone',
      value: phone,
      guestName: guestName
    });
    setShowContactDialog(true);
  };

  const handleConfirmContact = () => {
    if (!contactInfo) return;
    
    if (contactInfo.type === 'email') {
      window.open(`mailto:${contactInfo.value}`, '_blank');
    } else if (contactInfo.type === 'phone') {
      window.open(`tel:${contactInfo.value}`, '_blank');
    }
    
    setShowContactDialog(false);
    setContactInfo(null);
  };

  const handleCancelContact = () => {
    setShowContactDialog(false);
    setContactInfo(null);
  };

  const handleViewGuest = (guest: any) => {
    try {
      // Get all stays for this guest
      const guestStays = stays.filter(stay => stay.emailAddress === guest.email);
      
      // Ensure guest has all required properties
      const guestData = {
        name: guest.name || 'Unknown Guest',
        email: guest.email || '',
        phone: guest.phone || '',
        totalSpent: guest.totalSpent || 0,
        stayCount: guest.stays || 0,
        lastStay: guest.lastStay || new Date().toISOString(),
        stays: guestStays
      };
      
      setSelectedGuest(guestData);
      setShowGuestDetails(true);
    } catch (error) {
      console.error('Error opening guest details:', error);
      // Fallback: still open modal with basic data
      setSelectedGuest({
        name: guest.name || 'Unknown Guest',
        email: guest.email || '',
        phone: guest.phone || '',
        totalSpent: guest.totalSpent || 0,
        stayCount: guest.stays || 0,
        lastStay: guest.lastStay || new Date().toISOString(),
        stays: []
      });
      setShowGuestDetails(true);
    }
  };

  const handleCloseGuestDetails = () => {
    setShowGuestDetails(false);
    setSelectedGuest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Customer Relationship Management</h1>
          <p className="text-secondary-600">Manage guest relationships and analyze customer data</p>
        </div>
        {/* <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button className="btn-primary flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
        </div> */}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Guests</p>
              <p className="text-2xl font-bold text-secondary-900">{totalGuests}</p>
              <p className="text-xs text-secondary-500">{uniqueGuests} unique guests</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Active Stays</p>
              <p className="text-2xl font-bold text-secondary-900">{activeStays}</p>
              <p className="text-xs text-secondary-500">{completedStays} completed</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Bed className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <FeatureGuard permission="financials.view_revenue">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">{formatPrice(totalRevenue, currency)}</p>
                <p className="text-xs text-secondary-500">From all stays</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </FeatureGuard>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Avg. Stay Duration</p>
              <p className="text-2xl font-bold text-secondary-900">{averageStayDuration.toFixed(1)} days</p>
              <p className="text-xs text-secondary-500">Per guest</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <CalendarDays className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Guest Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Segmentation */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Guest Segmentation</h3>
            <PieChart className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-secondary-900">Repeat Guests</p>
                  <p className="text-sm text-secondary-600">{repeatGuestsCount} guests</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{repeatGuestRate.toFixed(1)}%</p>
                <p className="text-xs text-secondary-500">Loyalty Rate</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-secondary-900">New Guests</p>
                  <p className="text-sm text-secondary-600">{newGuests} guests</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{newGuestRate.toFixed(1)}%</p>
                <p className="text-xs text-secondary-500">New Guest Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="space-y-3">
            {recentStays.slice(0, 5).map((stay, index) => (
              <div key={stay._id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {stay.guestName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-secondary-900">{stay.guestName}</p>
                    <p className="text-sm text-secondary-600">Room {stay.roomId?.roomNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900">
                    {formatPrice(stay.totalAmount || 0, currency)}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {new Date(stay.checkInDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentStays.length === 0 && (
              <div className="text-center py-8 text-secondary-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Guests and Stays Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Guests by Revenue */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Top Guests</h3>
            <Award className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="space-y-3">
            {topGuests.map((guest: any, index) => (
              <div key={guest.email} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-secondary-900">{guest.name}</p>
                    <p className="text-sm text-secondary-600">{guest.stays} stays</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary-900">
                    {formatPrice(guest.totalSpent, currency)}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Last: {new Date(guest.lastStay).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {topGuests.length === 0 && (
              <div className="text-center py-8 text-secondary-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                <p>No guest data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Stays Status Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Stays Overview</h3>
            <BarChart3 className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="space-y-4">
            {Object.values(StayStatus).map((status) => {
              const count = stays.filter(stay => stay.status === status).length;
              const percentage = totalGuests > 0 ? (count / totalGuests) * 100 : 0;
              const getStatusColor = (status: string) => {
                switch (status) {
                  case StayStatus.CHECKED_IN: return 'bg-green-500';
                  case StayStatus.CONFIRMED: return 'bg-blue-500';
                  case StayStatus.CHECKED_OUT: return 'bg-gray-500';
                  case StayStatus.CANCELLED: return 'bg-red-500';
                  default: return 'bg-secondary-500';
                }
              };
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-700 capitalize">
                      {status.replace('_', ' ').toLowerCase()}
                    </span>
                    <span className="text-sm font-bold text-secondary-900">{count}</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guest Contact Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Guest Contact Directory</h3>
          {/* <div className="flex space-x-2">
            <button className="btn-secondary text-sm">
              <Search className="w-4 h-4 mr-1" />
              Search
            </button>
            <button className="btn-secondary text-sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Bulk Message
            </button>
          </div> */}
        </div>
        {Object.values(guestRevenue).length === 0 ? (
          <div className="py-16 px-6">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full blur-xl opacity-50" />
                <div className="relative p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full">
                  <Users className="w-12 h-12 text-primary-600" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No guests found
              </h3>

              {/* Description */}
              <p className="text-secondary-600 mb-6 text-sm leading-relaxed">
                Guest contact information will appear here once you have stays with guest email addresses. 
                This directory helps you manage relationships with your guests.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-medium text-secondary-700">Guest</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-700">Stays</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-700">Total Spent</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-700">Last Stay</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(guestRevenue).slice(0, 10).map((guest: any) => (
                  <tr key={guest.email} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary-600">
                            {guest.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">{guest.name}</p>
                          <p className="text-sm text-secondary-600">{guest.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEmailClick(guest.email, guest.name)}
                          className="p-1 text-secondary-400 hover:text-primary-600"
                          title={`Email ${guest.email}`}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handlePhoneClick(guest.phone || '', guest.name)}
                          className="p-1 text-secondary-400 hover:text-primary-600"
                          title={`Call ${guest.phone || 'No phone number'}`}
                          disabled={!guest.phone}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {guest.stays} stays
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-secondary-900">
                      {formatPrice(guest.totalSpent, currency)}
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary-600">
                      {new Date(guest.lastStay).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewGuest(guest)}
                          className="p-1 text-secondary-400 hover:text-primary-600"
                          title={`View details for ${guest.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* <button className="p-1 text-secondary-400 hover:text-primary-600">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-secondary-400 hover:text-primary-600">
                          <Heart className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guest Details Modal */}
      {showGuestDetails && selectedGuest && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-primary-600">
                    {(selectedGuest?.name || 'U').charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900">{selectedGuest?.name || 'Unknown Guest'}</h2>
                  <p className="text-secondary-600">{selectedGuest?.email || 'No email'}</p>
                </div>
              </div>
              <button
                onClick={handleCloseGuestDetails}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guest Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Total Stays</p>
                    <p className="text-2xl font-bold text-secondary-900">{selectedGuest?.stayCount || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Bed className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Total Spent</p>
                    <p className="text-2xl font-bold text-secondary-900">{formatPrice(selectedGuest?.totalSpent || 0, currency)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Last Stay</p>
                    <p className="text-lg font-bold text-secondary-900">
                      {selectedGuest?.lastStay ? new Date(selectedGuest.lastStay).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-secondary-400 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-600">Email</p>
                    <p className="font-medium text-secondary-900">{selectedGuest?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-secondary-400 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-600">Phone</p>
                    <p className="font-medium text-secondary-900">{selectedGuest?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay History */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Stay History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Check-in</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Check-out</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Room</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGuest.stays?.map((stay: any) => (
                      <tr key={stay._id || Math.random()} className="border-b border-secondary-100">
                        <td className="py-3 px-4 text-sm text-secondary-900">
                          {stay.checkInDate ? new Date(stay.checkInDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-900">
                          {stay.checkOutDate ? new Date(stay.checkOutDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-900">
                          Room {stay.roomId?.roomNumber || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stay.status === StayStatus.CHECKED_IN ? 'bg-green-100 text-green-800' :
                            stay.status === StayStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                            stay.status === StayStatus.CHECKED_OUT ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {stay.status ? stay.status.replace('_', ' ').toLowerCase() : 'Unknown'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-secondary-900">
                          {formatPrice(stay.totalAmount || 0, currency)}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-secondary-500">
                          No stay history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Confirmation Dialog */}
      {showContactDialog && contactInfo && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-full mr-3">
                {contactInfo.type === 'email' ? (
                  <Mail className="w-5 h-5 text-primary-600" />
                ) : (
                  <Phone className="w-5 h-5 text-primary-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {contactInfo.type === 'email' ? 'Send Email' : 'Make Call'}
                </h3>
                <p className="text-sm text-secondary-600">to {contactInfo.guestName}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-secondary-600 mb-2">
                {contactInfo.type === 'email' ? 'Email address:' : 'Phone number:'}
              </p>
              <p className="text-lg font-medium text-secondary-900 bg-secondary-50 p-3 rounded-lg">
                {contactInfo.value}
              </p>
     </div>
    
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelContact}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmContact}
                className="btn-primary"
              >
                {contactInfo.type === 'email' ? 'Open Email App' : 'Make Call'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
