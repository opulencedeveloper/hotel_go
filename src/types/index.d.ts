// Multi-tenant Account Model

export interface LayoutProps {
  children: React.ReactNode;
}


export interface Account {
  account_id: string;
  name: string;
  billing_info: {
    company_name: string;
    address: string;
    tax_id: string;
    payment_method: string;
    billing_contact: string;
    billing_email: string;
  };
  default_preferences: {
    currency: string;
    timezone: string;
    loyalty_program: boolean;
    language: string;
    date_format: string;
  };
  created_at: string;
  status: 'active' | 'suspended' | 'trial' | 'expired';
  trial_ends_at?: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
}

export interface Property {
  property_id: string;
  account_id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  timezone: string;
  currency: string;
  tax_rules: {
    tax_rate: number;
    tax_inclusive: boolean;
    tax_types: string[];
    service_charge_rate: number;
    city_tax_rate: number;
  };
  outlets: Outlet[];
  devices: Device[];
  total_rooms: number;
  star_rating: number;
  amenities: string[];
  check_in_time: string;
  check_out_time: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  settings: {
    allow_overbooking: boolean;
    overbooking_tolerance: number;
    auto_assign_rooms: boolean;
    require_deposit: boolean;
    min_deposit_percentage: number;
  };
}

export interface Outlet {
  outlet_id: string;
  property_id: string;
  name: string;
  type: 'restaurant' | 'bar' | 'spa' | 'gift_shop' | 'room_service' | 'cafe' | 'lounge' | 'pool_bar';
  location: string;
  floor: number;
  status: 'active' | 'inactive' | 'maintenance';
  settings: {
    tax_rate: number;
    service_charge: number;
    auto_close_time: string;
    opening_hours: {
      [key: string]: { open: string; close: string; closed: boolean };
    };
    pos_printer_id?: string;
    kitchen_printer_id?: string;
  };
  manager_id?: string;
  created_at: string;
}

export interface Device {
  device_id: string;
  property_id: string;
  name: string;
  type: 'receipt_printer' | 'kitchen_printer' | 'biometric_terminal' | 'pos_terminal' | 'keycard_reader' | 'cash_drawer' | 'barcode_scanner';
  location: string;
  outlet_id?: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  last_sync: string;
  ip_address?: string;
  mac_address?: string;
  settings: {
    printer_type?: 'thermal' | 'inkjet' | 'laser';
    paper_size?: string;
    connection_type?: 'usb' | 'ethernet' | 'wifi' | 'bluetooth';
    [key: string]: any;
  };
  created_at: string;
}

// Legacy Hotel interface for backward compatibility
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
  room_id: string;
  property_id: string;
  room_number: string;
  room_type_id: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out_of_order';
  floor: number;
  last_cleaned?: string;
  last_maintenance?: string;
  notes?: string;
}

export interface RoomType {
  room_type_id: string;
  property_id: string;
  name: string;
  capacity: number;
  base_rate: number;
  amenities: string[];
  description: string;
  images: string[];
}

export interface RatePlan {
  rate_plan_id: string;
  property_id: string;
  code: string;
  name: string;
  rules: {
    min_los: number;
    max_los: number;
    blackout_dates: string[];
    advance_booking_days: number;
    cancellation_policy: string;
  };
  rates: {
    [date: string]: number;
  };
  status: 'active' | 'inactive';
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

export interface Booking {
  booking_id: string;
  property_id: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  arrival_date: string;
  departure_date: string;
  total_amount: number;
  source: 'direct' | 'ota' | 'walk-in' | 'corporate' | 'group';
  adults: number;
  children: number;
  special_requests: string;
  created_at: string;
  client_txn_id?: string; // For offline sync
  guest?: Guest;
  allocations?: Allocation[];
}

export interface Allocation {
  allocation_id: string;
  booking_id: string;
  room_id: string;
  rate_plan_id: string;
  check_in_date: string;
  check_out_date: string;
  rate: number;
  status: 'confirmed' | 'checked-in' | 'checked-out';
}

export interface Folio {
  folio_id: string;
  booking_id: string;
  balance: number;
  currency: string;
  status: 'open' | 'closed' | 'settled';
  charges: Charge[];
  payments: Payment[];
}

export interface Charge {
  charge_id: string;
  folio_id: string;
  description: string;
  amount: number;
  posted_by: string;
  posted_at: string;
  category: 'room' | 'f&b' | 'service' | 'tax' | 'fee';
  outlet_id?: string;
}

export interface Payment {
  payment_id: string;
  folio_id: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'voucher';
  reference: string;
  processed_by: string;
  processed_at: string;
  status: 'completed' | 'pending' | 'failed';
}

// Legacy Reservation interface for backward compatibility
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
  role: 'manager' | 'receptionist' | 'housekeeping' | 'kitchen' | 'maintenance' | 'admin' | 'accounting' | 'security' | 'guest_services';
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
  item_id: string;
  outlet_id: string;
  name: string;
  category: 'food' | 'beverage' | 'service';
  price: number;
  description: string;
  available: boolean;
  prepTime?: number; // Preparation time in minutes
  image?: string;
  modifiers: Modifier[];
  ingredients: Ingredient[];
}

export interface Modifier {
  modifier_id: string;
  name: string;
  price: number;
  required: boolean;
}

export interface Ingredient {
  ingredient_id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface POSOrder {
  order_id: string;
  outlet_id: string;
  folio_id?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  items: OrderItem[];
  total: number;
  table_number?: string;
  room_number?: string;
  created_at: string;
  staff_id: string;
  client_txn_id?: string; // For offline sync
}

export interface OrderItem {
  item_id: string;
  quantity: number;
  price: number;
  modifiers: string[];
  notes?: string;
}

export interface InventoryItem {
  item_id: string;
  property_id: string;
  sku: string;
  name: string;
  category: string;
  qty_on_hand: number;
  min_stock: number;
  max_stock: number;
  unit_cost: number;
  supplier: string;
  location: string;
  last_updated: string;
}

export interface AuditEvent {
  event_id: string;
  property_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before_json: Record<string, any>;
  after_json: Record<string, any>;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  session_id: string;
  client_txn_id?: string;
}

// User Management & Access Control
export interface User {
  user_id: string;
  account_id: string;
  property_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login: string;
  created_at: string;
  permissions: Permission[];
  two_factor_enabled: boolean;
  password_expires_at?: string;
}

export interface Role {
  role_id: string;
  property_id: string;
  name: string;
  description: string;
  permissions: Permission[];
  is_system_role: boolean;
  created_at: string;
}

export interface Permission {
  permission_id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

// Yield & Rate Management
export interface YieldRule {
  rule_id: string;
  property_id: string;
  name: string;
  conditions: {
    days_ahead: number;
    occupancy_threshold: number;
    day_of_week: string[];
    season: string;
  };
  actions: {
    rate_adjustment: number;
    min_los: number;
    max_los: number;
    close_to_arrival: boolean;
  };
  status: 'active' | 'inactive';
  created_at: string;
}

// Kitchen & Restaurant Management
export interface Recipe {
  recipe_id: string;
  outlet_id: string;
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  allergens: string[];
  nutritional_info?: Record<string, any>;
  cost: number;
  selling_price: number;
  status: 'active' | 'inactive';
}

export interface RecipeIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
}

export interface KitchenStation {
  station_id: string;
  outlet_id: string;
  name: string;
  type: 'hot' | 'cold' | 'beverage' | 'dessert';
  printer_id?: string;
  status: 'active' | 'inactive';
}

// Housekeeping & Maintenance
export interface HousekeepingTask {
  task_id: string;
  property_id: string;
  room_id: string;
  type: 'cleaning' | 'inspection' | 'maintenance' | 'deep_clean';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  estimated_duration: number;
  actual_duration?: number;
  due_time: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
}

export interface MaintenanceTicket {
  ticket_id: string;
  property_id: string;
  room_id?: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  reported_by: string;
  reported_at: string;
  completed_at?: string;
  cost?: number;
  notes?: string;
}

// Staff Management & Payroll
export interface Employee {
  employee_id: string;
  property_id: string;
  user_id: string;
  employee_number: string;
  position: string;
  department: string;
  hire_date: string;
  termination_date?: string;
  salary: number;
  hourly_rate?: number;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'temporary';
  status: 'active' | 'inactive' | 'terminated';
  certifications: Certification[];
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bank_details?: {
    account_number: string;
    routing_number: string;
    bank_name: string;
  };
}

export interface Certification {
  certification_id: string;
  name: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'pending_renewal';
}

export interface Shift {
  shift_id: string;
  employee_id: string;
  date: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'no_show';
  clock_in_time?: string;
  clock_out_time?: string;
  overtime_hours?: number;
  notes?: string;
}

export interface PayrollRun {
  payroll_run_id: string;
  property_id: string;
  period_start: string;
  period_end: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  total_gross: number;
  total_deductions: number;
  total_net: number;
  employee_count: number;
  created_by: string;
  created_at: string;
  processed_at?: string;
}

// Accounting & Finance
export interface ChartOfAccounts {
  account_id: string;
  property_id: string;
  account_code: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent_account_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface JournalEntry {
  entry_id: string;
  property_id: string;
  entry_date: string;
  reference: string;
  description: string;
  total_debit: number;
  total_credit: number;
  status: 'draft' | 'posted' | 'reversed';
  created_by: string;
  created_at: string;
  posted_at?: string;
  line_items: JournalLineItem[];
}

export interface JournalLineItem {
  line_id: string;
  account_id: string;
  debit_amount: number;
  credit_amount: number;
  description: string;
}

export interface Invoice {
  invoice_id: string;
  property_id: string;
  invoice_number: string;
  customer_id: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  line_items: InvoiceLineItem[];
  created_at: string;
}

export interface InvoiceLineItem {
  line_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  tax_rate: number;
  tax_amount: number;
}

// CRM & Loyalty
export interface GuestProfile {
  guest_id: string;
  property_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  nationality: string;
  id_type: string;
  id_number: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  preferences: GuestPreference[];
  loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyalty_points: number;
  total_stays: number;
  total_spent: number;
  last_stay?: string;
  created_at: string;
}

export interface GuestPreference {
  preference_id: string;
  category: 'room' | 'dining' | 'service' | 'communication';
  preference: string;
  priority: 'high' | 'medium' | 'low';
}

export interface LoyaltyProgram {
  program_id: string;
  property_id: string;
  name: string;
  description: string;
  tiers: LoyaltyTier[];
  point_rules: PointRule[];
  status: 'active' | 'inactive';
  created_at: string;
}

export interface LoyaltyTier {
  tier_id: string;
  name: string;
  min_points: number;
  benefits: string[];
  discount_percentage: number;
}

export interface PointRule {
  rule_id: string;
  action: 'earn' | 'redeem';
  points_per_dollar: number;
  min_amount?: number;
  max_points?: number;
  valid_from: string;
  valid_to?: string;
}

// Procurement & Inventory
export interface Supplier {
  supplier_id: string;
  property_id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  payment_terms: string;
  credit_limit?: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface PurchaseOrder {
  po_id: string;
  property_id: string;
  supplier_id: string;
  po_number: string;
  order_date: string;
  expected_delivery: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  total_amount: number;
  line_items: POLineItem[];
  created_by: string;
  created_at: string;
}

export interface POLineItem {
  line_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  received_quantity: number;
  status: 'pending' | 'partial' | 'received';
}

export interface StockMovement {
  movement_id: string;
  property_id: string;
  item_id: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reference: string;
  reason: string;
  created_by: string;
  created_at: string;
}

// Business Analytics & Forecasting
export interface Forecast {
  forecast_id: string;
  property_id: string;
  forecast_type: 'occupancy' | 'revenue' | 'demand' | 'staffing';
  forecast_date: string;
  period_start: string;
  period_end: string;
  predicted_value: number;
  confidence_level: number;
  factors: ForecastFactor[];
  created_at: string;
}

export interface ForecastFactor {
  factor_name: string;
  impact: number;
  weight: number;
  description: string;
}

// Reporting & Dashboards
export interface Report {
  report_id: string;
  property_id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'guest' | 'staff' | 'inventory';
  template: ReportTemplate;
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  status: 'active' | 'inactive';
  created_by: string;
  created_at: string;
}

export interface ReportTemplate {
  template_id: string;
  name: string;
  description: string;
  query: string;
  parameters: string[];
  output_format: 'pdf' | 'excel' | 'csv';
}

export interface ReportParameter {
  parameter_name: string;
  parameter_type: 'date' | 'string' | 'number' | 'boolean' | 'list';
  default_value?: any;
  required: boolean;
  options?: any[];
}

export interface ReportSchedule {
  schedule_id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  day_of_week?: number;
  day_of_month?: number;
  time: string;
  recipients: string[];
  enabled: boolean;
}

// Security & Access Control
export interface SecurityEvent {
  event_id: string;
  property_id: string;
  user_id?: string;
  event_type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'data_access' | 'data_modification';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

// Backup & Data Recovery
export interface Backup {
  backup_id: string;
  property_id: string;
  backup_type: 'full' | 'incremental' | 'differential';
  status: 'in_progress' | 'completed' | 'failed';
  size_bytes: number;
  created_at: string;
  completed_at?: string;
  location: string;
  checksum: string;
  retention_days: number;
}

export interface RestorePoint {
  restore_point_id: string;
  property_id: string;
  backup_id: string;
  point_in_time: string;
  status: 'available' | 'restoring' | 'completed' | 'failed';
  created_at: string;
}

// Offline & Sync
export interface SyncEvent {
  sync_event_id: string;
  property_id: string;
  device_id?: string;
  event_type: 'push' | 'pull' | 'conflict' | 'error';
  entity_type: string;
  entity_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  client_txn_id: string;
  server_txn_id?: string;
  created_at: string;
  processed_at?: string;
  error_message?: string;
}

export interface OfflineQueue {
  queue_id: string;
  property_id: string;
  device_id?: string;
  operation: 'create' | 'update' | 'delete';
  entity_type: string;
  entity_data: Record<string, any>;
  client_txn_id: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retry_count: number;
  created_at: string;
  last_retry_at?: string;
}

export interface DashboardStats {
  // KPI Tiles
  occupancy: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  adr: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  revpar: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  arr: {
    today: number;
    mtd: number;
    ytd: number;
    change_percent: number;
  };
  
  // Arrivals & Departures
  arrivals_today: number;
  arrivals_next_48h: number;
  departures_today: number;
  departures_next_48h: number;
  
  // Active Tasks
  housekeeping_tasks: number;
  maintenance_tasks: number;
  guest_requests: number;
  
  // Revenue by Outlet
  revenue_by_outlet: {
    rooms: number;
    f_and_b: number;
    other: number;
  };
  
  // Alerts
  overbook_risk: number;
  low_inventory_alerts: number;
  sync_errors: number;
  pending_payments: number;
  
  // System Status
  last_sync: string;
  online_status: boolean;
  pending_sync_items: number;
  
  // Legacy fields for backward compatibility
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
