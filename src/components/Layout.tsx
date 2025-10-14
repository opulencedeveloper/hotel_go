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
  Archive
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userType?: 'admin' | 'hotel';
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Property overview & KPIs' },
  { name: 'Reservations', href: '/reservations', icon: Calendar, description: 'Booking management' },
  { name: 'Front Desk', href: '/front-desk', icon: UserCheck, description: 'Check-in/out operations' },
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
  const pathname = usePathname();
  const isAdmin = userType === 'admin';
  const navItems = isAdmin ? adminNavigationItems : navigationItems;
  
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
                  <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700">
                    + Reservation
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                    + Check-in
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
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
    </div>
  );
}
