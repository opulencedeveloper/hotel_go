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
  DollarSign,
  Users,
  Clock,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Settings,
  CheckCircle,
  AlertTriangle,
  X,
  Heart,
  Utensils,
  Car,
  Dumbbell,
  Camera,
  Music,
  Gift,
  Coffee,
  Waves,
  Mountain,
  Scissors,
  Wifi,
  Tv
} from 'lucide-react';

interface Service {
  service_id: string;
  name: string;
  category: 'spa' | 'restaurant' | 'transport' | 'fitness' | 'photography' | 'entertainment' | 'gift_shop' | 'event_center' | 'concierge' | 'laundry';
  description: string;
  price: number;
  duration: number; // in minutes
  capacity?: number;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  amenities: string[];
  operating_hours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  contact: {
    phone: string;
    email: string;
  };
  manager: string;
  created_at: string;
}

const mockServices: Service[] = [
  {
    service_id: 'svc_001',
    name: 'Grand Spa & Wellness',
    category: 'spa',
    description: 'Luxurious spa services including massages, facials, and wellness treatments',
    price: 150,
    duration: 90,
    capacity: 20,
    location: 'Ground Floor, East Wing',
    status: 'active',
    amenities: ['Sauna', 'Steam Room', 'Jacuzzi', 'Massage Therapy', 'Facial Treatments', 'Aromatherapy'],
    operating_hours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '09:00', close: '21:00', closed: false }
    },
    contact: {
      phone: '+1-555-SPA-001',
      email: 'spa@grandplaza.com'
    },
    manager: 'Sarah Johnson',
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    service_id: 'svc_002',
    name: 'Event Center & Conference Hall',
    category: 'event_center',
    description: 'State-of-the-art event center for conferences, weddings, and special events',
    price: 500,
    duration: 480, // 8 hours
    capacity: 200,
    location: '2nd Floor, Main Building',
    status: 'active',
    amenities: ['AV Equipment', 'Stage', 'Lighting', 'Sound System', 'Catering Kitchen', 'Parking'],
    operating_hours: {
      monday: { open: '06:00', close: '24:00', closed: false },
      tuesday: { open: '06:00', close: '24:00', closed: false },
      wednesday: { open: '06:00', close: '24:00', closed: false },
      thursday: { open: '06:00', close: '24:00', closed: false },
      friday: { open: '06:00', close: '24:00', closed: false },
      saturday: { open: '06:00', close: '24:00', closed: false },
      sunday: { open: '06:00', close: '24:00', closed: false }
    },
    contact: {
      phone: '+1-555-EVENT-01',
      email: 'events@grandplaza.com'
    },
    manager: 'Michael Chen',
    created_at: '2023-01-20T00:00:00Z'
  },
  {
    service_id: 'svc_003',
    name: 'Fitness Center',
    category: 'fitness',
    description: 'Modern fitness center with cardio and strength training equipment',
    price: 25,
    duration: 60,
    capacity: 30,
    location: 'Ground Floor, West Wing',
    status: 'active',
    amenities: ['Cardio Equipment', 'Weight Training', 'Yoga Studio', 'Personal Training', 'Locker Rooms', 'Shower Facilities'],
    operating_hours: {
      monday: { open: '05:00', close: '23:00', closed: false },
      tuesday: { open: '05:00', close: '23:00', closed: false },
      wednesday: { open: '05:00', close: '23:00', closed: false },
      thursday: { open: '05:00', close: '23:00', closed: false },
      friday: { open: '05:00', close: '23:00', closed: false },
      saturday: { open: '06:00', close: '22:00', closed: false },
      sunday: { open: '07:00', close: '22:00', closed: false }
    },
    contact: {
      phone: '+1-555-FIT-001',
      email: 'fitness@grandplaza.com'
    },
    manager: 'David Wilson',
    created_at: '2023-02-01T00:00:00Z'
  },
  {
    service_id: 'svc_004',
    name: 'Airport Shuttle Service',
    category: 'transport',
    description: 'Complimentary airport shuttle service for hotel guests',
    price: 0,
    duration: 45,
    location: 'Hotel Lobby',
    status: 'active',
    amenities: ['Airport Pickup', 'Airport Drop-off', 'Luggage Assistance', 'WiFi', 'Refreshments'],
    operating_hours: {
      monday: { open: '05:00', close: '23:00', closed: false },
      tuesday: { open: '05:00', close: '23:00', closed: false },
      wednesday: { open: '05:00', close: '23:00', closed: false },
      thursday: { open: '05:00', close: '23:00', closed: false },
      friday: { open: '05:00', close: '23:00', closed: false },
      saturday: { open: '05:00', close: '23:00', closed: false },
      sunday: { open: '05:00', close: '23:00', closed: false }
    },
    contact: {
      phone: '+1-555-SHUTTLE',
      email: 'transport@grandplaza.com'
    },
    manager: 'Robert Martinez',
    created_at: '2023-01-10T00:00:00Z'
  },
  {
    service_id: 'svc_005',
    name: 'Professional Photography',
    category: 'photography',
    description: 'Professional photography services for events, portraits, and special occasions',
    price: 200,
    duration: 120,
    location: 'Various Locations',
    status: 'active',
    amenities: ['Professional Equipment', 'Photo Editing', 'Digital Delivery', 'Print Services', 'Event Coverage'],
    operating_hours: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '10:00', close: '17:00', closed: false }
    },
    contact: {
      phone: '+1-555-PHOTO-01',
      email: 'photography@grandplaza.com'
    },
    manager: 'Lisa Anderson',
    created_at: '2023-03-15T00:00:00Z'
  },
  {
    service_id: 'svc_006',
    name: 'Gift Shop & Souvenirs',
    category: 'gift_shop',
    description: 'Curated selection of local souvenirs, gifts, and travel essentials',
    price: 0,
    duration: 30,
    location: 'Lobby Level',
    status: 'active',
    amenities: ['Local Crafts', 'Travel Essentials', 'Souvenirs', 'Gift Wrapping', 'International Shipping'],
    operating_hours: {
      monday: { open: '07:00', close: '22:00', closed: false },
      tuesday: { open: '07:00', close: '22:00', closed: false },
      wednesday: { open: '07:00', close: '22:00', closed: false },
      thursday: { open: '07:00', close: '22:00', closed: false },
      friday: { open: '07:00', close: '23:00', closed: false },
      saturday: { open: '08:00', close: '23:00', closed: false },
      sunday: { open: '08:00', close: '22:00', closed: false }
    },
    contact: {
      phone: '+1-555-GIFTS',
      email: 'giftshop@grandplaza.com'
    },
    manager: 'Emma Thompson',
    created_at: '2023-02-10T00:00:00Z'
  }
];

export default function ServicesPage() {
  const [isClient, setIsClient] = useState(false);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewService, setShowNewService] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // New Service Form State
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    category: 'spa' as Service['category'],
    description: '',
    price: 0,
    duration: 60,
    capacity: 1,
    location: '',
    status: 'active' as Service['status'],
    amenities: [] as string[],
    operating_hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false }
    },
    contact: {
      phone: '',
      email: ''
    },
    manager: ''
  });

  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    service_id: '',
    date: '',
    time: '',
    duration: 60,
    staff_member: '',
    notes: ''
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    default_duration: 60,
    max_advance_booking: 30,
    cancellation_policy: '24 hours',
    auto_confirm: false,
    require_deposit: false,
    deposit_percentage: 20
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spa': return <Heart className="w-5 h-5" />;
      case 'restaurant': return <Utensils className="w-5 h-5" />;
      case 'transport': return <Car className="w-5 h-5" />;
      case 'fitness': return <Dumbbell className="w-5 h-5" />;
      case 'photography': return <Camera className="w-5 h-5" />;
      case 'entertainment': return <Music className="w-5 h-5" />;
      case 'gift_shop': return <Gift className="w-5 h-5" />;
      case 'event_center': return <Calendar className="w-5 h-5" />;
      case 'concierge': return <Heart className="w-5 h-5" />;
      case 'laundry': return <Scissors className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spa': return 'bg-pink-100 text-pink-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      case 'transport': return 'bg-blue-100 text-blue-800';
      case 'fitness': return 'bg-green-100 text-green-800';
      case 'photography': return 'bg-purple-100 text-purple-800';
      case 'entertainment': return 'bg-yellow-100 text-yellow-800';
      case 'gift_shop': return 'bg-red-100 text-red-800';
      case 'event_center': return 'bg-indigo-100 text-indigo-800';
      case 'concierge': return 'bg-teal-100 text-teal-800';
      case 'laundry': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new service:', newServiceForm);
    setShowNewService(false);
    // Reset form
    setNewServiceForm({
      name: '',
      category: 'spa',
      description: '',
      price: 0,
      duration: 60,
      capacity: 1,
      location: '',
      status: 'active',
      amenities: [],
      operating_hours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '18:00', closed: false },
        sunday: { open: '09:00', close: '18:00', closed: false }
      },
      contact: {
        phone: '',
        email: ''
      },
      manager: ''
    });
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating schedule:', scheduleForm);
    setShowScheduleModal(false);
    // Reset form
    setScheduleForm({
      service_id: '',
      date: '',
      time: '',
      duration: 60,
      staff_member: '',
      notes: ''
    });
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating settings:', settingsForm);
    setShowSettingsModal(false);
  };

  const serviceStats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    inactive: services.filter(s => s.status === 'inactive').length,
    maintenance: services.filter(s => s.status === 'maintenance').length
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'spa', label: 'Spa & Wellness' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'transport', label: 'Transport' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'photography', label: 'Photography' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'gift_shop', label: 'Gift Shop' },
    { value: 'event_center', label: 'Event Center' },
    { value: 'concierge', label: 'Concierge' },
    { value: 'laundry', label: 'Laundry' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Services Management</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Spa, Events & Amenities</span>
                </div>
              </div>
              
              <p className="text-purple-100 text-lg mb-6">
                Manage all hotel services including spa, event center, fitness, and guest amenities.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Star className="w-4 h-4" />
                  <span className="text-purple-100">Total Services:</span>
                  <span className="font-medium">{serviceStats.total}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-purple-200">Active:</span>
                  <span className="font-medium">{serviceStats.active}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-purple-200">Inactive:</span>
                  <span className="font-medium">{serviceStats.inactive}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-purple-200">Maintenance:</span>
                  <span className="font-medium">{serviceStats.maintenance}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowNewService(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="bg-white text-purple-600 hover:bg-purple-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
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
                placeholder="Search services..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.service_id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    {getCategoryIcon(service.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">{service.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                      {service.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-secondary-600">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Price</span>
                  <span className="text-sm font-medium text-secondary-900">
                    {service.price === 0 ? 'Free' : `$${service.price}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Duration</span>
                  <span className="text-sm font-medium text-secondary-900">{service.duration} min</span>
                </div>
                
                {service.capacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Capacity</span>
                    <span className="text-sm font-medium text-secondary-900">{service.capacity} people</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Location</span>
                  <span className="text-sm font-medium text-secondary-900">{service.location}</span>
                </div>
                
                <div>
                  <span className="text-sm text-secondary-600">Amenities</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded">
                        {amenity}
                      </div>
                    ))}
                    {service.amenities.length > 3 && (
                      <div className="text-xs text-secondary-500 px-2 py-1">
                        +{service.amenities.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedService(service)}
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
                  <span className="text-xs font-medium text-secondary-700">{service.manager}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-lg mr-4">
                    {getCategoryIcon(selectedService.category)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-secondary-900">{selectedService.name}</h2>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedService.category)}`}>
                      {selectedService.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Service Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Description:</span> {selectedService.description}</p>
                      <p><span className="font-medium">Price:</span> {selectedService.price === 0 ? 'Free' : `$${selectedService.price}`}</p>
                      <p><span className="font-medium">Duration:</span> {selectedService.duration} minutes</p>
                      {selectedService.capacity && (
                        <p><span className="font-medium">Capacity:</span> {selectedService.capacity} people</p>
                      )}
                      <p><span className="font-medium">Location:</span> {selectedService.location}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedService.status)}`}>
                          {selectedService.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Phone:</span> {selectedService.contact.phone}</p>
                      <p><span className="font-medium">Email:</span> {selectedService.contact.email}</p>
                      <p><span className="font-medium">Manager:</span> {selectedService.manager}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.amenities.map((amenity, index) => (
                        <div key={index} className="text-sm text-secondary-600 bg-secondary-100 px-3 py-1 rounded">
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Operating Hours</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(selectedService.operating_hours).map(([day, hours]) => (
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
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
                <button className="btn-primary">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Service
                </button>
              </div>
            </div>
          </div>
        )}
        {/* New Service Modal */}
        {showNewService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Service</h2>
                <button
                  onClick={() => setShowNewService(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleNewServiceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceForm.name}
                      onChange={(e) => setNewServiceForm({...newServiceForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Grand Spa & Wellness"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newServiceForm.category}
                      onChange={(e) => setNewServiceForm({...newServiceForm, category: e.target.value as Service['category']})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="spa">Spa & Wellness</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="transport">Transport</option>
                      <option value="fitness">Fitness</option>
                      <option value="photography">Photography</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="gift_shop">Gift Shop</option>
                      <option value="event_center">Event Center</option>
                      <option value="concierge">Concierge</option>
                      <option value="laundry">Laundry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={newServiceForm.price}
                      onChange={(e) => setNewServiceForm({...newServiceForm, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newServiceForm.duration}
                      onChange={(e) => setNewServiceForm({...newServiceForm, duration: parseInt(e.target.value) || 60})}
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
                      value={newServiceForm.capacity}
                      onChange={(e) => setNewServiceForm({...newServiceForm, capacity: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceForm.location}
                      onChange={(e) => setNewServiceForm({...newServiceForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Ground Floor, East Wing"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Manager
                    </label>
                    <input
                      type="text"
                      value={newServiceForm.manager}
                      onChange={(e) => setNewServiceForm({...newServiceForm, manager: e.target.value})}
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
                      value={newServiceForm.contact.phone}
                      onChange={(e) => setNewServiceForm({...newServiceForm, contact: {...newServiceForm.contact, phone: e.target.value}})}
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
                      value={newServiceForm.contact.email}
                      onChange={(e) => setNewServiceForm({...newServiceForm, contact: {...newServiceForm.contact, email: e.target.value}})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="service@hotel.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={newServiceForm.description}
                      onChange={(e) => setNewServiceForm({...newServiceForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe this service..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowNewService(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Schedule Service</h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleScheduleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Service *
                    </label>
                    <select
                      required
                      value={scheduleForm.service_id}
                      onChange={(e) => setScheduleForm({...scheduleForm, service_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Service</option>
                      {services.map((service) => (
                        <option key={service.service_id} value={service.service_id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduleForm.date}
                      onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={scheduleForm.duration}
                      onChange={(e) => setScheduleForm({...scheduleForm, duration: parseInt(e.target.value) || 60})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Staff Member
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.staff_member}
                      onChange={(e) => setScheduleForm({...scheduleForm, staff_member: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Staff member name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={scheduleForm.notes}
                      onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Service Settings</h2>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Default Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={settingsForm.default_duration}
                      onChange={(e) => setSettingsForm({...settingsForm, default_duration: parseInt(e.target.value) || 60})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Max Advance Booking (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={settingsForm.max_advance_booking}
                      onChange={(e) => setSettingsForm({...settingsForm, max_advance_booking: parseInt(e.target.value) || 30})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Cancellation Policy
                    </label>
                    <select
                      value={settingsForm.cancellation_policy}
                      onChange={(e) => setSettingsForm({...settingsForm, cancellation_policy: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="24 hours">24 hours</option>
                      <option value="48 hours">48 hours</option>
                      <option value="72 hours">72 hours</option>
                      <option value="7 days">7 days</option>
                      <option value="14 days">14 days</option>
                      <option value="non-refundable">Non-refundable</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Deposit Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settingsForm.deposit_percentage}
                      onChange={(e) => setSettingsForm({...settingsForm, deposit_percentage: parseInt(e.target.value) || 20})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settingsForm.auto_confirm}
                          onChange={(e) => setSettingsForm({...settingsForm, auto_confirm: e.target.checked})}
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-secondary-700">Auto-confirm bookings</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settingsForm.require_deposit}
                          onChange={(e) => setSettingsForm({...settingsForm, require_deposit: e.target.checked})}
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-secondary-700">Require deposit for bookings</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
