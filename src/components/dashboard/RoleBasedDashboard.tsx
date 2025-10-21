'use client';

import { UserRole } from '@/lib/auth';
import { 
  Bed, 
  Users, 
  Calendar, 
  ChefHat, 
  Wrench, 
  Calculator, 
  Shield, 
  Heart,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';

interface RoleBasedDashboardProps {
  userRole: UserRole;
}
import { mockProperties, mockDashboardStats } from "@/data/mockData";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
export default function RoleBasedDashboard({ userRole }: RoleBasedDashboardProps) {
 const hotel = useSelector((state: RootState) => state.hotel);

 const hotels = hotel.hotels;
   const selectedHotelId = hotel.selectedHotelId;
  const selectedHotel = hotel?.hotels?.find((h) => h._id === selectedHotelId);
    const occupancyPercentage =
    (selectedHotel!.totalRoomsOccupied! / selectedHotel!.totalRooms!) * 100;
 
  const stats = mockDashboardStats;;
  
  const hotelName = selectedHotel?.hotelName || "No hotel selected";

  const getRoleSpecificContent = () => {
    switch (userRole) {
      case 'super_admin':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">System Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Total Properties</span>
                    <span className="font-semibold">{hotels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Active Users</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">System Status</span>
                    <span className="text-green-600 font-semibold">Online</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{occupancyPercentage}%</div>
                    <div className="text-sm text-secondary-600">Occupancy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.8</div>
                    <div className="text-sm text-secondary-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-secondary-600">Check-ins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">8</div>
                    <div className="text-sm text-secondary-600">Check-outs</div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
                    Manage Users
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
                    System Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'manager':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Operations</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Check-ins</span>
                    <span className="font-semibold">{stats?.arrivals_today || 8}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Check-outs</span>
                    <span className="font-semibold">{stats?.departures_today || 6}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Occupancy</span>
                    <span className="font-semibold">{stats?.occupancy?.today || 85}%</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Staff Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Housekeeping Tasks</span>
                    <span className="font-semibold">{stats?.housekeeping_tasks || 12}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Maintenance Issues</span>
                    <span className="font-semibold">{stats?.maintenance_tasks || 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Guest Requests</span>
                    <span className="font-semibold">{stats?.guest_requests || 5}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'front_desk':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Arrivals</span>
                    <span className="font-semibold text-blue-600">{stats?.arrivals_today || 8}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Departures</span>
                    <span className="font-semibold text-red-600">{stats?.departures_today || 6}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">In House</span>
                    <span className="font-semibold">
                      100
                      {/* {guests.length} */}
                      </span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Check-ins</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">Room 201 - John Doe</span>
                    <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Check In</button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">Room 305 - Jane Smith</span>
                    <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Check In</button>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Pending Tasks</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-orange-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">3 Late check-outs</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">2 Walk-ins waiting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'housekeeping':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Room Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Dirty Rooms</span>
                    <span className="font-semibold text-red-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Cleaning in Progress</span>
                    <span className="font-semibold text-yellow-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Ready for Check-in</span>
                    <span className="font-semibold text-green-600">25</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Tasks</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm">Room 201 - Deep Clean</span>
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">High Priority</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span className="text-sm">Room 305 - Standard Clean</span>
                    <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Medium</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">Room 102 - Quick Clean</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'kitchen':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Kitchen Stations</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Hot Station</span>
                    <span className="font-semibold text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Cold Station</span>
                    <span className="font-semibold text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Pastry Station</span>
                    <span className="font-semibold text-yellow-600">Preparing</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Active Orders</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">Room 201 - Caesar Salad</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">5 min</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm">Room 305 - Grilled Salmon</span>
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">12 min</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">Room 102 - Room Service</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Maintenance Tickets</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Open Tickets</span>
                    <span className="font-semibold text-red-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">In Progress</span>
                    <span className="font-semibold text-yellow-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Completed Today</span>
                    <span className="font-semibold text-green-600">8</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Urgent Issues</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm">Room 201 - AC Not Working</span>
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Urgent</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm">Elevator 2 - Slow Response</span>
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'accounting':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Today's Revenue</span>
                    <span className="font-semibold text-green-600">${stats?.revenue_by_outlet?.rooms || 8450}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">F&B Revenue</span>
                    <span className="font-semibold text-green-600">${stats?.revenue_by_outlet?.f_and_b || 2340}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Pending Payments</span>
                    <span className="font-semibold text-orange-600">{stats?.pending_payments || 3}</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Transactions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Room 201 - Payment</span>
                    <span className="text-green-600">+$150.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Restaurant - Bill</span>
                    <span className="text-green-600">+$45.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Room Service - Refund</span>
                    <span className="text-red-600">-$25.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">CCTV Systems</span>
                    <span className="font-semibold text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Access Control</span>
                    <span className="font-semibold text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Alarm Systems</span>
                    <span className="font-semibold text-green-600">Armed</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Staff login - Front Desk</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">Guest check-in - Room 201</span>
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Maintenance access - Floor 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'guest_services':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Guest Services</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Active Requests</span>
                    <span className="font-semibold text-blue-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Completed Today</span>
                    <span className="font-semibold text-green-600">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Guest Satisfaction</span>
                    <span className="font-semibold text-green-600">4.8/5</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Service Requests</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">Room 201 - Extra Towels</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm">Room 305 - Late Checkout</span>
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">Pending</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">Room 102 - Concierge</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Welcome to {hotelName}</h3>
            <p className="text-secondary-600">Your personalized dashboard is being prepared.</p>
          </div>
        );
    }
  };

  return (
    <div>
      {getRoleSpecificContent()}
    </div>
  );
}
