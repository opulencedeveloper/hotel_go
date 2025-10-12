'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
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
  X
} from 'lucide-react';

// Simple mock data directly in the component
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
  }
];

const mockAdminStats = {
  totalHotels: 1250,
  activeHotels: 1180,
  totalRooms: 45000,
  totalRevenue: 12500000,
  monthlyGrowth: 12.5,
  topPerformingHotels: mockHotels
};

export default function AdminPage() {
  const [hotels] = useState(mockHotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const stats = mockAdminStats;

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

  const recentActivities = [
    { id: 1, action: 'New hotel registered', hotel: 'Ocean View Resort', time: '2 hours ago', type: 'registration' },
    { id: 2, action: 'Hotel activated', hotel: 'Mountain Lodge', time: '4 hours ago', type: 'activation' },
    { id: 3, action: 'Payment received', hotel: 'Grand Plaza Hotel', amount: '$2,500', time: '6 hours ago', type: 'payment' },
    { id: 4, action: 'Support ticket created', hotel: 'City Center Hotel', time: '8 hours ago', type: 'support' },
    { id: 5, action: 'Hotel upgraded plan', hotel: 'Beach Resort', time: '1 day ago', type: 'upgrade' }
  ];

  const topPerformingHotels = [
    { name: 'Grand Plaza Hotel', revenue: 125000, occupancy: 80, rooms: 150, growth: 12.5 },
    { name: 'Ocean View Resort', revenue: 200000, occupancy: 90, rooms: 200, growth: 18.2 },
    { name: 'Mountain Lodge', revenue: 85000, occupancy: 75, rooms: 80, growth: 8.7 }
  ];

  const revenueByRegion = [
    { region: 'North America', revenue: 2500000, hotels: 450, growth: 15.2 },
    { region: 'Europe', revenue: 1800000, hotels: 320, growth: 12.8 },
    { region: 'Asia Pacific', revenue: 2200000, hotels: 380, growth: 22.1 },
    { region: 'Middle East & Africa', revenue: 950000, hotels: 180, growth: 8.5 },
    { region: 'Latin America', revenue: 750000, hotels: 140, growth: 6.3 }
  ];

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
            <p className="text-secondary-600">Monitor and manage all hotels using HotelGo</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="btn-secondary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </button>
            <button className="btn-primary">
              <Building2 className="w-4 h-4 mr-2" />
              Add Hotel
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Hotels</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalHotels.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.monthlyGrowth}% this month
                </p>
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
                <p className="text-2xl font-bold text-secondary-900">{stats.activeHotels.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.2% this month
                </p>
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
                <p className="text-2xl font-bold text-secondary-900">{stats.totalRooms.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.1% this month
                </p>
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
                <p className="text-2xl font-bold text-secondary-900">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Region */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue by Region</h3>
          <div className="space-y-4">
            {revenueByRegion.map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <span className="text-sm font-medium text-secondary-900">{region.region}</span>
                  <span className="text-xs text-secondary-600">{region.hotels} hotels</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-secondary-900">
                    ${(region.revenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{region.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Activities</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'registration' ? 'bg-green-100' :
                    activity.type === 'activation' ? 'bg-blue-100' :
                    activity.type === 'payment' ? 'bg-orange-100' :
                    activity.type === 'support' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'registration' && <Building2 className="w-4 h-4 text-green-600" />}
                    {activity.type === 'activation' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-orange-600" />}
                    {activity.type === 'support' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                    {activity.type === 'upgrade' && <TrendingUp className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{activity.action}</p>
                    <p className="text-sm text-secondary-600">{activity.hotel}</p>
                    {activity.amount && (
                      <p className="text-sm text-green-600 font-medium">{activity.amount}</p>
                    )}
                  </div>
                  <div className="text-sm text-secondary-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Hotels */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Performing Hotels</h3>
            <div className="space-y-4">
              {topPerformingHotels.map((hotel, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full">
                      <span className="text-xs font-bold text-primary-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{hotel.name}</p>
                      <p className="text-xs text-secondary-600">{hotel.rooms} rooms</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">${hotel.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{hotel.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotels Management */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Hotels Management</h3>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <div className="flex-1 sm:flex-none">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search hotels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input"
                  />
                </div>
              </div>
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
