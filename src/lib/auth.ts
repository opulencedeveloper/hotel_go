// Authentication and user management utilities
import Cookies from 'js-cookie';
import { UserRole } from '@/utils/enum';
import { getNavigationItemsByRole, canAccessRoute as checkRouteAccess, hasPermission as checkPermission } from './rbac';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  propertyId: string;
  hotelId?: string;
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Navigation items - Filtered by role
export const getNavigationItems = (userRole: UserRole | null) => {
  return getNavigationItemsByRole(userRole);
};

// Check if user has permission for a specific action
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  return checkPermission(user.role, permission);
};

// Check if user can access a specific route
export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;
  return checkRouteAccess(user.role, route);
};

// Real authentication function
export const authenticateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    if (data.success && data.data && data.data.user) {
      return data.data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch('/api/v1/user/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('auth-token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.SuperAdmin]: 'Super Administrator',
    [UserRole.Manager]: 'Hotel Manager',
    [UserRole.FrontDesk]: 'Front Desk Agent',
    [UserRole.HouseKeeping]: 'Housekeeping Staff',
    [UserRole.Kitchen]: 'Kitchen Staff',
    [UserRole.Maintenance]: 'Maintenance Staff',
    [UserRole.Accounting]: 'Accounting Staff',
    [UserRole.Security]: 'Security Staff',
    [UserRole.GuestServices]: 'Guest Services'
  };
  
  return roleNames[role];
};

// Get department display name
export const getDepartmentDisplayName = (department: string): string => {
  const departmentNames: Record<string, string> = {
    'Administration': 'Administration',
    'Management': 'Management',
    'Front Office': 'Front Office',
    'Housekeeping': 'Housekeeping',
    'Food & Beverage': 'Food & Beverage',
    'Maintenance': 'Maintenance',
    'Finance': 'Finance',
    'Security': 'Security',
    'Guest Services': 'Guest Services'
  };
  
  return departmentNames[department] || department;
};
