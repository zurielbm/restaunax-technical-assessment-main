import { Order, Customer } from "../../../shared/types";

/**
 * Mock order data for development and testing
 * This provides 15 sample orders with various statuses and order types
 *
 * NOTE: Customer data is currently embedded in each order.
 * Think about how you might improve this data structure.
 *
 * IMPORTANT: This data comes from a legacy system. You may want to
 * validate and sanitize it before using in production.
 */

const rawCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1-555-0101",
    rewardPoints: 150,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_002",
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    phone: "+1-555-0102",
    rewardPoints: 320,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_003",
    name: "Emily Johnson",
    email: "emily.j@email.com",
    phone: "+1-555-0103",
    rewardPoints: 85,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_004",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1-555-0104",
    rewardPoints: 540,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_005",
    name: "Olivia Martinez",
    email: "olivia.martinez@email.com", 
    phone: "+1-555-0105",
    rewardPoints: 220,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_006",
    name: "Daniel Brown",
    email: "daniel.brown@email.com",
    phone: "+1-555-0106",
    rewardPoints: 470,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_007",
    name: "Sophia", 
    email: "sophia.t@email.com",
    phone: "+1-555-0107",
    rewardPoints: 95,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_008",
    name: "Liam Anderson",
    email: "liam.anderson@email.com",
    phone: "+1-555-0108",
    rewardPoints: 680,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_009",
    name: "Ava Thompson",
    email: "ava.thompson@email.com",
    phone: "+1-555-0109",
    rewardPoints: 0, 
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_010",
    name: "Noah Garcia",
    email: "noah.garcia@email.com",
    phone: "+1-555-0110",
    rewardPoints: 390,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_011",
    name: "Isabella Lee",
    email: "isabella.lee@email.com",
    phone: "+1-555-0111",
    rewardPoints: 210,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_012",
    name: "Ethan Harris",
    email: "ethan.harris@email.com",
    phone: "+1-555-0112",
    rewardPoints: 890,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_013",
    name: "Mia White",
    email: "mia.white@email.com",
    phone: "+1-555-0113",
    rewardPoints: 45,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_014",
    name: "Benjamin Clark",
    email: "ben.clark@email.com",
    phone: "+1-555-0114",
    rewardPoints: 560,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "cust_015",
    name: "Charlotte Lewis",
    email: "charlotte.lewis@email.com",
    phone: "+1-555-0115",
    rewardPoints: 175,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

const rawOrders: Order[] = [
  {
    id: "ord_001",
    customerId: "cust_001",
    orderType: "delivery",
    status: "pending",
    total: 45.97,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    items: [
      { id: "item_001", name: "Margherita Pizza", quantity: 2, price: 15.99 },
      { id: "item_002", name: "Caesar Salad", quantity: 1, price: 8.99 },
      { id: "item_003", name: "Garlic Bread", quantity: 1, price: 5.0 },
    ],
  },
  {
    id: "ord_002",
    customerId: "cust_002",
    orderType: "pickup",
    status: "preparing",
    total: 32.98,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    items: [
      { id: "item_004", name: "BBQ Chicken Pizza", quantity: 1, price: 18.99 },
      { id: "item_005", name: "Mozzarella Sticks", quantity: 1, price: 7.99 },
      { id: "item_006", name: "Soft Drink", quantity: 2, price: 3.0 },
    ],
  },
  {
    id: "ord_003",
    customerId: "cust_003",
    orderType: "delivery",
    status: "ready",
    total: 67.95,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    items: [
      { id: "item_007", name: "Pepperoni Pizza", quantity: 2, price: 16.99 },
      { id: "item_008", name: "Vegetarian Pizza", quantity: 1, price: 15.99 },
      { id: "item_009", name: "Greek Salad", quantity: 2, price: 8.99 },
    ],
  },
  {
    id: "ord_004",
    customerId: "cust_004",
    orderType: "delivery",
    status: "delivered",
    total: 28.97,
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    items: [
      { id: "item_010", name: "Hawaiian Pizza", quantity: 1, price: 17.99 },
      { id: "item_011", name: "Chicken Wings", quantity: 1, price: 10.98 },
    ],
  },
  {
    id: "ord_005",
    customerId: "cust_005",
    orderType: "pickup",
    status: "pending",
    total: 24.97,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    items: [
      { id: "item_012", name: "Cheese Pizza", quantity: 1, price: 14.99 },
      { id: "item_013", name: "Onion Rings", quantity: 1, price: 6.99 },
      { id: "item_014", name: "Iced Tea", quantity: 1, price: 2.99 },
    ],
  },
  {
    id: "ord_006",
    customerId: "cust_006",
    orderType: "delivery",
    status: "preparing",
    total: 54.96,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    items: [
      { id: "item_015", name: "Meat Lovers Pizza", quantity: 2, price: 19.99 },
      { id: "item_016", name: "Buffalo Wings", quantity: 1, price: 12.98 },
      { id: "item_017", name: "Coleslaw", quantity: 1, price: 2.0 },
    ],
  },
  {
    id: "ord_007",
    customerId: "cust_007",
    orderType: "pickup",
    status: "ready",
    total: 19.97,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    items: [
      { id: "item_018", name: "Personal Margherita", quantity: 1, price: 9.99 },
      { id: "item_019", name: "Side Salad", quantity: 1, price: 4.99 },
      { id: "item_020", name: "Lemonade", quantity: 1, price: 4.99 },
    ],
  },
  {
    id: "ord_008",
    customerId: "cust_008",
    orderType: "delivery",
    status: "delivered",
    total: 70.93, 
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    items: [
      { id: "item_021", name: "Supreme Pizza", quantity: 3, price: 18.99 },
      { id: "item_022", name: "Breadsticks", quantity: 2, price: 4.99 },
      { id: "item_023", name: "Marinara Sauce", quantity: 2, price: 1.99 },
    ],
  },
  {
    id: "ord_009",
    customerId: "cust_009",
    orderType: "pickup",
    status: "pending",
    total: 38.96,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    items: [
      { id: "item_024", name: "Four Cheese Pizza", quantity: 1, price: 16.99 },
      { id: "item_025", name: "Spinach Dip", quantity: 1, price: 8.99 },
      { id: "item_026", name: "Tiramisu", quantity: 2, price: 6.49 },
    ],
  },
  {
    id: "ord_010",
    customerId: "cust_010",
    orderType: "delivery",
    status: "preparing",
    total: 42.97, 
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    items: [
      { id: "item_027", name: "Deluxe Pizza", quantity: 1, price: 20.99 },
      { id: "item_028", name: "Garden Salad", quantity: 2, price: 7.99 },
      { id: "item_029", name: "Soft Drink", quantity: 3, price: 2.0 },
    ],
  },
  {
    id: "ord_011",
    customerId: "cust_011",
    orderType: "pickup",
    status: "ready",
    total: 26.98,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    items: [
      { id: "item_030", name: "Veggie Delight Pizza", quantity: 1, price: 15.99 },
      { id: "item_031", name: "French Fries", quantity: 1, price: 5.99 },
      { id: "item_032", name: "Milkshake", quantity: 1, price: 5.0 },
    ],
  },
  {
    id: "ord_012",
    customerId: "cust_012",
    orderType: "delivery",
    status: "delivered",
    total: 89.93,
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    items: [
      { id: "item_033", name: "Pepperoni Pizza", quantity: 2, price: 16.99 },
      { id: "item_034", name: "BBQ Chicken Pizza", quantity: 2, price: 18.99 },
      { id: "item_035", name: "Chicken Wings", quantity: 1, price: 10.98 },
      { id: "item_036", name: "Cheesy Bread", quantity: 1, price: 6.99 },
    ],
  },
  {
    id: "ord_013",
    customerId: "cust_013",
    orderType: "pickup",
    status: "pending",
    total: 15.99,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    items: [
      { id: "item_037", name: "Personal Pepperoni", quantity: 1, price: 9.99 },
      { id: "item_038", name: "Soft Drink", quantity: 2, price: 3.0 },
    ],
  },
  {
    id: "ord_014",
    customerId: "cust_014",
    orderType: "delivery",
    status: "preparing",
    total: 46.95, 
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    items: [
      { id: "item_039", name: "Spicy Italian Pizza", quantity: 2, price: 17.99 },
      { id: "item_040", name: "Jalapeño Poppers", quantity: 1, price: 8.99 },
      { id: "item_041", name: "Ranch Dressing", quantity: 2, price: 0.99 },
    ],
  },
  {
    id: "ord_015",
    customerId: "cust_015",
    orderType: "pickup",
    status: "ready",
    total: 34.96, 
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    items: [
      { id: "item_042", name: "White Pizza", quantity: 1, price: 16.99 },
      { id: "item_043", name: "Caprese Salad", quantity: 1, price: 9.99 },
      { id: "item_044", name: "Cannoli", quantity: 2, price: 3.99 },
    ],
  },
];


const toCents = (amount: number): number => Math.round(amount * 100);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SanitizationReport {
  fixes: string[];
  problems: string[];
}

export const sanitizeCustomers = (
  customers: Customer[],
  report: SanitizationReport
): Customer[] =>
  customers.map((customer) => {
    const clean = { ...customer };
    if (clean.name.trim() === "") {
      report.fixes.push(`${clean.id}: empty name, replaced with "Unknown"`);
      clean.name = "Unknown";
    }
    if (!EMAIL_REGEX.test(clean.email)) {
      report.problems.push(`${clean.id}: invalid email "${clean.email}"`);
    }
    if (clean.rewardPoints < 0) {
      report.fixes.push(
        `${clean.id}: negative reward points ${clean.rewardPoints}, clamped to 0`
      );
      clean.rewardPoints = 0;
    }
    return clean;
  });

export const sanitizeOrders = (
  orders: Order[],
  customers: Customer[],
  report: SanitizationReport
): Order[] => {
  const customerIds = new Set(customers.map((customer) => customer.id));

  return orders.map((order) => {
    const clean = { ...order, items: order.items.map((item) => ({ ...item })) };

    for (const item of clean.items) {
      if (item.quantity <= 0 || item.price < 0) {
        report.problems.push(
          `${clean.id}/${item.id}: bad quantity ${item.quantity} or price ${item.price}`
        );
      }
    }

    const totalCents = clean.items.reduce(
      (sum, item) => sum + toCents(item.price) * item.quantity,
      0
    );
    if (toCents(clean.total) !== totalCents) {
      report.fixes.push(
        `${clean.id}: total ${clean.total} != item sum ${(totalCents / 100).toFixed(2)}, corrected`
      );
      clean.total = totalCents / 100;
    }

    if (!customerIds.has(clean.customerId)) {
      report.problems.push(
        `${clean.id}: references unknown customer "${clean.customerId}"`
      );
    }

    return clean;
  });
};

export const sanitizationReport: SanitizationReport = { fixes: [], problems: [] };
export const customerData: Customer[] = sanitizeCustomers(rawCustomers, sanitizationReport);
export const mockOrders: Order[] = sanitizeOrders(rawOrders, customerData, sanitizationReport);

if (sanitizationReport.fixes.length > 0) {
  console.warn(`[mockOrders.sanitize] auto-fixed ${sanitizationReport.fixes.length} issue(s):`);
  for (const fix of sanitizationReport.fixes) console.warn(`  - ${fix}`);
}
if (sanitizationReport.problems.length > 0) {
  console.error(`[mockOrders.sanitize] ${sanitizationReport.problems.length} UNFIXABLE problem(s):`);
  for (const problem of sanitizationReport.problems) console.error(`  - ${problem}`);
}
