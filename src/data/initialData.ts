// Initial data structure for the application
// This file contains the initial state structure without mock data

export const initialDashboardStats = {
  overview: {
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalGuests: 0,
    vipGuests: 0,
    totalStaff: 0,
    activeStaff: 0,
    totalReservations: 0,
    todayArrivals: 0,
    todayDepartures: 0,
  },
  revenue: {
    todayRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    averageRoomRate: 0,
  },
  occupancy: {
    currentOccupancyRate: 0,
    monthlyOccupancyRate: 0,
    yearlyOccupancyRate: 0,
  },
  alerts: [],
};

export const initialReservations = [];

export const initialGuests = [];

export const initialRooms = [];

export const initialStaff = [];

// Sample data for development/testing (can be removed in production)
export const sampleData = {
  reservations: [
    {
      id: 'sample-1',
      reservationNumber: 'RES-SAMPLE-001',
      guestId: 'guest-sample-1',
      roomId: 'room-sample-1',
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      adults: 2,
      children: 0,
      status: 'confirmed',
      totalAmount: 300,
      paidAmount: 300,
      balance: 0,
      paymentStatus: 'paid',
      paymentMethod: 'card',
      specialRequests: 'Late checkout requested',
      notes: 'Anniversary celebration',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  guests: [
    {
      id: 'guest-sample-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      nationality: 'American',
      idNumber: 'ID123456789',
      preferences: ['Non-smoking', 'High floor'],
      loyaltyPoints: 150,
      totalStays: 5,
      isVip: false,
      hotelId: 'hotel-sample-1',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  rooms: [
    {
      id: 'room-sample-1',
      roomNumber: '101',
      roomType: 'double',
      floor: 1,
      status: 'available',
      pricePerNight: 150,
      maxOccupancy: 2,
      amenities: ['WiFi', 'TV', 'Mini Bar'],
      description: 'Comfortable double room with city view',
      hotelId: 'hotel-sample-1',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  staff: [
    {
      id: 'staff-sample-1',
      employeeId: 'EMP001',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@hotel.com',
      phone: '+1-555-0456',
      position: 'Front Desk Manager',
      department: 'front_desk',
      role: 'manager',
      hireDate: new Date('2023-01-15').toISOString(),
      shift: 'morning',
      status: 'active',
      skills: ['Customer Service', 'Reservation Management'],
      certifications: ['Hospitality Management'],
      hotelId: 'hotel-sample-1',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Helper function to get empty state
export const getEmptyState = () => ({
  reservations: [],
  guests: [],
  rooms: [],
  staff: [],
  dashboardStats: initialDashboardStats
});

// Helper function to get sample state for development
export const getSampleState = () => ({
  reservations: sampleData.reservations,
  guests: sampleData.guests,
  rooms: sampleData.rooms,
  staff: sampleData.staff,
  dashboardStats: {
    ...initialDashboardStats,
    overview: {
      ...initialDashboardStats.overview,
      totalRooms: 1,
      availableRooms: 1,
      totalGuests: 1,
      totalStaff: 1,
      activeStaff: 1,
      totalReservations: 1
    }
  }
});















