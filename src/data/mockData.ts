import { 
  Hotel, Room, Guest, Reservation, Staff, Task, POSItem, POSOrder, DashboardStats, AdminStats,
  Account, Property, Outlet, Device, User, Role, Permission, Booking, Allocation, Folio, Charge, Payment,
  HousekeepingTask, MaintenanceTicket, Employee, Shift, PayrollRun, GuestProfile, LoyaltyProgram,
  Supplier, PurchaseOrder, InventoryItem, Recipe, KitchenStation, YieldRule, Forecast, Report,
  SecurityEvent, Backup, SyncEvent, OfflineQueue
} from '@/types';

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    phone: '+1-555-0123',
    email: 'info@grandplaza.com',
    totalRooms: 150,
    occupiedRooms: 120,
    revenue: 125000,
    status: 'active' as const,
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Ocean View Resort',
    address: '456 Beach Road',
    city: 'Miami',
    country: 'USA',
    phone: '+1-555-0456',
    email: 'contact@oceanview.com',
    totalRooms: 200,
    occupiedRooms: 180,
    revenue: 200000,
    status: 'active' as const,
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    address: '789 Alpine Way',
    city: 'Denver',
    country: 'USA',
    phone: '+1-555-0789',
    email: 'info@mountainlodge.com',
    totalRooms: 80,
    occupiedRooms: 65,
    revenue: 85000,
    status: 'active' as const,
    createdAt: '2023-03-10'
  }
];

export const mockRooms: Room[] = [
  { id: '1', number: '101', type: 'single', status: 'occupied', price: 120, floor: 1, amenities: ['WiFi', 'TV', 'AC'], lastCleaned: '2024-01-10' },
  { id: '2', number: '102', type: 'double', status: 'available', price: 180, floor: 1, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { id: '3', number: '201', type: 'suite', status: 'maintenance', price: 350, floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi'] },
  { id: '4', number: '202', type: 'deluxe', status: 'cleaning', price: 250, floor: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
  { id: '5', number: '301', type: 'single', status: 'available', price: 120, floor: 3, amenities: ['WiFi', 'TV', 'AC'] },
  { id: '6', number: '302', type: 'double', status: 'occupied', price: 180, floor: 3, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] }
];

export const mockGuests: Guest[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0001',
    nationality: 'American',
    idNumber: 'A123456789',
    preferences: ['Non-smoking', 'High floor'],
    loyaltyPoints: 1500
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0002',
    nationality: 'Canadian',
    idNumber: 'C987654321',
    preferences: ['Ocean view', 'Late checkout'],
    loyaltyPoints: 2300
  },
  {
    id: '3',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+1-555-0003',
    nationality: 'Egyptian',
    idNumber: 'E456789123',
    preferences: ['Halal food', 'Prayer mat'],
    loyaltyPoints: 800
  }
];

export const mockReservations: Reservation[] = [
  {
    id: '1',
    guestId: '1',
    roomId: '1',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    status: 'checked-in',
    totalAmount: 360,
    paidAmount: 360,
    adults: 2,
    children: 0,
    specialRequests: 'Late checkout requested',
    createdAt: '2024-01-10',
    guest: mockGuests[0],
    room: mockRooms[0]
  },
  {
    id: '2',
    guestId: '2',
    roomId: '2',
    checkIn: '2024-01-20',
    checkOut: '2024-01-25',
    status: 'confirmed',
    totalAmount: 900,
    paidAmount: 450,
    adults: 2,
    children: 1,
    specialRequests: 'Crib needed',
    createdAt: '2024-01-12',
    guest: mockGuests[1],
    room: mockRooms[1]
  }
];

export const mockStaff: Staff[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hotel.com',
    phone: '+1-555-1001',
    role: 'manager',
    department: 'Management',
    salary: 75000,
    hireDate: '2022-01-15',
    status: 'active' as const,
    shift: 'morning'
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.wilson@hotel.com',
    phone: '+1-555-1002',
    role: 'receptionist',
    department: 'Front Desk',
    salary: 45000,
    hireDate: '2022-03-20',
    status: 'active' as const,
    shift: 'afternoon'
  },
  {
    id: '3',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@hotel.com',
    phone: '+1-555-1003',
    role: 'housekeeping',
    department: 'Housekeeping',
    salary: 35000,
    hireDate: '2022-02-10',
    status: 'active' as const,
    shift: 'morning'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Clean Room 201',
    description: 'Deep clean suite after guest checkout',
    assignedTo: '3',
    department: 'Housekeeping',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-15',
    createdAt: '2024-01-15',
    staff: mockStaff[2]
  },
  {
    id: '2',
    title: 'Fix AC in Room 102',
    description: 'Air conditioning not working properly',
    assignedTo: '4',
    department: 'Maintenance',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2024-01-16',
    createdAt: '2024-01-15'
  }
];

export const mockPOSItems: POSItem[] = [
  { id: '1', name: 'Caesar Salad', category: 'food', price: 12.99, description: 'Fresh romaine lettuce with caesar dressing', available: true },
  { id: '2', name: 'Grilled Salmon', category: 'food', price: 24.99, description: 'Atlantic salmon with lemon butter sauce', available: true },
  { id: '3', name: 'Coca Cola', category: 'beverage', price: 3.99, description: 'Classic soft drink', available: true },
  { id: '4', name: 'Red Wine', category: 'beverage', price: 8.99, description: 'House red wine', available: true },
  { id: '5', name: 'Room Service', category: 'service', price: 5.00, description: 'Room service delivery fee', available: true }
];

export const mockPOSOrders: POSOrder[] = [
  {
    id: '1',
    items: [
      { itemId: '1', quantity: 2, price: 12.99 },
      { itemId: '3', quantity: 2, price: 3.99 }
    ],
    total: 33.96,
    status: 'served',
    roomNumber: '101',
    createdAt: '2024-01-15T14:30:00',
    staffId: '2'
  }
];

export const mockDashboardStats: DashboardStats = {
  // KPI Tiles
  occupancy: {
    today: 85,
    mtd: 78,
    ytd: 82,
    change_percent: 5.2
  },
  adr: {
    today: 156,
    mtd: 148,
    ytd: 142,
    change_percent: 8.3
  },
  revpar: {
    today: 133,
    mtd: 115,
    ytd: 116,
    change_percent: 12.5
  },
  arr: {
    today: 2340,
    mtd: 2180,
    ytd: 2100,
    change_percent: 6.7
  },
  
  // Arrivals & Departures
  arrivals_today: 8,
  arrivals_next_48h: 15,
  departures_today: 6,
  departures_next_48h: 12,
  
  // Active Tasks
  housekeeping_tasks: 12,
  maintenance_tasks: 3,
  guest_requests: 5,
  
  // Revenue by Outlet
  revenue_by_outlet: {
    rooms: 8450,
    f_and_b: 2340,
    other: 890
  },
  
  // Alerts
  overbook_risk: 1,
  low_inventory_alerts: 2,
  sync_errors: 0,
  pending_payments: 3,
  
  // System Status
  last_sync: '2 minutes ago',
  online_status: true,
  pending_sync_items: 0,
  
  // Legacy fields for backward compatibility
  totalRevenue: 125000,
  occupancyRate: 80,
  totalGuests: 120,
  availableRooms: 30,
  pendingReservations: 5,
  todayCheckIns: 8,
  todayCheckOuts: 6,
  monthlyRevenue: 125000,
  monthlyOccupancy: 75
};

export const mockAdminStats: AdminStats = {
  totalHotels: 1250,
  activeHotels: 1180,
  totalRooms: 45000,
  totalRevenue: 12500000,
  monthlyGrowth: 12.5,
  topPerformingHotels: mockHotels
};

// Multi-tenant Account Model
export const mockAccounts: Account[] = [
  {
    account_id: 'acc_001',
    name: 'Grand Hospitality Group',
    billing_info: {
      company_name: 'Grand Hospitality Group LLC',
      address: '123 Business Ave, Suite 100',
      tax_id: '12-3456789',
      payment_method: 'credit_card',
      billing_contact: 'John Smith',
      billing_email: 'billing@grandhospitality.com'
    },
    default_preferences: {
      currency: 'USD',
      timezone: 'America/New_York',
      loyalty_program: true,
      language: 'en',
      date_format: 'MM/DD/YYYY'
    },
    created_at: '2023-01-15T00:00:00Z',
    status: 'active' as const,
    subscription_plan: 'premium'
  }
];

export const mockProperties: Property[] = [
  {
    property_id: 'prop_001',
    account_id: 'acc_001',
    name: 'Grand Plaza Hotel',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postal_code: '10001'
    },
    contact: {
      phone: '+1-555-0123',
      email: 'info@grandplaza.com',
      website: 'www.grandplaza.com'
    },
    timezone: 'America/New_York',
    currency: 'USD',
    tax_rules: {
      tax_rate: 8.5,
      tax_inclusive: false,
      tax_types: ['sales_tax', 'city_tax'],
      service_charge_rate: 18.0,
      city_tax_rate: 2.0
    },
    outlets: [],
    devices: [],
    total_rooms: 150,
    star_rating: 4,
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar'],
    check_in_time: '15:00',
    check_out_time: '11:00',
    status: 'active' as const,
    created_at: '2023-01-15T00:00:00Z',
    settings: {
      allow_overbooking: true,
      overbooking_tolerance: 5,
      auto_assign_rooms: false,
      require_deposit: true,
      min_deposit_percentage: 20
    }
  }
];

export const mockOutlets: Outlet[] = [
  {
    outlet_id: 'outlet_001',
    property_id: 'prop_001',
    name: 'Grand Restaurant',
    type: 'restaurant',
    location: 'Ground Floor',
    floor: 1,
    status: 'active' as const,
    settings: {
      tax_rate: 8.5,
      service_charge: 18.0,
      auto_close_time: '22:00',
      opening_hours: {
        monday: { open: '06:00', close: '22:00', closed: false },
        tuesday: { open: '06:00', close: '22:00', closed: false },
        wednesday: { open: '06:00', close: '22:00', closed: false },
        thursday: { open: '06:00', close: '22:00', closed: false },
        friday: { open: '06:00', close: '23:00', closed: false },
        saturday: { open: '07:00', close: '23:00', closed: false },
        sunday: { open: '07:00', close: '21:00', closed: false }
      },
      pos_printer_id: 'device_001',
      kitchen_printer_id: 'device_002'
    },
    manager_id: 'user_001',
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockDevices: Device[] = [
  {
    device_id: 'device_001',
    property_id: 'prop_001',
    name: 'Main POS Printer',
    type: 'receipt_printer',
    location: 'Front Desk',
    outlet_id: 'outlet_001',
    status: 'online',
    last_sync: '2024-01-15T10:30:00Z',
    ip_address: '192.168.1.100',
    settings: {
      printer_type: 'thermal',
      paper_size: '80mm',
      connection_type: 'ethernet'
    },
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    user_id: 'user_001',
    account_id: 'acc_001',
    property_id: 'prop_001',
    email: 'manager@grandplaza.com',
    first_name: 'John',
    last_name: 'Doe',
    role_id: 'role_001',
    department: 'Management',
    status: 'active' as const,
    last_login: '2024-01-15T09:00:00Z',
    created_at: '2023-01-15T00:00:00Z',
    permissions: [],
    two_factor_enabled: true
  }
];

export const mockRoles: Role[] = [
  {
    role_id: 'role_001',
    property_id: 'prop_001',
    name: 'Property Manager',
    description: 'Full access to property operations',
    permissions: [],
    is_system_role: false,
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockBookings: Booking[] = [
  {
    booking_id: 'booking_001',
    property_id: 'prop_001',
    status: 'confirmed',
    arrival_date: '2024-01-20',
    departure_date: '2024-01-25',
    total_amount: 1200.00,
    source: 'direct',
    adults: 2,
    children: 1,
    special_requests: 'Late checkout requested',
    created_at: '2024-01-10T00:00:00Z',
    guest: mockGuests[0],
    allocations: []
  }
];

export const mockHousekeepingTasks: HousekeepingTask[] = [
  {
    task_id: 'task_001',
    property_id: 'prop_001',
    room_id: 'room_001',
    type: 'cleaning',
    priority: 'high',
    status: 'pending',
    assigned_to: 'user_002',
    estimated_duration: 45,
    due_time: '2024-01-15T14:00:00Z',
    created_at: '2024-01-15T10:00:00Z'
  }
];

export const mockMaintenanceTickets: MaintenanceTicket[] = [
  {
    ticket_id: 'ticket_001',
    property_id: 'prop_001',
    room_id: 'room_001',
    title: 'AC Unit Not Working',
    description: 'Air conditioning unit in room 201 is not cooling properly',
    category: 'hvac',
    priority: 'high',
    status: 'open' as const,
    reported_by: 'user_001',
    reported_at: '2024-01-15T08:00:00Z'
  }
];

export const mockGuestProfiles: GuestProfile[] = [
  {
    guest_id: 'guest_001',
    property_id: 'prop_001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0001',
    nationality: 'American',
    id_type: 'passport',
    id_number: 'A123456789',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postal_code: '10001'
    },
    preferences: [],
    loyalty_tier: 'gold',
    loyalty_points: 2500,
    total_stays: 15,
    total_spent: 8500.00,
    last_stay: '2023-12-15',
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockLoyaltyPrograms: LoyaltyProgram[] = [
  {
    program_id: 'loyalty_001',
    property_id: 'prop_001',
    name: 'Grand Rewards',
    description: 'Earn points for every stay and redeem for rewards',
    tiers: [
      {
        tier_id: 'tier_001',
        name: 'Bronze',
        min_points: 0,
        benefits: ['Welcome amenity'],
        discount_percentage: 0
      },
      {
        tier_id: 'tier_002',
        name: 'Silver',
        min_points: 1000,
        benefits: ['Welcome amenity', 'Late checkout'],
        discount_percentage: 5
      },
      {
        tier_id: 'tier_003',
        name: 'Gold',
        min_points: 2500,
        benefits: ['Welcome amenity', 'Late checkout', 'Room upgrade'],
        discount_percentage: 10
      },
      {
        tier_id: 'tier_004',
        name: 'Platinum',
        min_points: 5000,
        benefits: ['Welcome amenity', 'Late checkout', 'Room upgrade', 'Complimentary breakfast'],
        discount_percentage: 15
      }
    ],
    point_rules: [
      {
        rule_id: 'rule_001',
        action: 'earn',
        points_per_dollar: 10,
        valid_from: '2023-01-01'
      }
    ],
    status: 'active' as const,
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    supplier_id: 'supplier_001',
    property_id: 'prop_001',
    name: 'Fresh Food Supply Co.',
    contact_person: 'Mike Johnson',
    email: 'orders@freshfood.com',
    phone: '+1-555-1000',
    address: {
      street: '456 Supply St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postal_code: '10002'
    },
    payment_terms: 'Net 30',
    credit_limit: 50000,
    status: 'active' as const,
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockRecipes: Recipe[] = [
  {
    recipe_id: 'recipe_001',
    outlet_id: 'outlet_001',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing',
    prep_time: 15,
    cook_time: 0,
    servings: 1,
    ingredients: [
      {
        ingredient_id: 'ingredient_001',
        quantity: 1,
        unit: 'head',
        cost_per_unit: 2.50
      }
    ],
    instructions: ['Wash and chop lettuce', 'Add dressing', 'Serve immediately'],
    allergens: ['dairy', 'eggs'],
    cost: 3.50,
    selling_price: 12.99,
    status: 'active' as const
  }
];

export const mockKitchenStations: KitchenStation[] = [
  {
    station_id: 'station_001',
    outlet_id: 'outlet_001',
    name: 'Salad Station',
    type: 'cold',
    printer_id: 'device_002',
    status: 'active' as const
  }
];

export const mockYieldRules: YieldRule[] = [
  {
    rule_id: 'yield_001',
    property_id: 'prop_001',
    name: 'Weekend Premium',
    conditions: {
      days_ahead: 7,
      occupancy_threshold: 80,
      day_of_week: ['friday', 'saturday', 'sunday'],
      season: 'peak'
    },
    actions: {
      rate_adjustment: 25,
      min_los: 2,
      max_los: 7,
      close_to_arrival: false
    },
    status: 'active' as const,
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockForecasts: Forecast[] = [
  {
    forecast_id: 'forecast_001',
    property_id: 'prop_001',
    forecast_type: 'occupancy',
    forecast_date: '2024-01-15',
    period_start: '2024-01-20',
    period_end: '2024-01-27',
    predicted_value: 85,
    confidence_level: 0.85,
    factors: [
      {
        factor_name: 'Historical Data',
        impact: 0.6,
        weight: 0.4,
        description: 'Based on same period last year'
      }
    ],
    created_at: '2024-01-15T00:00:00Z'
  }
];

export const mockReports: Report[] = [
  {
    report_id: 'report_001',
    property_id: 'prop_001',
    name: 'Daily Occupancy Report',
    description: 'Daily occupancy and revenue summary',
    category: 'operational',
    template: {
      template_id: 'template_001',
      name: 'Daily Summary',
      description: 'Standard daily report template',
      query: 'SELECT * FROM bookings WHERE date = ?',
      parameters: ['date'],
      output_format: 'pdf'
    },
    parameters: [
      {
        parameter_name: 'date',
        parameter_type: 'date',
        required: true
      }
    ],
    status: 'active' as const,
    created_by: 'user_001',
    created_at: '2023-01-15T00:00:00Z'
  }
];

export const mockSecurityEvents: SecurityEvent[] = [
  {
    event_id: 'security_001',
    property_id: 'prop_001',
    user_id: 'user_001',
    event_type: 'login',
    severity: 'low',
    description: 'Successful login',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0...',
    timestamp: '2024-01-15T09:00:00Z',
    resolved: true
  }
];

export const mockBackups: Backup[] = [
  {
    backup_id: 'backup_001',
    property_id: 'prop_001',
    backup_type: 'full',
    status: 'completed',
    size_bytes: 1073741824,
    created_at: '2024-01-15T02:00:00Z',
    completed_at: '2024-01-15T02:30:00Z',
    location: '/backups/prop_001_20240115.bak',
    checksum: 'sha256:abc123...',
    retention_days: 30
  }
];

export const mockSyncEvents: SyncEvent[] = [
  {
    sync_event_id: 'sync_001',
    property_id: 'prop_001',
    device_id: 'device_001',
    event_type: 'push',
    entity_type: 'booking',
    entity_id: 'booking_001',
    status: 'completed',
    client_txn_id: 'client_txn_001',
    server_txn_id: 'server_txn_001',
    created_at: '2024-01-15T10:00:00Z',
    processed_at: '2024-01-15T10:01:00Z'
  }
];

export const mockOfflineQueue: OfflineQueue[] = [
  {
    queue_id: 'queue_001',
    property_id: 'prop_001',
    device_id: 'device_001',
    operation: 'create',
    entity_type: 'booking',
    entity_data: { guest_name: 'John Doe', room_number: '201' },
    client_txn_id: 'client_txn_002',
    status: 'pending',
    retry_count: 0,
    created_at: '2024-01-15T10:00:00Z'
  }
];

// Additional mock data for components
export const mockRoomTypes = [
  {
    room_type_id: 'type_001',
    property_id: 'prop_001',
    name: 'Standard Room',
    description: 'Comfortable standard room with basic amenities',
    capacity: 2,
    base_rate: 150,
    amenities: ['WiFi', 'TV', 'AC'],
    images: ['/images/standard-room-1.jpg', '/images/standard-room-2.jpg']
  },
  {
    room_type_id: 'type_002',
    property_id: 'prop_001',
    name: 'Deluxe Room',
    description: 'Spacious deluxe room with premium amenities',
    capacity: 3,
    base_rate: 250,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
    images: ['/images/deluxe-room-1.jpg', '/images/deluxe-room-2.jpg']
  },
  {
    room_type_id: 'type_003',
    property_id: 'prop_001',
    name: 'Suite',
    description: 'Luxurious suite with separate living area',
    capacity: 4,
    base_rate: 400,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi'],
    images: ['/images/suite-1.jpg', '/images/suite-2.jpg']
  }
];

export const mockRatePlans = [
  {
    rate_plan_id: 'rate_001',
    property_id: 'prop_001',
    name: 'Standard Rate',
    code: 'STD',
    rules: {
      min_los: 1,
      max_los: 30,
      blackout_dates: [],
      advance_booking_days: 365,
      cancellation_policy: '24 hours'
    },
    rates: {
      '2024-01-20': 150,
      '2024-01-21': 150,
      '2024-01-22': 150
    },
    status: 'active' as const
  },
  {
    rate_plan_id: 'rate_002',
    property_id: 'prop_001',
    name: 'Corporate Rate',
    code: 'CORP',
    rules: {
      min_los: 1,
      max_los: 14,
      blackout_dates: [],
      advance_booking_days: 30,
      cancellation_policy: '48 hours'
    },
    rates: {
      '2024-01-20': 120,
      '2024-01-21': 120,
      '2024-01-22': 120
    },
    status: 'active' as const
  },
  {
    rate_plan_id: 'rate_003',
    property_id: 'prop_001',
    name: 'Weekend Special',
    code: 'WKD',
    rules: {
      min_los: 2,
      max_los: 3,
      blackout_dates: [],
      advance_booking_days: 7,
      cancellation_policy: '24 hours'
    },
    rates: {
      '2024-01-20': 180,
      '2024-01-21': 180,
      '2024-01-22': 180
    },
    status: 'active' as const
  }
];

export const mockFolios = [
  {
    folio_id: 'folio_001',
    booking_id: 'booking_001',
    balance: 600.00,
    currency: 'USD',
    status: 'open' as const,
    charges: [
      {
        charge_id: 'charge_001',
        folio_id: 'folio_001',
        description: 'Room Rate - 3 nights',
        amount: 450.00,
        posted_by: 'user_001',
        posted_at: '2024-01-15T00:00:00Z',
        category: 'room' as const
      },
      {
        charge_id: 'charge_002',
        folio_id: 'folio_001',
        description: 'Restaurant - Dinner',
        amount: 45.50,
        posted_by: 'user_002',
        posted_at: '2024-01-16T00:00:00Z',
        category: 'f&b' as const,
        outlet_id: 'outlet_001'
      }
    ],
    payments: [
      {
        payment_id: 'payment_001',
        folio_id: 'folio_001',
        amount: 300.00,
        method: 'card' as const,
        reference: 'CC123456789',
        processed_by: 'user_001',
        processed_at: '2024-01-15T00:00:00Z',
        status: 'completed' as const
      }
    ]
  },
  {
    folio_id: 'folio_002',
    booking_id: 'booking_002',
    balance: 0.00,
    currency: 'USD',
    status: 'closed' as const,
    charges: [
      {
        charge_id: 'charge_003',
        folio_id: 'folio_002',
        description: 'Room Rate - 2 nights',
        amount: 300.00,
        posted_by: 'user_001',
        posted_at: '2024-01-14T00:00:00Z',
        category: 'room' as const
      }
    ],
    payments: [
      {
        payment_id: 'payment_002',
        folio_id: 'folio_002',
        amount: 300.00,
        method: 'cash' as const,
        reference: 'CASH001',
        processed_by: 'user_001',
        processed_at: '2024-01-14T00:00:00Z',
        status: 'completed' as const
      }
    ]
  }
];
