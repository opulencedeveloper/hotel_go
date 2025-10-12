'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  X,
  Plus
} from 'lucide-react';

// Mock data for hotels
const mockHotels = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    phone: '+1-555-0123',
    email: 'info@grandplaza.com',
    totalRooms: 150,
    occupiedRooms: 120,
    revenue: 125000,
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Ocean View Resort',
    address: '456 Beach Road',
    city: 'Miami',
    country: 'USA',
    phone: '+1-555-0456',
    email: 'contact@oceanview.com',
    totalRooms: 200,
    occupiedRooms: 180,
    revenue: 200000,
    status: 'active',
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    address: '789 Alpine Way',
    city: 'Denver',
    country: 'USA',
    phone: '+1-555-0789',
    email: 'info@mountainlodge.com',
    totalRooms: 80,
    occupiedRooms: 65,
    revenue: 85000,
    status: 'active',
    createdAt: '2023-03-10'
  },
  {
    id: '4',
    name: 'City Center Hotel',
    address: '321 Downtown Ave',
    city: 'Chicago',
    country: 'USA',
    phone: '+1-555-0321',
    email: 'info@citycenter.com',
    totalRooms: 120,
    occupiedRooms: 95,
    revenue: 95000,
    status: 'active',
    createdAt: '2023-04-05'
  },
  {
    id: '5',
    name: 'Beach Resort',
    address: '789 Ocean Drive',
    city: 'Los Angeles',
    country: 'USA',
    phone: '+1-555-0654',
    email: 'info@beachresort.com',
    totalRooms: 180,
    occupiedRooms: 150,
    revenue: 180000,
    status: 'inactive',
    createdAt: '2023-05-12'
  }
];

export default function AdminHotelsPage() {
  const [hotels] = useState(mockHotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [showNewHotel, setShowNewHotel] = useState(false);

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hotel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const hotelStats = {
    total: hotels.length,
    active: hotels.filter(h => h.status === 'active').length,
    inactive: hotels.filter(h => h.status === 'inactive').length,
    totalRooms: hotels.reduce((sum, h) => sum + h.totalRooms, 0),
    totalRevenue: hotels.reduce((sum, h) => sum + h.revenue, 0)
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Hotels Management</h1>
            <p className="text-secondary-600">Manage all hotels using HotelGo platform</p>
          </div>
          <button 
            onClick={() => setShowNewHotel(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hotel
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Hotels</p>
                <p className="text-2xl font-bold text-secondary-900">{hotelStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Active Hotels</p>
                <p className="text-2xl font-bold text-green-600">{hotelStats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Rooms</p>
                <p className="text-2xl font-bold text-secondary-900">{hotelStats.totalRooms.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-900">${(hotelStats.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
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
                  placeholder="Search hotels by name, city, or country..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="btn-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Hotels Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Rooms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">{hotel.name}</div>
                          <div className="text-sm text-secondary-500">{hotel.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-secondary-400 mr-2" />
                        <div>
                          <div className="text-sm text-secondary-900">{hotel.city}, {hotel.country}</div>
                          <div className="text-sm text-secondary-500">{hotel.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">{hotel.totalRooms}</div>
                      <div className="text-sm text-secondary-500">{hotel.occupiedRooms} occupied</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        ${hotel.revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {Math.round((hotel.occupiedRooms / hotel.totalRooms) * 100)}% occupancy
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hotel.status)}`}>
                        {getStatusIcon(hotel.status)}
                        <span className="ml-1 capitalize">{hotel.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedHotel(hotel)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedHotel(hotel)}
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hotel Details Modal */}
        {selectedHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Hotel Details</h3>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-secondary-900">Hotel Information</h4>
                    <p className="text-sm text-secondary-600">{selectedHotel.name}</p>
                    <p className="text-sm text-secondary-600">{selectedHotel.email}</p>
                    <p className="text-sm text-secondary-600">{selectedHotel.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Location</h4>
                    <p className="text-sm text-secondary-600">{selectedHotel.address}</p>
                    <p className="text-sm text-secondary-600">{selectedHotel.city}, {selectedHotel.country}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-secondary-900">Performance</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-secondary-600">Total Rooms</p>
                      <p className="text-lg font-semibold text-secondary-900">{selectedHotel.totalRooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Occupied Rooms</p>
                      <p className="text-lg font-semibold text-secondary-900">{selectedHotel.occupiedRooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Revenue</p>
                      <p className="text-lg font-semibold text-secondary-900">${selectedHotel.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Occupancy Rate</p>
                      <p className="text-lg font-semibold text-secondary-900">
                        {Math.round((selectedHotel.occupiedRooms / selectedHotel.totalRooms) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-secondary-900">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedHotel.status)}`}>
                    {getStatusIcon(selectedHotel.status)}
                    <span className="ml-1 capitalize">{selectedHotel.status}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Edit Hotel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
