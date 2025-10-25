export enum StaffShift {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  NIGHT = "night",
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


export enum StaffStatus {
  ACTIVE = "active",           // Currently working and active
  INACTIVE = "inactive",       // Temporarily not working or deactivated
  ON_LEAVE = "on_leave",       // On vacation or official leave
  TERMINATED = "terminated",   // No longer employed
  SUSPENDED = "suspended",     // Temporarily suspended due to disciplinary action
  PENDING = "pending",         // Newly added staff awaiting approval/setup
}

