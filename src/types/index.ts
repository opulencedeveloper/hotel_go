export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  totalRooms: number;
  occupiedRooms: number;
  revenue: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  floor: number;
  amenities: string[];
  lastCleaned?: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  idNumber: string;
  preferences: string[];
  loyaltyPoints: number;
}

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paidAmount: number;
  adults: number;
  children: number;
  specialRequests: string;
  createdAt: string;
  guest?: Guest;
  room?: Room;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'manager' | 'receptionist' | 'housekeeping' | 'kitchen' | 'maintenance' | 'admin';
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive';
  shift: 'morning' | 'afternoon' | 'night';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  staff?: Staff;
}

export interface POSItem {
  id: string;
  name: string;
  category: 'food' | 'beverage' | 'service';
  price: number;
  description: string;
  available: boolean;
  image?: string;
}

export interface POSOrder {
  id: string;
  items: {
    itemId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  tableNumber?: string;
  roomNumber?: string;
  createdAt: string;
  staffId: string;
}

export interface DashboardStats {
  totalRevenue: number;
  occupancyRate: number;
  totalGuests: number;
  availableRooms: number;
  pendingReservations: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  monthlyRevenue: number;
  monthlyOccupancy: number;
}

export interface AdminStats {
  totalHotels: number;
  activeHotels: number;
  totalRooms: number;
  totalRevenue: number;
  monthlyGrowth: number;
  topPerformingHotels: Hotel[];
}
