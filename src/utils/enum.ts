export enum UserRole {
  SuperAdmin = "super_admin",
  Admin = "admin",
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
  OTHER = "other",
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