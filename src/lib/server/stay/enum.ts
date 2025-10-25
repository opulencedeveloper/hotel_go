export enum PaymentMethod {
  CARD_PAYMENT = "card_payment",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}

export enum StayStatus {
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
}

//This order should not be changed as It was used in the stay service
export enum PaymentStatus {
  PENDING = "pending",           
  PAID = "paid",                 
  REFUNDED = "refunded",        
  CANCELLED = "cancelled",       
}

export enum StayType {
  RESERVED = "reserved",
  BOOKED = "booked",
  WALK_IN = "walk_in",
}