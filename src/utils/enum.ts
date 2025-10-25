export enum UserRole {
  SuperAdmin = "super_admin",
  Manager = "manager",
  FrontDesk = "front_desk",
  HouseKeeping = "housekeeping",
  Kitchen = "kitchen",
  Maintenance = "maintenance",
  Accounting = "accounting",
  Security = "security",
  GuestServices = "guest_services",
}


export enum PaymentMethod {
  CARD_PAYMENT = "card_payment",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}


export enum StayType {
  RESERVED = "reserved",
  BOOKED = "booked",
  WALK_IN = "walk_in",
}

export enum PaymentStatus {
  PENDING = "pending",           
  PAID = "paid",                 
  REFUNDED = "refunded",        
  CANCELLED = "cancelled",       
}


export enum StayStatus {
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
}

export enum HotelServiceCategory {
  SPA = 'spa',
  RESTAURANT = 'restaurant',
  TRANSPORT = 'transport',
  FITNESS = 'fitness',
  PHOTOGRAPHY = 'photography',
  ENTERTAINMENT = 'entertainment',
  GIFT_SHOP = 'gift_shop',
  EVENT_CENTER = 'event_center',
  CONCIERGE = 'concierge',
  LAUNDRY = 'laundry',
}

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}


export enum MenuCategory {
  Appetizer = "appetizer",
  MainCourse = "main_course",
  Dessert = "dessert",
  Beverage = "beverage",
  Salad = "salad",
  Soup = "soup",
}

export enum MenuStatus {
  Available = "available",
  Unavailable = "unavailable",
}


export enum OrderType {
  RESTAURANT = "restaurant",
  HOTEL_GUEST = "hotel_guest",
  WALK_IN = "walk_in",
}

export enum OrderStatus {
  PENDING = "pending",
  READY = "ready",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export enum StaffRole {
  Manager = "manager",
  FrontDesk = "front_desk",
  HouseKeeping = "housekeeping",
  Kitchen = "kitchen",
  Maintenance = "maintenance",
  Accounting = "accounting",
  Security = "security",
  GuestServices = "guest_services",
}

export enum StaffShift {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  NIGHT = "night",
}

export enum StaffStatus {
  ACTIVE = "active",           // Currently working and active
  INACTIVE = "inactive",       // Temporarily not working or deactivated
  ON_LEAVE = "on_leave",       // On vacation or official leave
  TERMINATED = "terminated",   // No longer employed
  SUSPENDED = "suspended",     // Temporarily suspended due to disciplinary action
  PENDING = "pending",         // Newly added staff awaiting approval/setup
}
