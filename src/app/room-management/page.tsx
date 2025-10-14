'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Bed, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  Users,
  Wifi,
  Tv,
  Car,
  Coffee,
  Waves,
  Mountain,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Star,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { mockRooms, mockRoomTypes, mockRatePlans } from '@/data/mockData';
import { Room, RoomType, RatePlan } from '@/types';

export default function RoomManagementPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(mockRoomTypes);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>(mockRatePlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [showNewRoomType, setShowNewRoomType] = useState(false);
  const [showNewRatePlan, setShowNewRatePlan] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [selectedRatePlan, setSelectedRatePlan] = useState<RatePlan | null>(null);

  // New Room Form State
  const [newRoomForm, setNewRoomForm] = useState({
    room_number: '',
    room_type_id: '',
    floor: 1,
    status: 'available' as Room['status'],
    notes: ''
  });

  // New Room Type Form State
  const [newRoomTypeForm, setNewRoomTypeForm] = useState({
    name: '',
    description: '',
    capacity: 2,
    base_rate: 150,
    amenities: [] as string[],
    images: [] as string[]
  });

  // New Rate Plan Form State
  const [newRatePlanForm, setNewRatePlanForm] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active',
    rates: {
      '2024-01-01': 150
    },
    rules: {
      min_los: 1,
      max_los: 30,
      advance_booking_days: 0,
      cancellation_policy: '24 hours'
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.room_type_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.room_type_id === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return '✓';
      case 'occupied': return '🏠';
      case 'maintenance': return '🔧';
      case 'cleaning': return '🧹';
      default: return '❓';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-3 h-3" />;
      case 'tv': return <Tv className="w-3 h-3" />;
      case 'parking': return <Car className="w-3 h-3" />;
      case 'coffee': return <Coffee className="w-3 h-3" />;
      case 'pool': return <Waves className="w-3 h-3" />;
      case 'mountain view': return <Mountain className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const handleStatusChange = (roomId: string, newStatus: Room['status']) => {
    setRooms(prev => prev.map(room => 
      room.room_id === roomId ? { ...room, status: newStatus } : room
    ));
  };

  const handleNewRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new room:', newRoomForm);
    setShowNewRoom(false);
    // Reset form
    setNewRoomForm({
      room_number: '',
      room_type_id: '',
      floor: 1,
      status: 'available',
      notes: ''
    });
  };

  const handleNewRoomTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new room type:', newRoomTypeForm);
    setShowNewRoomType(false);
    // Reset form
    setNewRoomTypeForm({
      name: '',
      description: '',
      capacity: 2,
      base_rate: 150,
      amenities: [],
      images: []
    });
  };

  const handleNewRatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new rate plan:', newRatePlanForm);
    setShowNewRatePlan(false);
    // Reset form
    setNewRatePlanForm({
      name: '',
      code: '',
      description: '',
      status: 'active',
      rates: {
        '2024-01-01': 150
      },
      rules: {
        min_los: 1,
        max_los: 30,
        advance_booking_days: 0,
        cancellation_policy: '24 hours'
      }
    });
  };

  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length
  };

  const tabs = [
    { id: 'rooms', name: 'Rooms', icon: Bed },
    { id: 'room-types', name: 'Room Types', icon: Star },
    { id: 'rate-plans', name: 'Rate Plans', icon: DollarSign },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Room Management</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Rooms, Types & Rates</span>
                </div>
              </div>
              
              <p className="text-blue-100 text-lg mb-6">
                Comprehensive room management system for types, rates, and availability.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Bed className="w-4 h-4" />
                  <span className="text-blue-100">Total Rooms:</span>
                  <span className="font-medium">{roomStats.total}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Available:</span>
                  <span className="font-medium">{roomStats.available}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Occupied:</span>
                  <span className="font-medium">{roomStats.occupied}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Maintenance:</span>
                  <span className="font-medium">{roomStats.maintenance}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowNewRoom(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room</span>
                </button>
                <button 
                  onClick={() => setShowNewRoomType(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Star className="w-4 h-4" />
                  <span>Add Room Type</span>
                </button>
                <button 
                  onClick={() => setShowNewRatePlan(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Add Rate Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                  
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Types</option>
                    {roomTypes.map(type => (
                      <option key={type.room_type_id} value={type.room_type_id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRooms.map((room) => (
                    <div key={room.room_id} className="card hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Bed className="w-5 h-5 text-primary-600 mr-2" />
                          <span className="text-lg font-semibold text-secondary-900">
                            Room {room.room_number}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                          {getStatusIcon(room.status)}
                          <span className="ml-1 capitalize">{room.status}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-600">Type</span>
                          <span className="text-sm font-medium text-secondary-900 capitalize">{room.room_type_id}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-600">Floor</span>
                          <span className="text-sm font-medium text-secondary-900">{room.floor}</span>
                        </div>
                        
                        {room.last_cleaned && (
                          <div className="text-xs text-secondary-500">
                            Last cleaned: {isClient ? new Date(room.last_cleaned).toLocaleDateString() : '--/--/----'}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRoom(room)}
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
                        
                        <div className="flex space-x-1">
                          {room.status === 'available' && (
                            <button
                              onClick={() => handleStatusChange(room.room_id, 'occupied')}
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                            >
                              Mark Occupied
                            </button>
                          )}
                          {room.status === 'occupied' && (
                            <button
                              onClick={() => handleStatusChange(room.room_id, 'cleaning')}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              Mark Cleaning
                            </button>
                          )}
                          {room.status === 'cleaning' && (
                            <button
                              onClick={() => handleStatusChange(room.room_id, 'available')}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                            >
                              Mark Available
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room Types Tab */}
            {activeTab === 'room-types' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-secondary-900">Room Types</h3>
                  <button className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Room Type
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roomTypes.map((type) => (
                    <div key={type.room_type_id} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-secondary-900">{type.name}</h4>
                        <span className="text-sm font-medium text-primary-600">${type.base_rate}/night</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-600">Capacity</span>
                          <span className="text-sm font-medium text-secondary-900">{type.capacity} guests</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-secondary-600">Amenities</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {type.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded">
                                {getAmenityIcon(amenity)}
                                <span className="ml-1">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-sm text-secondary-600">{type.description}</p>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-secondary-200">
                        <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                          <Edit className="w-3 h-3 inline mr-1" />
                          Edit
                        </button>
                        <button className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                          <Trash2 className="w-3 h-3 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rate Plans Tab */}
            {activeTab === 'rate-plans' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-secondary-900">Rate Plans</h3>
                  <button 
                    onClick={() => setShowNewRatePlan(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rate Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ratePlans.map((plan) => (
                    <div key={plan.rate_plan_id} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-secondary-900">{plan.name}</h4>
                        <span className="text-sm font-medium text-primary-600">{plan.code}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-600">Sample Rate</span>
                          <span className="text-sm font-medium text-secondary-900">
                            ${Object.values(plan.rates)[0] || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-600">Status</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-secondary-600">Rules</span>
                          <div className="text-xs text-secondary-500 mt-1">
                            <p>• Cancellation: {plan.rules.cancellation_policy}</p>
                            <p>• Advance Booking: {plan.rules.advance_booking_days} days</p>
                            <p>• Min Stay: {plan.rules.min_los} nights</p>
                            <p>• Max Stay: {plan.rules.max_los} nights</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-secondary-200">
                        <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                          <Edit className="w-3 h-3 inline mr-1" />
                          Edit
                        </button>
                        <button className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                          <Trash2 className="w-3 h-3 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">Room Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600">Occupancy Rate</p>
                        <p className="text-2xl font-bold text-secondary-900">78.5%</p>
                        <p className="text-sm text-green-600">+5.2% vs last month</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600">ADR</p>
                        <p className="text-2xl font-bold text-secondary-900">$245</p>
                        <p className="text-sm text-blue-600">+8.3% vs last month</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600">RevPAR</p>
                        <p className="text-2xl font-bold text-secondary-900">$192</p>
                        <p className="text-sm text-purple-600">+12.5% vs last month</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600">Average Stay</p>
                        <p className="text-2xl font-bold text-secondary-900">2.8 nights</p>
                        <p className="text-sm text-orange-600">+0.3 vs last month</p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Calendar className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Room Details Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Room Details</h2>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-secondary-900">Room Information</h4>
                     <p className="text-sm text-secondary-600">Number: {selectedRoom.room_number}</p>
                     <p className="text-sm text-secondary-600">Type: {selectedRoom.room_type_id}</p>
                     <p className="text-sm text-secondary-600">Floor: {selectedRoom.floor}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Status</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRoom.status)}`}>
                      {getStatusIcon(selectedRoom.status)}
                      <span className="ml-1 capitalize">{selectedRoom.status}</span>
                    </span>
                  </div>
                </div>
                
                {selectedRoom.last_cleaned && (
                  <div>
                    <h4 className="font-medium text-secondary-900">Last Cleaned</h4>
                    <p className="text-sm text-secondary-600">
                      {isClient ? new Date(selectedRoom.last_cleaned).toLocaleDateString() : '--/--/----'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
                <button className="btn-primary">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Room Modal */}
        {showNewRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Room</h2>
                <button
                  onClick={() => setShowNewRoom(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleNewRoomSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRoomForm.room_number}
                      onChange={(e) => setNewRoomForm({...newRoomForm, room_number: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., 101"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room Type *
                    </label>
                    <select
                      required
                      value={newRoomForm.room_type_id}
                      onChange={(e) => setNewRoomForm({...newRoomForm, room_type_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((type) => (
                        <option key={type.room_type_id} value={type.room_type_id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Floor *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newRoomForm.floor}
                      onChange={(e) => setNewRoomForm({...newRoomForm, floor: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newRoomForm.status}
                      onChange={(e) => setNewRoomForm({...newRoomForm, status: e.target.value as Room['status']})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newRoomForm.notes}
                      onChange={(e) => setNewRoomForm({...newRoomForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes about this room..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowNewRoom(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Room Type Modal */}
        {showNewRoomType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Room Type</h2>
                <button
                  onClick={() => setShowNewRoomType(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleNewRoomTypeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Room Type Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRoomTypeForm.name}
                      onChange={(e) => setNewRoomTypeForm({...newRoomTypeForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Deluxe Suite"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={newRoomTypeForm.capacity}
                      onChange={(e) => setNewRoomTypeForm({...newRoomTypeForm, capacity: parseInt(e.target.value) || 2})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Base Rate ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={newRoomTypeForm.base_rate}
                      onChange={(e) => setNewRoomTypeForm({...newRoomTypeForm, base_rate: parseFloat(e.target.value) || 150})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newRoomTypeForm.description}
                      onChange={(e) => setNewRoomTypeForm({...newRoomTypeForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe this room type..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['WiFi', 'TV', 'Parking', 'Coffee', 'Pool', 'Mountain View', 'Balcony', 'Mini Bar', 'Safe'].map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newRoomTypeForm.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRoomTypeForm({
                                  ...newRoomTypeForm,
                                  amenities: [...newRoomTypeForm.amenities, amenity]
                                });
                              } else {
                                setNewRoomTypeForm({
                                  ...newRoomTypeForm,
                                  amenities: newRoomTypeForm.amenities.filter(a => a !== amenity)
                                });
                              }
                            }}
                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowNewRoomType(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Create Room Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Rate Plan Modal */}
        {showNewRatePlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Rate Plan</h2>
                <button
                  onClick={() => setShowNewRatePlan(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleNewRatePlanSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Rate Plan Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRatePlanForm.name}
                      onChange={(e) => setNewRatePlanForm({...newRatePlanForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Standard Rate"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Rate Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRatePlanForm.code}
                      onChange={(e) => setNewRatePlanForm({...newRatePlanForm, code: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., STD"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newRatePlanForm.description}
                      onChange={(e) => setNewRatePlanForm({...newRatePlanForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe this rate plan..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newRatePlanForm.status}
                      onChange={(e) => setNewRatePlanForm({...newRatePlanForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Base Rate ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newRatePlanForm.rates['2024-01-01']}
                      onChange={(e) => setNewRatePlanForm({
                        ...newRatePlanForm, 
                        rates: { '2024-01-01': parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="150.00"
                    />
                  </div>
                </div>
                
                <div className="border-t border-secondary-200 pt-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Rate Rules</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Minimum Length of Stay
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newRatePlanForm.rules.min_los}
                        onChange={(e) => setNewRatePlanForm({
                          ...newRatePlanForm, 
                          rules: { ...newRatePlanForm.rules, min_los: parseInt(e.target.value) || 1 }
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Maximum Length of Stay
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newRatePlanForm.rules.max_los}
                        onChange={(e) => setNewRatePlanForm({
                          ...newRatePlanForm, 
                          rules: { ...newRatePlanForm.rules, max_los: parseInt(e.target.value) || 30 }
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Advance Booking Days
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newRatePlanForm.rules.advance_booking_days}
                        onChange={(e) => setNewRatePlanForm({
                          ...newRatePlanForm, 
                          rules: { ...newRatePlanForm.rules, advance_booking_days: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Cancellation Policy
                      </label>
                      <select
                        value={newRatePlanForm.rules.cancellation_policy}
                        onChange={(e) => setNewRatePlanForm({
                          ...newRatePlanForm, 
                          rules: { ...newRatePlanForm.rules, cancellation_policy: e.target.value }
                        })}
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
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowNewRatePlan(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Rate Plan
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
