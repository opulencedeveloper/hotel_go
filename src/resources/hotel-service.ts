import { HotelServiceCategory, MenuCategory } from "@/utils/enum";

export const hotelServiceCategoryLabels: Record<HotelServiceCategory, string> = {
  [HotelServiceCategory.SPA]: "Spa & Wellness",
  [HotelServiceCategory.RESTAURANT]: "Restaurant",
  [HotelServiceCategory.TRANSPORT]: "Transport",
  [HotelServiceCategory.FITNESS]: "Fitness",
  [HotelServiceCategory.PHOTOGRAPHY]: "Photography",
  [HotelServiceCategory.ENTERTAINMENT]: "Entertainment",
  [HotelServiceCategory.GIFT_SHOP]: "Gift Shop",
  [HotelServiceCategory.EVENT_CENTER]: "Event Center",
  [HotelServiceCategory.CONCIERGE]: "Concierge",
  [HotelServiceCategory.LAUNDRY]: "Laundry",
};


export const menuCategories = [
  { label: "Appetizer", value: MenuCategory.Appetizer },
  { label: "Main Course", value: MenuCategory.MainCourse },
  { label: "Dessert", value: MenuCategory.Dessert },
  { label: "Beverage", value: MenuCategory.Beverage },
  { label: "Salad", value: MenuCategory.Salad },
  { label: "Soup", value: MenuCategory.Soup },
];