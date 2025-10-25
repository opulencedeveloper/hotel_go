import { InventoryCategory } from "@/utils/enum";

  export const inventoryCategories = [
    { value: InventoryCategory.AMENITIES, label: "Room Amenities", icon: "🛁" },
    { value: InventoryCategory.LINEN, label: "Linen & Towels", icon: "🛏️" },
    { value: InventoryCategory.FOOD, label: "Food Items", icon: "🍽️" },
    { value: InventoryCategory.BEVERAGE, label: "Beverages", icon: "🥤" },
    {
      value: InventoryCategory.CLEANING,
      label: "Cleaning Supplies",
      icon: "🧽",
    },
    { value: InventoryCategory.KITCHEN, label: "Kitchen Items", icon: "🍳" },
    { value: InventoryCategory.OFFICE, label: "Office Supplies", icon: "📋" },
    { value: InventoryCategory.MAINTENANCE, label: "Maintenance", icon: "🔧" },
  ];