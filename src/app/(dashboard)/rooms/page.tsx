'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Bed, 
  Edit, 
  Trash2, 
  Eye,
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
  X
} from 'lucide-react';
import { mockRooms } from '@/data/mockData';
import { Room } from '@/types';

export default function RoomsPage() {
  const [isClient, setIsClient] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'occupied': return <X className="w-4 h-4" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4" />;
      case 'cleaning': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'tv': return <Tv className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'mini bar': return <Coffee className="w-4 h-4" />;
      case 'ocean view': return <Waves className="w-4 h-4" />;
      case 'mountain view': return <Mountain className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (roomId: string, newStatus: Room['status']) => {
    setRooms(prev => prev.map(room => 
      room.room_id === roomId ? { ...room, status: newStatus } : room
    ));
  };

  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Room Management</h1>
            <p className="text-secondary-600">Manage room inventory, pricing, and status</p>
          </div>
          <button 
            onClick={() => setShowNewRoom(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </button>
        </div>

        {/* Room Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-secondary-900">{roomStats.total}</div>
            <div className="text-sm text-secondary-600">Total Rooms</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{roomStats.available}</div>
            <div className="text-sm text-secondary-600">Available</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{roomStats.occupied}</div>
            <div className="text-sm text-secondary-600">Occupied</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{roomStats.maintenance}</div>
            <div className="text-sm text-secondary-600">Maintenance</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{roomStats.cleaning}</div>
            <div className="text-sm text-secondary-600">Cleaning</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by room number or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
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
                className="input"
              >
                <option value="all">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
              <button className="btn-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
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
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="text-secondary-600 hover:text-secondary-700"
                  >
                    <Edit className="w-4 h-4" />
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

        {/* New Room Modal */}
        {showNewRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Add New Room</h3>
                <button
                  onClick={() => setShowNewRoom(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Room Number
                    </label>
                    <input type="text" className="input" placeholder="e.g., 101" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Room Type
                    </label>
                    <select className="input">
                      <option value="">Select type</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="suite">Suite</option>
                      <option value="deluxe">Deluxe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Floor
                    </label>
                    <input type="number" min="1" className="input" placeholder="Floor number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Price per Night
                    </label>
                    <input type="number" min="0" step="0.01" className="input" placeholder="0.00" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Ocean View', 'Mountain View', 'Parking'].map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-secondary-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRoom(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Room Details Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Room Details</h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
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
                
                <div>
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
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Edit Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
