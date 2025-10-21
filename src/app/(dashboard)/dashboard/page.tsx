'use client';

import { useRouter } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="space-y-6">
      {/* Role-Based Dashboard Content */}
      {user && <RoleBasedDashboard userRole={user.userRole!} />}
      
      {/* Main Dashboard Overview */}
      <DashboardOverview />
    </div>
  );
}