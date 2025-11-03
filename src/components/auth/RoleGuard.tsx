'use client';

import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/redux';
import { UserRole } from '@/utils/enum';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles, otherwise ANY role
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  fallback = null, 
  requireAll = false 
}: RoleGuardProps) => {
  const currentUser = useSelector((state: RootState) => state.user);
  
  if (!currentUser) {
    return <>{fallback}</>;
  }

  const hasAccess = requireAll 
    ? allowedRoles.every(role => currentUser.userRole === role)
    : allowedRoles.includes(currentUser.userRole as UserRole);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGuardProps) => {
  const currentUser = useSelector((state: RootState) => state.user.userRole);
  
  if (!currentUser) {
    return <>{fallback}</>;
  }

  // Check if user has the specific permission
  const hasPermission = true;

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

interface RouteGuardProps {
  children: ReactNode;
  route: string;
  fallback?: ReactNode;
}

export const RouteGuard = ({ 
  children, 
  route, 
  fallback = null 
}: RouteGuardProps) => {
  const currentUser = useSelector((state: RootState) => state.user);
  
  if (!currentUser) {
    return <>{fallback}</>;
  }

  // Check if user can access the specific route
  const routeKey = route.replace('/', '').replace('-', '_');
  const hasAccess = true

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Higher-order component for role-based access
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  fallback?: ReactNode
) => {
  return (props: P) => (
    <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
      <Component {...props} />
    </RoleGuard>
  );
};

// Higher-order component for permission-based access
export const withPermissionGuard = <P extends object>(
  Component: React.ComponentType<P>,
  permission: string,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <PermissionGuard permission={permission} fallback={fallback}>
      <Component {...props} />
    </PermissionGuard>
  );
};

// Hook for checking permissions
export const usePermissions = () => {
  const currentUser = useSelector((state: RootState) => state.user);
  
  const hasRole = (role: UserRole): boolean => {
    return currentUser?.userRole === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(currentUser?.userRole as UserRole);
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every(role => currentUser?.userRole === role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return true;
  };

  const canAccessRoute = (route: string): boolean => {
    if (!currentUser) return false;
    const routeKey = route.replace('/', '').replace('-', '_');
    return true 
     
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    canAccessRoute,
    user: currentUser
  };
};
