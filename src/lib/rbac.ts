import { UserRole } from "@/utils/enum";

// Define route access for each role
export const routePermissions: Record<string, UserRole[]> = {
  '/dashboard': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ], // Only SuperAdmin and Manager can access dashboard
  '/stays': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.Accounting,
  ],
  '/front-desk': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.Accounting,
  ],
  '/room-management': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.HouseKeeping,
  ],
  '/services': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.GuestServices,
  ],
  '/facilities': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Maintenance,
  ],
  '/folio': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.Accounting,
  ],
  '/pos': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.Kitchen,
  ],
  '/kitchen': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Kitchen,
  ],
  '/housekeeping': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.HouseKeeping,
  ],
  '/staff': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  '/accounting': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Accounting,
  ],
  '/crm': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.GuestServices,
  ],
  '/procurement': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Kitchen,
  ],
  '/analytics': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Accounting,
  ],
  '/security': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Security,
  ],
  '/settings': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
};

// Define feature-level permissions
export const featurePermissions: Record<string, UserRole[]> = {
  // Dashboard features
  'dashboard.view_all_stats': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'dashboard.view_financials': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Accounting,
  ],
  'dashboard.view_occupancy': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'dashboard.view_role_specific': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  
  // User Management
  'users.create': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'users.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'users.delete': [
    UserRole.SuperAdmin,
  ],
  'users.view_all': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  
  // Room Management
  'rooms.create': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'rooms.create_type': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'rooms.edit_type': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'rooms.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'rooms.delete': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'rooms.mark_for_cleaning': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'rooms.view_pricing': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  
  // Reservations/Stays
  'stays.create': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'stays.create_reservation': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'stays.create_booking': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'stays.create_walkin': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'stays.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'stays.cancel': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'stays.check_in': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  'stays.check_out': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
  ],
  
  // Financial
  'financials.view_all': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Accounting,
  ],
  'financials.view_revenue': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Accounting,
  ],
  'financials.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'payments.process': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.FrontDesk,
    UserRole.Accounting,
  ],
  'payments.refund': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  
  // Staff Management
  'staff.view_all': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'staff.create': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'staff.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'staff.delete': [
    UserRole.SuperAdmin,
  ],
  
  // Kitchen Operations
  'kitchen.view_orders': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Kitchen,
  ],
  'kitchen.update_order_status': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Kitchen,
  ],
  
  // Housekeeping
  'housekeeping.view_tasks': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.HouseKeeping,
  ],
  'housekeeping.update_status': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.HouseKeeping,
  ],
  
  // Maintenance / Facilities
  'facilities.create': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'facilities.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'facilities.delete': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'maintenance.view_tasks': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Maintenance,
  ],
  'maintenance.manage_tasks': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Maintenance,
  ],
  
  // Guest Services / Services Management
  'services.create': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'services.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'services.delete': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'services.schedule': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.GuestServices,
  ],
  'guest_services.view_requests': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.GuestServices,
  ],
  'guest_services.manage_requests': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.GuestServices,
  ],
  
  // Settings
  'settings.view': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'settings.edit': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'settings.delete': [
    UserRole.SuperAdmin,
  ],
  
  // Hotel Management
  'hotels.switch': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  'hotels.add': [
    UserRole.SuperAdmin,
    UserRole.Manager,
  ],
  
  // Reports & Analytics
  'reports.view_all': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Accounting,
  ],
  'reports.export': [
    UserRole.SuperAdmin,
    UserRole.Manager,
    UserRole.Accounting,
  ],
};

// Navigation items with role restrictions
export const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: 'Home', 
    description: 'Property overview & KPIs',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
    ],
  },
  { 
    name: 'Stay Management', 
    href: '/stays', 
    icon: 'Calendar', 
    description: 'Reservations, bookings & walk-ins',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.FrontDesk,
      UserRole.Accounting,
    ],
  },
  { 
    name: 'Front Desk', 
    href: '/front-desk', 
    icon: 'UserCheck', 
    description: 'Check-in/out operations',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.FrontDesk,
      UserRole.Accounting,
    ],
  },
  { 
    name: 'Room Management', 
    href: '/room-management', 
    icon: 'Bed', 
    description: 'Rooms, types & rates',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.FrontDesk,
      UserRole.HouseKeeping,
    ],
  },
  { 
    name: 'Services', 
    href: '/services', 
    icon: 'Star', 
    description: 'Spa, events & amenities',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.FrontDesk,
      UserRole.GuestServices,
    ],
  },
  { 
    name: 'Facilities', 
    href: '/facilities', 
    icon: 'Building', 
    description: 'Hotel amenities & infrastructure',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.Maintenance,
    ],
  },
  { 
    name: 'Folio & Payments', 
    href: '/folio', 
    icon: 'CreditCard', 
    description: 'Guest billing & payments',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.FrontDesk,
      UserRole.Accounting,
    ],
  },
  { 
    name: 'POS & F&B', 
    href: '/pos', 
    icon: 'ShoppingCart', 
    description: 'Point of sale system',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.FrontDesk,
      UserRole.Kitchen,
    ],
  },
  { 
    name: 'Kitchen & Restaurant', 
    href: '/kitchen', 
    icon: 'ChefHat', 
    description: 'Kitchen operations',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.Kitchen,
    ],
  },
  { 
    name: 'Housekeeping', 
    href: '/housekeeping', 
    icon: 'Wrench', 
    description: 'Room maintenance',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.HouseKeeping,
    ],
  },
  { 
    name: 'Staff & Payroll', 
    href: '/staff', 
    icon: 'Users', 
    description: 'Employee management',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
    ],
  },
  { 
    name: 'Accounting & Finance', 
    href: '/accounting', 
    icon: 'Calculator', 
    description: 'Financial management',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.Accounting,
    ],
  },
  { 
    name: 'CRM & Loyalty', 
    href: '/crm', 
    icon: 'Heart', 
    description: 'Guest relationships',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.FrontDesk,
      UserRole.GuestServices,
    ],
  },
  { 
    name: 'Procurement & Inventory', 
    href: '/procurement', 
    icon: 'Truck', 
    description: 'Supply management',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.Kitchen,
    ],
  },
  { 
    name: 'Business Analytics', 
    href: '/analytics', 
    icon: 'PieChart', 
    description: 'Data insights',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.Accounting,
    ],
  },
  { 
    name: 'Security & Access Control', 
    href: '/security', 
    icon: 'Lock', 
    description: 'User permissions',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
      UserRole.Security,
    ],
  },
  { 
    name: 'Property Settings', 
    href: '/settings', 
    icon: 'Settings', 
    description: 'System configuration',
    allowedRoles: [
      UserRole.SuperAdmin,
      UserRole.Manager,
    ],
  },
];

/**
 * Check if a user role can access a route
 */
export function canAccessRoute(userRole: UserRole | null, route: string): boolean {
  if (!userRole) return false;
  
  // Normalize the route (remove trailing slashes, ensure it starts with /)
  const normalizedRoute = route.replace(/\/+$/, '') || '/';
  
  // Check exact match first
  if (routePermissions[normalizedRoute]) {
    return routePermissions[normalizedRoute].includes(userRole);
  }
  
  // Check if route starts with any protected route
  // Sort by length (longest first) to match more specific routes first
  const sortedRoutes = Object.keys(routePermissions).sort((a, b) => b.length - a.length);
  
  for (const protectedRoute of sortedRoutes) {
    // Normalize protected route
    const normalizedProtectedRoute = protectedRoute.replace(/\/+$/, '') || '/';
    
    // Check if route starts with protected route (exact or sub-route)
    if (normalizedRoute === normalizedProtectedRoute || normalizedRoute.startsWith(normalizedProtectedRoute + '/')) {
      const allowedRoles = routePermissions[protectedRoute];
      return allowedRoles.includes(userRole);
    }
  }
  
  // Default: deny access if route is not explicitly allowed
  return false;
}

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(userRole: UserRole | null, permission: string): boolean {
  if (!userRole) return false;
  
  const allowedRoles = featurePermissions[permission];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
}

/**
 * Get navigation items filtered by user role
 */
export function getNavigationItemsByRole(userRole: UserRole | null) {
  if (!userRole) return [];
  
  return navigationItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );
}

