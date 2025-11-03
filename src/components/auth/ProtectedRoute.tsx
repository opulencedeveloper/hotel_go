'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { RootState } from '@/store';
import { canAccessRoute as checkRouteAccess } from '@/lib/rbac';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requiredPermission,
  fallbackPath = '/dashboard' 
}: ProtectedRouteProps) {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user?.userRole) {
      router.push('/login');
      return;
    }

    // Check if user role is in allowed roles
    if (allowedRoles && allowedRoles.length > 0) {
      const userRoleString = user.userRole.toString();
      if (!allowedRoles.includes(userRoleString)) {
        router.push(fallbackPath);
        return;
      }
    }

    // Check route access based on current path
    const currentPath = window.location.pathname;
    if (!checkRouteAccess(user.userRole, currentPath)) {
      router.push(fallbackPath);
      return;
    }

    // Check specific permission if provided
    if (requiredPermission) {
      // This will be handled by FeatureGuard within the page
      // We can add permission checking here if needed
    }
  }, [user, allowedRoles, requiredPermission, router, fallbackPath]);

  if (!user?.userRole) {
    return null;
  }

  // Check route access
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  if (!checkRouteAccess(user.userRole, currentPath)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Access Denied</h1>
          <p className="text-secondary-600 mb-6">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

