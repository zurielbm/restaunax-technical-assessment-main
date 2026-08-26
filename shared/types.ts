/**
 * Shared TypeScript types for Restaunax Order Management
 * These types are used by both frontend and backend for type safety
 */

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

export type OrderType = 'delivery' | 'pickup';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

/**
 * Order entity
 * NOTE: This structure has customer data embedded directly in the order
 * Consider whether this is the best data modeling approach
 */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  rewardPoints: number;
  createdAt: string; // ISO 8601 date string
}

export interface Order {
  id: string;
  customerId: string;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string; // ISO 8601 date string
}

export type MenuCategory = "pizza" | "salads" | "drinks" | "desserts";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
}

// API Response types
export interface ApiError {
  error: string;
  message?: string;
}

// Request body types
export interface CreateOrderRequest {
  customerId: string;
  orderType: OrderType;
  items: Omit<OrderItem, 'id'>[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
}
