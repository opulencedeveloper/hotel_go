'use client';

import { mockProperties, mockDashboardStats } from "@/data/mockData";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import SuperAdminDashboard from './SuperAdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import FrontDeskDashboard from './FrontDeskDashboard';
import HousekeepingDashboard from './HousekeepingDashboard';
import KitchenDashboard from './KitchenDashboard';
import MaintenanceDashboard from './MaintenanceDashboard';
import AccountingDashboard from './AccountingDashboard';
import SecurityDashboard from './SecurityDashboard';
import GuestServicesDashboard from './GuestServicesDashboard';
import { UserRole } from "@/utils/enum";

interface RoleBasedDashboardProps {
  userRole: UserRole;
}
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
      case UserRole.SuperAdmin:
        return <SuperAdminDashboard hotels={hotels} occupancyPercentage={occupancyPercentage} />;

      case UserRole.Manager:
        return <ManagerDashboard stats={stats} />;

      case UserRole.FrontDesk:
        return <FrontDeskDashboard stats={stats} />;

      case UserRole.HouseKeeping:
        return <HousekeepingDashboard />;

      case UserRole.Kitchen:
        return <KitchenDashboard />;

      case UserRole.Maintenance:
        return <MaintenanceDashboard />;

      case UserRole.Accounting:
        return <AccountingDashboard stats={stats} />;

      case UserRole.Security:
        return <SecurityDashboard />;

      case UserRole.GuestServices:
        return <GuestServicesDashboard />;

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
