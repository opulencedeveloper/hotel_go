import { Hotel, Room, Guest, Reservation, Staff, Task, POSItem, POSOrder, DashboardStats, AdminStats } from '@/types';

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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
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
