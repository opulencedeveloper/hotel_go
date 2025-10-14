'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mockProperties, mockDashboardStats } from '@/data/mockData';
import { 
  Home, 
  Calendar, 
  Bed, 
  Users, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  Menu, 
  X,
  LogOut,
  Bell,
  Search,
  DollarSign,
  TrendingUp,
  Shield,
  Database,
  ChefHat,
  Wrench,
  FileText,
  Package,
  Building,
  ChevronDown,
  Wifi,
  Star,
  WifiOff,
  Clock,
  Globe,
  CreditCard,
  UserCheck,
  ClipboardList,
  Calculator,
  Heart,
  Truck,
  PieChart,
  Download,
  Lock,
  Archive,
  CheckCircle,
  Save
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userType?: 'admin' | 'hotel';
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Property overview & KPIs' },
  { name: 'Reservations', href: '/reservations', icon: Calendar, description: 'Booking management' },
  { name: 'Front Desk', href: '/front-desk', icon: UserCheck, description: 'Check-in/out operations' },
  { name: 'Room Management', href: '/room-management', icon: Bed, description: 'Rooms, types & rates' },
  { name: 'Services', href: '/services', icon: Star, description: 'Spa, events & amenities' },
  { name: 'Facilities', href: '/facilities', icon: Building, description: 'Hotel amenities & infrastructure' },
  { name: 'Folio & Payments', href: '/folio', icon: CreditCard, description: 'Guest billing & payments' },
  { name: 'POS & F&B', href: '/pos', icon: ShoppingCart, description: 'Point of sale system' },
  { name: 'Kitchen & Restaurant', href: '/kitchen', icon: ChefHat, description: 'Kitchen operations' },
  { name: 'Housekeeping', href: '/housekeeping', icon: Wrench, description: 'Room maintenance' },
  { name: 'Staff & Payroll', href: '/staff', icon: Users, description: 'Employee management' },
  { name: 'Yield & Rate Management', href: '/yield', icon: TrendingUp, description: 'Dynamic pricing' },
  { name: 'Accounting & Finance', href: '/accounting', icon: Calculator, description: 'Financial management' },
  { name: 'CRM & Loyalty', href: '/crm', icon: Heart, description: 'Guest relationships' },
  { name: 'Procurement & Inventory', href: '/procurement', icon: Truck, description: 'Supply management' },
  { name: 'Business Analytics', href: '/analytics', icon: PieChart, description: 'Data insights' },
  { name: 'Reports & Dashboards', href: '/reports', icon: Download, description: 'Report generation' },
  { name: 'Security & Access Control', href: '/security', icon: Lock, description: 'User permissions' },
  { name: 'Backup & Data Recovery', href: '/backup', icon: Archive, description: 'Data protection' },
  { name: 'Property Settings', href: '/settings', icon: Settings, description: 'System configuration' },
];

const adminNavigationItems = [
  { name: 'Admin Dashboard', href: '/admin', icon: Home },
  { name: 'Hotels', href: '/admin/hotels', icon: Bed },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Layout({ children, userType = 'hotel' }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertySelectorOpen, setPropertySelectorOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const pathname = usePathname();
  const isAdmin = userType === 'admin';
  const navItems = isAdmin ? adminNavigationItems : navigationItems;

  // Reservation form state
  const [reservationForm, setReservationForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    roomType: '',
    specialRequests: ''
  });

  // Check-in form state
  const [checkInForm, setCheckInForm] = useState({
    bookingId: '',
    guestName: '',
    roomNumber: '',
    idType: '',
    idNumber: '',
    paymentMethod: '',
    notes: ''
  });

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    roomType: '',
    paymentMethod: '',
    specialRequests: ''
  });
  
  // Form submission handlers
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating reservation:', reservationForm);
    setShowReservationModal(false);
    setReservationForm({
      guestName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      roomType: '',
      specialRequests: ''
    });
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing check-in:', checkInForm);
    setShowCheckInModal(false);
    setCheckInForm({
      bookingId: '',
      guestName: '',
      roomNumber: '',
      idType: '',
      idNumber: '',
      paymentMethod: '',
      notes: ''
    });
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing walk-in:', walkInForm);
    setShowWalkInModal(false);
    setWalkInForm({
      guestName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      roomType: '',
      paymentMethod: '',
      specialRequests: ''
    });
  };

  // Mock data for property selector and context ribbon
  const currentProperty = mockProperties[0];
  const stats = mockDashboardStats;

  // Update current time to prevent hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleString('en-US', { 
        timeZone: currentProperty.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(time);
    };

    // Set initial time
    updateTime();
    
    // Update every minute
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [currentProperty.timezone]);

  // Keyboard shortcuts for front-desk operations
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAdmin) return; // Skip shortcuts for admin users
      
      // Only trigger shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'F1':
          event.preventDefault();
          // Navigate to new reservation
          window.location.href = '/reservations?action=new';
          break;
        case 'F2':
          event.preventDefault();
          // Navigate to check-in
          window.location.href = '/front-desk?action=checkin';
          break;
        case 'F3':
          event.preventDefault();
          // Focus search
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;
        case 'Escape':
          // Close any open modals/dropdowns
          setPropertySelectorOpen(false);
          setSidebarOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);
  
  const properties = [
    { id: '1', name: 'Grand Plaza Hotel', location: 'New York', occupancy: 85 },
    { id: '2', name: 'Ocean View Resort', location: 'Miami', occupancy: 92 },
    { id: '3', name: 'Mountain Lodge', location: 'Denver', occupancy: 78 }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-200 flex-shrink-0">
            <h1 className="text-xl font-bold text-primary-600">HotelGo</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto pb-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white border-r border-secondary-200">
          <div className="flex items-center h-16 px-4 border-b border-secondary-200 flex-shrink-0">
            <h1 className="text-xl font-bold text-primary-600">HotelGo</h1>
          </div>
          <nav className="flex-1 overflow-y-auto pb-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Context Ribbon */}
        {!isAdmin && (
          <div className="bg-primary-600 text-white py-2 px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{currentProperty.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime || '--:-- --'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{currentProperty.currency}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bed className="w-4 h-4" />
                  <span>{stats.occupancy.today}% Occupancy</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {stats.online_status ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Online - {stats.last_sync}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Offline Mode</span>
                  </>
                )}
                {stats.pending_sync_items > 0 && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                    {stats.pending_sync_items} pending
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-secondary-200">
          {/* First row - Main navigation and title */}
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-secondary-400 hover:text-secondary-600 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-secondary-900">
                  {isAdmin ? 'Admin Dashboard' : 'Hotel Management'}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 text-secondary-400 hover:text-secondary-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* User profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-secondary-900">John Doe</p>
                  <p className="text-xs text-secondary-500">{isAdmin ? 'Admin' : 'Hotel Manager'}</p>
                </div>
                <button className="p-2 text-secondary-400 hover:text-secondary-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Second row - Property selector, quick actions, and mobile search */}
          {!isAdmin && (
            <div className="flex items-center justify-between h-12 px-4 bg-secondary-50 border-t border-secondary-100">
              <div className="flex items-center space-x-4">
                {/* Property Selector */}
                <div className="relative">
                  <button
                    onClick={() => setPropertySelectorOpen(!propertySelectorOpen)}
                    className="flex items-center space-x-2 px-3 py-2 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50"
                  >
                    <Building className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm font-medium text-secondary-700">{currentProperty.name}</span>
                    <ChevronDown className="w-4 h-4 text-secondary-500" />
                  </button>
                  
                  {propertySelectorOpen && (
                    <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-secondary-200 rounded-lg shadow-lg z-50">
                      <div className="p-3">
                        <div className="text-xs font-medium text-secondary-500 uppercase tracking-wide mb-3">Switch Property</div>
                        {properties.map((property) => (
                          <button
                            key={property.id}
                            className="w-full text-left px-3 py-3 hover:bg-secondary-50 rounded-md border border-transparent hover:border-secondary-200 transition-colors"
                            onClick={() => setPropertySelectorOpen(false)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-secondary-900">{property.name}</div>
                                <div className="text-sm text-secondary-500">{property.location}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-secondary-900">{property.occupancy}%</div>
                                <div className="text-xs text-secondary-500">Occupancy</div>
                              </div>
                            </div>
                          </button>
                        ))}
                        <div className="mt-3 pt-3 border-t border-secondary-200">
                          <button className="w-full text-left px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md">
                            + Add New Property
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Mobile Search */}
                <div className="relative sm:hidden">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-48 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowReservationModal(true)}
                    className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                  >
                    + Reservation
                  </button>
                  <button 
                    onClick={() => setShowCheckInModal(true)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    + Check-in
                  </button>
                  <button 
                    onClick={() => setShowWalkInModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Walk-in
                  </button>
                </div>
                
                {/* Keyboard Shortcuts Help */}
                <button 
                  className="p-2 text-secondary-400 hover:text-secondary-600 hidden lg:block"
                  title="Keyboard Shortcuts: F1=New Reservation, F2=Check-in, F3=Search, Esc=Close"
                >
                  <span className="text-xs font-mono">F1 F2 F3</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* New Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">New Reservation</h2>
              <button
                onClick={() => setShowReservationModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reservationForm.guestName}
                    onChange={(e) => setReservationForm({...reservationForm, guestName: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter guest name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={reservationForm.email}
                    onChange={(e) => setReservationForm({...reservationForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="guest@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={reservationForm.phone}
                    onChange={(e) => setReservationForm({...reservationForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Type
                  </label>
                  <select
                    value={reservationForm.roomType}
                    onChange={(e) => setReservationForm({...reservationForm, roomType: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select room type</option>
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={reservationForm.checkIn}
                    onChange={(e) => setReservationForm({...reservationForm, checkIn: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={reservationForm.checkOut}
                    onChange={(e) => setReservationForm({...reservationForm, checkOut: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={reservationForm.adults}
                    onChange={(e) => setReservationForm({...reservationForm, adults: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reservationForm.children}
                    onChange={(e) => setReservationForm({...reservationForm, children: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={reservationForm.specialRequests}
                  onChange={(e) => setReservationForm({...reservationForm, specialRequests: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requests or notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Check-in Guest</h2>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Booking ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={checkInForm.bookingId}
                      onChange={(e) => setCheckInForm({...checkInForm, bookingId: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter booking ID"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={checkInForm.guestName}
                    onChange={(e) => setCheckInForm({...checkInForm, guestName: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Guest name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={checkInForm.roomNumber}
                    onChange={(e) => setCheckInForm({...checkInForm, roomNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 201"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    ID Type
                  </label>
                  <select
                    value={checkInForm.idType}
                    onChange={(e) => setCheckInForm({...checkInForm, idType: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select ID type</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={checkInForm.idNumber}
                    onChange={(e) => setCheckInForm({...checkInForm, idNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="ID number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={checkInForm.paymentMethod}
                    onChange={(e) => setCheckInForm({...checkInForm, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="company_account">Company Account</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={checkInForm.notes}
                  onChange={(e) => setCheckInForm({...checkInForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special notes for check-in..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check In Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Walk-in Guest</h2>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInForm.guestName}
                    onChange={(e) => setWalkInForm({...walkInForm, guestName: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter guest name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={walkInForm.email}
                    onChange={(e) => setWalkInForm({...walkInForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="guest@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({...walkInForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    required
                    value={walkInForm.roomType}
                    onChange={(e) => setWalkInForm({...walkInForm, roomType: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select room type</option>
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={walkInForm.checkIn}
                    onChange={(e) => setWalkInForm({...walkInForm, checkIn: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={walkInForm.checkOut}
                    onChange={(e) => setWalkInForm({...walkInForm, checkOut: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={walkInForm.adults}
                    onChange={(e) => setWalkInForm({...walkInForm, adults: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={walkInForm.children}
                    onChange={(e) => setWalkInForm({...walkInForm, children: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    required
                    value={walkInForm.paymentMethod}
                    onChange={(e) => setWalkInForm({...walkInForm, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="debit_card">Debit Card</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={walkInForm.specialRequests}
                  onChange={(e) => setWalkInForm({...walkInForm, specialRequests: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requests or notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Process Walk-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
