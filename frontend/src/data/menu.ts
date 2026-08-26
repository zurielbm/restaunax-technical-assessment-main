import { MenuCategory, MenuItem } from "../../../shared/types";

export const MENU_CATEGORIES: MenuCategory[] = [
  "pizza",
  "salads",
  "drinks",
  "desserts",
];

export const MENU: MenuItem[] = [
  { id: "pizza-margherita", name: "Margherita Pizza", price: 12.95, category: "pizza" },
  { id: "pizza-pepperoni", name: "Pepperoni Pizza", price: 14.5, category: "pizza" },
  { id: "pizza-quattro", name: "Quattro Formaggi", price: 15.25, category: "pizza" },
  { id: "pizza-veggie", name: "Veggie Supreme", price: 13.8, category: "pizza" },
  { id: "pizza-bbq", name: "BBQ Chicken Pizza", price: 15.95, category: "pizza" },
  { id: "salad-caesar", name: "Caesar Salad", price: 9.85, category: "salads" },
  { id: "salad-caprese", name: "Caprese Salad", price: 10.5, category: "salads" },
  { id: "salad-garlic-bread", name: "Garlic Bread", price: 5.25, category: "salads" },
  { id: "salad-mozzarella", name: "Mozzarella Sticks", price: 7.95, category: "salads" },
  { id: "drink-lemonade", name: "Lemonade", price: 3.75, category: "drinks" },
  { id: "drink-iced-tea", name: "Iced Tea", price: 3.5, category: "drinks" },
  { id: "drink-sparkling", name: "Sparkling Water", price: 2.95, category: "drinks" },
  { id: "drink-cola", name: "Cola", price: 3.25, category: "drinks" },
  { id: "dessert-tiramisu", name: "Tiramisu", price: 7, category: "desserts" },
  { id: "dessert-cannoli", name: "Cannoli", price: 6.5, category: "desserts" },
  { id: "dessert-lava-cake", name: "Chocolate Lava Cake", price: 8.25, category: "desserts" },
];
