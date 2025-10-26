'use client';

import { Users, Clock, LogIn, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface FrontDeskDashboardProps {
  stats: any;
}

export default function FrontDeskDashboard({ stats }: FrontDeskDashboardProps) {
  const stay = useSelector((state: RootState) => state.stay);
  const room = useSelector((state: RootState) => state.room);
  
  // Calculate today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's arrivals and departures from Redux state
  const todaysArrivals = stay.stays.filter(stay => 
    stay.checkInDate === today && stay.status === 'confirmed'
  );
  
  const todaysDepartures = stay.stays.filter(stay => 
    stay.checkOutDate === today && stay.status === 'checked-in'
  );
  
  // Get current in-house guests
  const inHouseGuests = stay.stays.filter(stay => 
    stay.status === 'checked-in'
  );
  
  // Get pending check-ins (arrivals that haven't checked in yet)
  const pendingLogIns = todaysArrivals.filter(stay => 
    stay.status === 'confirmed'
  ).slice(0, 2);
  
  // Calculate late check-outs (departures that are overdue)
  const currentTime = new Date();
  const lateLogOuts = todaysDepartures.filter(stay => {
    const checkOutTime = new Date(stay.checkOutDate + 'T11:00:00'); // Assuming 11 AM checkout
    return currentTime > checkOutTime;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Arrivals</span>
              <span className="font-semibold text-blue-600">{todaysArrivals.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Departures</span>
              <span className="font-semibold text-red-600">{todaysDepartures.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">In House</span>
              <span className="font-semibold text-green-600">{inHouseGuests.length}</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Check-ins</h3>
          <div className="space-y-2">
            {pendingLogIns.length > 0 ? (
              pendingLogIns.map((stay) => (
                <div key={stay._id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">
                    {stay.roomId.roomNumber} - {stay.guestName}
                  </span>
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Check In
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-2">
                <p className="text-sm">No pending check-ins</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Pending Tasks</h3>
          <div className="space-y-2">
            <div className="flex items-center text-orange-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{lateLogOuts.length} Late check-outs</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{pendingLogIns.length} Pending check-ins</span>
            </div>
            <div className="flex items-center text-green-600">
              <LogIn className="w-4 h-4 mr-2" />
              <span className="text-sm">{room.hotelRooms.filter(r => r.roomStatus === 'available').length} Available rooms</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Guest Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Guest Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{todaysArrivals.length}</div>
            <div className="text-sm text-gray-600">Today's Arrivals</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{todaysDepartures.length}</div>
            <div className="text-sm text-gray-600">Today's Departures</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{inHouseGuests.length}</div>
            <div className="text-sm text-gray-600">In House</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{lateLogOuts.length}</div>
            <div className="text-sm text-gray-600">Late Checkouts</div>
          </div>
        </div>
      </div>
    </div>
  );
}






