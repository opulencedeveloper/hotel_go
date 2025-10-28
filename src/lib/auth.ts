// Authentication and user management utilities
import Cookies from 'js-cookie';

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

export type UserRole = 
  | 'super_admin'
  | 'admin' 
  | 'manager' 
  | 'front_desk' 
  | 'housekeeping' 
  | 'kitchen' 
  | 'maintenance' 
  | 'accounting' 
  | 'security' 
  | 'guest_services';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}


// Navigation items - All users have access to all features
export const getNavigationItems = (userRole: UserRole) => {
  return [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home', description: 'Property overview & KPIs' },
    { name: 'Stay Management', href: '/stays', icon: 'Calendar', description: 'Reservations, bookings & walk-ins' },
    { name: 'Front Desk', href: '/front-desk', icon: 'UserCheck', description: 'Check-in/out operations' },
    //{ name: 'Stay History', href: '/front-desk/history', icon: 'Clock', description: 'Complete stay history & records' },
    { name: 'Room Management', href: '/room-management', icon: 'Bed', description: 'Rooms, types & rates' },
    { name: 'Services', href: '/services', icon: 'Star', description: 'Spa, events & amenities' },
    { name: 'Facilities', href: '/facilities', icon: 'Building', description: 'Hotel amenities & infrastructure' },
    { name: 'Folio & Payments', href: '/folio', icon: 'CreditCard', description: 'Guest billing & payments' },
    { name: 'POS & F&B', href: '/pos', icon: 'ShoppingCart', description: 'Point of sale system' },
    { name: 'Kitchen & Restaurant', href: '/kitchen', icon: 'ChefHat', description: 'Kitchen operations' },
    { name: 'Housekeeping', href: '/housekeeping', icon: 'Wrench', description: 'Room maintenance' },
    { name: 'Staff & Payroll', href: '/staff', icon: 'Users', description: 'Employee management' },
  //  { name: 'Yield & Rate Management', href: '/yield', icon: 'TrendingUp', description: 'Dynamic pricing' },
    { name: 'Accounting & Finance', href: '/accounting', icon: 'Calculator', description: 'Financial management' },
   { name: 'CRM & Loyalty', href: '/crm', icon: 'Heart', description: 'Guest relationships' },
    { name: 'Procurement & Inventory', href: '/procurement', icon: 'Truck', description: 'Supply management' },
   { name: 'Business Analytics', href: '/analytics', icon: 'PieChart', description: 'Data insights' },
   // { name: 'Reports & Dashboards', href: '/reports', icon: 'Download', description: 'Report generation' },
    { name: 'Security & Access Control', href: '/security', icon: 'Lock', description: 'User permissions' },
   // { name: 'Backup & Data Recovery', href: '/backup', icon: 'Archive', description: 'Data protection' },
    { name: 'Property Settings', href: '/settings', icon: 'Settings', description: 'System configuration' },
  ];
};

// Check if user has permission for a specific action - All users have full access
export const hasPermission = (user: User, permission: string): boolean => {
  return true;
};

// Check if user can access a specific route - All users have full access
export const canAccessRoute = (user: User, route: string): boolean => {
  return true;
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
    super_admin: 'Super Administrator',
    admin: 'System Administrator',
    manager: 'Hotel Manager',
    front_desk: 'Front Desk Agent',
    housekeeping: 'Housekeeping Staff',
    kitchen: 'Kitchen Staff',
    maintenance: 'Maintenance Staff',
    accounting: 'Accounting Staff',
    security: 'Security Staff',
    guest_services: 'Guest Services'
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
