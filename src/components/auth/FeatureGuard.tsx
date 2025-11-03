'use client';

import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { hasPermission as checkPermission } from '@/lib/rbac';

interface FeatureGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
  hideOnNoAccess?: boolean;
}

/**
 * FeatureGuard component that conditionally renders children based on user permissions.
 * Use this to hide/show features within a page based on the user's role.
 * 
 * @example
 * <FeatureGuard permission="users.create">
 *   <button>Create User</button>
 * </FeatureGuard>
 */
export default function FeatureGuard({ 
  children, 
  permission,
  fallback = null,
  hideOnNoAccess = true
}: FeatureGuardProps) {
  const user = useSelector((state: RootState) => state.user);

  if (!user?.userRole) {
    return hideOnNoAccess ? null : <>{fallback}</>;
  }

  const hasAccess = checkPermission(user.userRole, permission);

  if (!hasAccess) {
    return hideOnNoAccess ? null : <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to check if user has a specific permission
 */
export function useFeaturePermission(permission: string): boolean {
  const user = useSelector((state: RootState) => state.user);

  if (!user?.userRole) {
    return false;
  }

  return checkPermission(user.userRole, permission);
}

/**
 * Hook to check multiple permissions (returns true if user has any of them)
 */
export function useFeaturePermissions(permissions: string[]): boolean {
  const user = useSelector((state: RootState) => state.user);

  if (!user?.userRole) {
    return false;
  }

  return permissions.some(permission => checkPermission(user.userRole, permission));
}

