'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Clock,
  Users,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Coffee,
  Utensils,
  Gift,
  Camera,
  Music,
  Heart,
  Scissors,
  Settings,
  CheckCircle,
  AlertTriangle,
  X,
  Star,
  Calendar,
  Phone,
  Mail,
  Building,
  Shield,
  Zap
} from 'lucide-react';

interface Facility {
  facility_id: string;
  name: string;
  category: 'pool' | 'gym' | 'restaurant' | 'bar' | 'spa' | 'business_center' | 'concierge' | 'parking' | 'wifi' | 'laundry' | 'gift_shop' | 'event_space' | 'rooftop' | 'lobby' | 'security';
  description: string;
  location: string;
  floor: number;
  capacity?: number;
  status: 'operational' | 'maintenance' | 'closed' | 'renovation';
  amenities: string[];
  operating_hours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  access_level: 'public' | 'guest_only' | 'premium' | 'staff_only';
  manager: string;
  contact: {
    phone: string;
    email: string;
  };
  last_maintenance?: string;
  next_maintenance?: string;
  created_at: string;
}

const mockFacilities: Facility[] = [
  {
    facility_id: 'fac_001',
    name: 'Infinity Pool & Deck',
    category: 'pool',
    description: 'Stunning rooftop infinity pool with panoramic city views and poolside bar service',
    location: 'Rooftop, 15th Floor',
    floor: 15,
    capacity: 50,
    status: 'operational',
    amenities: ['Pool Bar', 'Lounge Chairs', 'Towels', 'Poolside Service', 'Changing Rooms', 'Shower Facilities'],
    operating_hours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '23:00', closed: false },
      saturday: { open: '07:00', close: '23:00', closed: false },
      sunday: { open: '07:00', close: '22:00', closed: false }
    },
    access_level: 'guest_only',
    manager: 'Sarah Johnson',
    contact: {
      phone: '+1-555-POOL-001',
      email: 'pool@grandplaza.com'
    },
    last_maintenance: '2024-01-10',
    next_maintenance: '2024-02-10',
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    facility_id: 'fac_002',
    name: 'Business Center',
    category: 'business_center',
    description: 'Fully equipped business center with meeting rooms, computers, and printing services',
    location: '2nd Floor, East Wing',
    floor: 2,
    capacity: 20,
    status: 'operational',
    amenities: ['Computers', 'Printers', 'Meeting Rooms', 'WiFi', 'Fax Machine', 'Copy Services'],
    operating_hours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '20:00', closed: false },
      sunday: { open: '08:00', close: '20:00', closed: false }
    },
    access_level: 'guest_only',
    manager: 'Michael Chen',
    contact: {
      phone: '+1-555-BUSINESS',
      email: 'business@grandplaza.com'
    },
    last_maintenance: '2024-01-05',
    next_maintenance: '2024-02-05',
    created_at: '2023-01-20T00:00:00Z'
  },
  {
    facility_id: 'fac_003',
    name: 'Valet Parking',
    category: 'parking',
    description: 'Secure valet parking service with 24/7 security and car care services',
    location: 'Ground Floor, Main Entrance',
    floor: 0,
    capacity: 100,
    status: 'operational',
    amenities: ['24/7 Security', 'Car Wash', 'Oil Change', 'Tire Service', 'Battery Jump', 'Lockout Service'],
    operating_hours: {
      monday: { open: '00:00', close: '23:59', closed: false },
      tuesday: { open: '00:00', close: '23:59', closed: false },
      wednesday: { open: '00:00', close: '23:59', closed: false },
      thursday: { open: '00:00', close: '23:59', closed: false },
      friday: { open: '00:00', close: '23:59', closed: false },
      saturday: { open: '00:00', close: '23:59', closed: false },
      sunday: { open: '00:00', close: '23:59', closed: false }
    },
    access_level: 'public',
    manager: 'Robert Martinez',
    contact: {
      phone: '+1-555-PARKING',
      email: 'parking@grandplaza.com'
    },
    last_maintenance: '2024-01-08',
    next_maintenance: '2024-02-08',
    created_at: '2023-01-10T00:00:00Z'
  },
  {
    facility_id: 'fac_004',
    name: 'Concierge Desk',
    category: 'concierge',
    description: '24/7 concierge service for guest assistance, bookings, and local recommendations',
    location: 'Lobby, Main Floor',
    floor: 1,
    status: 'operational',
    amenities: ['Tour Bookings', 'Restaurant Reservations', 'Transportation', 'Local Information', 'Ticket Sales', 'Package Handling'],
    operating_hours: {
      monday: { open: '00:00', close: '23:59', closed: false },
      tuesday: { open: '00:00', close: '23:59', closed: false },
      wednesday: { open: '00:00', close: '23:59', closed: false },
      thursday: { open: '00:00', close: '23:59', closed: false },
      friday: { open: '00:00', close: '23:59', closed: false },
      saturday: { open: '00:00', close: '23:59', closed: false },
      sunday: { open: '00:00', close: '23:59', closed: false }
    },
    access_level: 'guest_only',
    manager: 'Lisa Anderson',
    contact: {
      phone: '+1-555-CONCIERGE',
      email: 'concierge@grandplaza.com'
    },
    created_at: '2023-01-05T00:00:00Z'
  },
  {
    facility_id: 'fac_005',
    name: 'Guest Laundry',
    category: 'laundry',
    description: 'Self-service laundry facilities with washers, dryers, and ironing stations',
    location: '3rd Floor, West Wing',
    floor: 3,
    capacity: 10,
    status: 'operational',
    amenities: ['Washers', 'Dryers', 'Ironing Boards', 'Detergent', 'Fabric Softener', 'Change Machine'],
    operating_hours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '07:00', close: '22:00', closed: false },
      sunday: { open: '07:00', close: '22:00', closed: false }
    },
    access_level: 'guest_only',
    manager: 'Emma Thompson',
    contact: {
      phone: '+1-555-LAUNDRY',
      email: 'laundry@grandplaza.com'
    },
    last_maintenance: '2024-01-12',
    next_maintenance: '2024-02-12',
    created_at: '2023-02-01T00:00:00Z'
  },
  {
    facility_id: 'fac_006',
    name: 'Security Office',
    category: 'security',
    description: '24/7 security monitoring and emergency response center',
    location: 'Ground Floor, Service Area',
    floor: 0,
    status: 'operational',
    amenities: ['CCTV Monitoring', 'Emergency Response', 'Access Control', 'Patrol Services', 'Incident Reporting', 'Guest Safety'],
    operating_hours: {
      monday: { open: '00:00', close: '23:59', closed: false },
      tuesday: { open: '00:00', close: '23:59', closed: false },
      wednesday: { open: '00:00', close: '23:59', closed: false },
      thursday: { open: '00:00', close: '23:59', closed: false },
      friday: { open: '00:00', close: '23:59', closed: false },
      saturday: { open: '00:00', close: '23:59', closed: false },
      sunday: { open: '00:00', close: '23:59', closed: false }
    },
    access_level: 'staff_only',
    manager: 'David Wilson',
    contact: {
      phone: '+1-555-SECURITY',
      email: 'security@grandplaza.com'
    },
    last_maintenance: '2024-01-15',
    next_maintenance: '2024-02-15',
    created_at: '2023-01-01T00:00:00Z'
  }
];

export default function FacilitiesPage() {
  const [isClient, setIsClient] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [showNewFacility, setShowNewFacility] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // New Facility Form State
  const [newFacilityForm, setNewFacilityForm] = useState({
    name: '',
    category: 'pool' as Facility['category'],
    description: '',
    location: '',
    floor: 1,
    capacity: 1,
    status: 'operational' as Facility['status'],
    access_level: 'public' as Facility['access_level'],
    amenities: [] as string[],
    operating_hours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '23:00', closed: false },
      saturday: { open: '07:00', close: '23:00', closed: false },
      sunday: { open: '07:00', close: '22:00', closed: false }
    },
    contact: {
      phone: '',
      email: ''
    },
    manager: '',
    maintenance_schedule: {
      frequency: 'weekly',
      last_maintenance: '',
      next_maintenance: ''
    }
  });

  // Maintenance Form State
  const [maintenanceForm, setMaintenanceForm] = useState({
    facility_id: '',
    maintenance_type: 'routine',
    description: '',
    priority: 'medium',
    scheduled_date: '',
    estimated_duration: 60,
    assigned_staff: '',
    notes: ''
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    facility_id: '',
    security_level: 'standard',
    access_restrictions: '',
    monitoring_status: 'active',
    emergency_contacts: '',
    security_notes: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || facility.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || facility.status === statusFilter;
    const matchesAccess = accessFilter === 'all' || facility.access_level === accessFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesAccess;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pool': return <Waves className="w-5 h-5" />;
      case 'gym': return <Dumbbell className="w-5 h-5" />;
      case 'restaurant': return <Utensils className="w-5 h-5" />;
      case 'bar': return <Coffee className="w-5 h-5" />;
      case 'spa': return <Heart className="w-5 h-5" />;
      case 'business_center': return <Building className="w-5 h-5" />;
      case 'concierge': return <Heart className="w-5 h-5" />;
      case 'parking': return <Car className="w-5 h-5" />;
      case 'wifi': return <Wifi className="w-5 h-5" />;
      case 'laundry': return <Scissors className="w-5 h-5" />;
      case 'gift_shop': return <Gift className="w-5 h-5" />;
      case 'event_space': return <Calendar className="w-5 h-5" />;
      case 'rooftop': return <Star className="w-5 h-5" />;
      case 'lobby': return <Building className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pool': return 'bg-blue-100 text-blue-800';
      case 'gym': return 'bg-green-100 text-green-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      case 'bar': return 'bg-yellow-100 text-yellow-800';
      case 'spa': return 'bg-pink-100 text-pink-800';
      case 'business_center': return 'bg-purple-100 text-purple-800';
      case 'concierge': return 'bg-teal-100 text-teal-800';
      case 'parking': return 'bg-gray-100 text-gray-800';
      case 'wifi': return 'bg-indigo-100 text-indigo-800';
      case 'laundry': return 'bg-cyan-100 text-cyan-800';
      case 'gift_shop': return 'bg-red-100 text-red-800';
      case 'event_space': return 'bg-violet-100 text-violet-800';
      case 'rooftop': return 'bg-amber-100 text-amber-800';
      case 'lobby': return 'bg-slate-100 text-slate-800';
      case 'security': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'renovation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'guest_only': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'staff_only': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new facility:', newFacilityForm);
    setShowNewFacility(false);
    // Reset form
    setNewFacilityForm({
      name: '',
      category: 'pool',
      description: '',
      location: '',
      floor: 1,
      capacity: 1,
      status: 'operational',
      access_level: 'public',
      amenities: [],
      operating_hours: {
        monday: { open: '06:00', close: '22:00', closed: false },
        tuesday: { open: '06:00', close: '22:00', closed: false },
        wednesday: { open: '06:00', close: '22:00', closed: false },
        thursday: { open: '06:00', close: '22:00', closed: false },
        friday: { open: '06:00', close: '23:00', closed: false },
        saturday: { open: '07:00', close: '23:00', closed: false },
        sunday: { open: '07:00', close: '22:00', closed: false }
      },
      contact: {
        phone: '',
        email: ''
      },
      manager: '',
      maintenance_schedule: {
        frequency: 'weekly',
        last_maintenance: '',
        next_maintenance: ''
      }
    });
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating maintenance request:', maintenanceForm);
    setShowMaintenanceModal(false);
    // Reset form
    setMaintenanceForm({
      facility_id: '',
      maintenance_type: 'routine',
      description: '',
      priority: 'medium',
      scheduled_date: '',
      estimated_duration: 60,
      assigned_staff: '',
      notes: ''
    });
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating security settings:', securityForm);
    setShowSecurityModal(false);
  };

  const facilityStats = {
    total: facilities.length,
    operational: facilities.filter(f => f.status === 'operational').length,
    maintenance: facilities.filter(f => f.status === 'maintenance').length,
    closed: facilities.filter(f => f.status === 'closed').length,
    renovation: facilities.filter(f => f.status === 'renovation').length
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pool', label: 'Pool' },
    { value: 'gym', label: 'Gym' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'bar', label: 'Bar' },
    { value: 'spa', label: 'Spa' },
    { value: 'business_center', label: 'Business Center' },
    { value: 'concierge', label: 'Concierge' },
    { value: 'parking', label: 'Parking' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'gift_shop', label: 'Gift Shop' },
    { value: 'event_space', label: 'Event Space' },
    { value: 'rooftop', label: 'Rooftop' },
    { value: 'lobby', label: 'Lobby' },
    { value: 'security', label: 'Security' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Facilities Management</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Hotel Amenities & Infrastructure</span>
                </div>
              </div>
              
              <p className="text-green-100 text-lg mb-6">
                Manage all hotel facilities including pools, gyms, business centers, and guest amenities.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Building className="w-4 h-4" />
                  <span className="text-green-100">Total Facilities:</span>
                  <span className="font-medium">{facilityStats.total}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-green-200">Operational:</span>
                  <span className="font-medium">{facilityStats.operational}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-green-200">Maintenance:</span>
                  <span className="font-medium">{facilityStats.maintenance}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-green-200">Closed:</span>
                  <span className="font-medium">{facilityStats.closed}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-green-200">Renovation:</span>
                  <span className="font-medium">{facilityStats.renovation}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowNewFacility(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Facility</span>
                </button>
                <button 
                  onClick={() => setShowMaintenanceModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Settings className="w-4 h-4" />
                  <span>Maintenance</span>
                </button>
                <button 
                  onClick={() => setShowSecurityModal(true)}
                  className="bg-white text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Security</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
            <option value="renovation">Renovation</option>
          </select>
          
          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Access</option>
            <option value="public">Public</option>
            <option value="guest_only">Guest Only</option>
            <option value="premium">Premium</option>
            <option value="staff_only">Staff Only</option>
          </select>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <div key={facility.facility_id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    {getCategoryIcon(facility.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">{facility.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(facility.category)}`}>
                      {facility.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                    {facility.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccessColor(facility.access_level)}`}>
                    {facility.access_level.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-secondary-600">{facility.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Location</span>
                  <span className="text-sm font-medium text-secondary-900">{facility.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Floor</span>
                  <span className="text-sm font-medium text-secondary-900">{facility.floor}</span>
                </div>
                
                {facility.capacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Capacity</span>
                    <span className="text-sm font-medium text-secondary-900">{facility.capacity} people</span>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-secondary-600">Amenities</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {facility.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded">
                        {amenity}
                      </div>
                    ))}
                    {facility.amenities.length > 3 && (
                      <div className="text-xs text-secondary-500 px-2 py-1">
                        +{facility.amenities.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
                
                {facility.next_maintenance && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Next Maintenance</span>
                    <span className="text-sm font-medium text-secondary-900">
                      {isClient ? new Date(facility.next_maintenance).toLocaleDateString() : '--/--/----'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedFacility(facility)}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    View
                  </button>
                  <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">
                    <Edit className="w-3 h-3 inline mr-1" />
                    Edit
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-secondary-500">Manager:</span>
                  <span className="text-xs font-medium text-secondary-700">{facility.manager}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Facility Modal */}
        {showNewFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Facility</h2>
                <button
                  onClick={() => setShowNewFacility(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleNewFacilitySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Facility Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFacilityForm.name}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Grand Pool & Spa"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newFacilityForm.category}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, category: e.target.value as Facility['category']})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="pool">Pool</option>
                      <option value="gym">Gym</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="bar">Bar</option>
                      <option value="spa">Spa</option>
                      <option value="business_center">Business Center</option>
                      <option value="concierge">Concierge</option>
                      <option value="parking">Parking</option>
                      <option value="wifi">WiFi</option>
                      <option value="laundry">Laundry</option>
                      <option value="gift_shop">Gift Shop</option>
                      <option value="event_space">Event Space</option>
                      <option value="rooftop">Rooftop</option>
                      <option value="lobby">Lobby</option>
                      <option value="security">Security</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFacilityForm.location}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Ground Floor, East Wing"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Floor *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newFacilityForm.floor}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, floor: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newFacilityForm.capacity}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, capacity: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newFacilityForm.status}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, status: e.target.value as Facility['status']})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="operational">Operational</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="closed">Closed</option>
                      <option value="renovation">Renovation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Access Level
                    </label>
                    <select
                      value={newFacilityForm.access_level}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, access_level: e.target.value as Facility['access_level']})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="public">Public</option>
                      <option value="guest_only">Guest Only</option>
                      <option value="premium">Premium</option>
                      <option value="staff_only">Staff Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Manager
                    </label>
                    <input
                      type="text"
                      value={newFacilityForm.manager}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, manager: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Manager name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newFacilityForm.contact.phone}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, contact: {...newFacilityForm.contact, phone: e.target.value}})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1-555-000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newFacilityForm.contact.email}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, contact: {...newFacilityForm.contact, email: e.target.value}})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="facility@hotel.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={newFacilityForm.description}
                      onChange={(e) => setNewFacilityForm({...newFacilityForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe this facility..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowNewFacility(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Maintenance Modal */}
        {showMaintenanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Schedule Maintenance</h2>
                <button
                  onClick={() => setShowMaintenanceModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleMaintenanceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Facility *
                    </label>
                    <select
                      required
                      value={maintenanceForm.facility_id}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, facility_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Facility</option>
                      {facilities.map((facility) => (
                        <option key={facility.facility_id} value={facility.facility_id}>
                          {facility.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Maintenance Type *
                    </label>
                    <select
                      required
                      value={maintenanceForm.maintenance_type}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, maintenance_type: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="routine">Routine</option>
                      <option value="preventive">Preventive</option>
                      <option value="emergency">Emergency</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={maintenanceForm.priority}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={maintenanceForm.scheduled_date}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, scheduled_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Estimated Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={maintenanceForm.estimated_duration}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, estimated_duration: parseInt(e.target.value) || 60})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Assigned Staff
                    </label>
                    <input
                      type="text"
                      value={maintenanceForm.assigned_staff}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, assigned_staff: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Staff member name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={maintenanceForm.description}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe the maintenance work..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={maintenanceForm.notes}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, notes: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowMaintenanceModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Security Modal */}
        {showSecurityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Facility Security Settings</h2>
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Facility *
                    </label>
                    <select
                      required
                      value={securityForm.facility_id}
                      onChange={(e) => setSecurityForm({...securityForm, facility_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Facility</option>
                      {facilities.map((facility) => (
                        <option key={facility.facility_id} value={facility.facility_id}>
                          {facility.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Security Level
                    </label>
                    <select
                      value={securityForm.security_level}
                      onChange={(e) => setSecurityForm({...securityForm, security_level: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="enhanced">Enhanced</option>
                      <option value="high">High</option>
                      <option value="maximum">Maximum</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Monitoring Status
                    </label>
                    <select
                      value={securityForm.monitoring_status}
                      onChange={(e) => setSecurityForm({...securityForm, monitoring_status: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Access Restrictions
                    </label>
                    <textarea
                      value={securityForm.access_restrictions}
                      onChange={(e) => setSecurityForm({...securityForm, access_restrictions: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe access restrictions..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Emergency Contacts
                    </label>
                    <textarea
                      value={securityForm.emergency_contacts}
                      onChange={(e) => setSecurityForm({...securityForm, emergency_contacts: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Emergency contact information..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Security Notes
                    </label>
                    <textarea
                      value={securityForm.security_notes}
                      onChange={(e) => setSecurityForm({...securityForm, security_notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional security notes..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowSecurityModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Update Security
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Facility Details Modal */}
        {selectedFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-lg mr-4">
                    {getCategoryIcon(selectedFacility.category)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-secondary-900">{selectedFacility.name}</h2>
                    <div className="flex space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedFacility.category)}`}>
                        {selectedFacility.category.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedFacility.status)}`}>
                        {selectedFacility.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccessColor(selectedFacility.access_level)}`}>
                        {selectedFacility.access_level.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Facility Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Description:</span> {selectedFacility.description}</p>
                      <p><span className="font-medium">Location:</span> {selectedFacility.location}</p>
                      <p><span className="font-medium">Floor:</span> {selectedFacility.floor}</p>
                      {selectedFacility.capacity && (
                        <p><span className="font-medium">Capacity:</span> {selectedFacility.capacity} people</p>
                      )}
                      <p><span className="font-medium">Manager:</span> {selectedFacility.manager}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Phone:</span> {selectedFacility.contact.phone}</p>
                      <p><span className="font-medium">Email:</span> {selectedFacility.contact.email}</p>
                    </div>
                  </div>
                  
                  {selectedFacility.last_maintenance && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Maintenance</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Last Maintenance:</span> 
                          {isClient ? new Date(selectedFacility.last_maintenance).toLocaleDateString() : '--/--/----'}
                        </p>
                        {selectedFacility.next_maintenance && (
                          <p><span className="font-medium">Next Maintenance:</span> 
                            {isClient ? new Date(selectedFacility.next_maintenance).toLocaleDateString() : '--/--/----'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.amenities.map((amenity, index) => (
                        <div key={index} className="text-sm text-secondary-600 bg-secondary-100 px-3 py-1 rounded">
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Operating Hours</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(selectedFacility.operating_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize font-medium">{day}:</span>
                          <span className={hours.closed ? 'text-red-600' : 'text-secondary-600'}>
                            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-secondary-200">
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
                <button className="btn-primary">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Facility
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
