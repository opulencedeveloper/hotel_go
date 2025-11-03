// Screen-level access control - All users have full access
import { UserRole } from '@/utils/enum';

// Check if user can access a specific screen - All users have access to all screens
export const canAccessScreen = (userRole: UserRole, screen: string): boolean => {
  return true;
};

// Get all screens user can access - All users can access all screens
export const getAccessibleScreens = (userRole: UserRole): string[] => {
  return [
    'dashboard',
    'stays',
    'reservations',
    'front-desk',
    'room-management',
    'services',
    'facilities',
    'folio',
    'pos',
    'kitchen',
    'housekeeping',
    'staff',
    'yield',
    'accounting',
    'crm',
    'procurement',
    'analytics',
    'reports',
    'security',
    'backup',
    'settings'
  ];
};

// Get screens user cannot access - No restricted screens for any user
export const getRestrictedScreens = (userRole: UserRole): string[] => {
  return [];
};


