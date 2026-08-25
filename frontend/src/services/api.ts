import {
  Order,
  OrderStatus,
  CreateOrderRequest,
  Customer,
  CreateCustomerRequest,
} from "../../../shared/types";

// API base URL - candidates will use this when implementing their API calls
const API_BASE_URL = "http://localhost:3000/api";

/**
 * API service for interacting with the backend
 * TODO: Implement these functions to call your backend endpoints
 */

export const ordersApi = {
  /**
   * Fetch all orders, optionally filtered by status
   */
  async getOrders(_status?: OrderStatus): Promise<Order[]> {
    // TODO: Implement this function
    // 1. Build the URL with optional status query param
    // 2. Make a GET request to /api/orders
    // 3. Handle errors appropriately
    // 4. Return the parsed JSON response
    // Example: const url = status ? `${API_BASE_URL}/orders?status=${status}` : `${API_BASE_URL}/orders`;

    try {
      const url = _status
        ? `${API_BASE_URL}/orders?status=${_status}`
        : `${API_BASE_URL}/orders`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }

      const orders: Order[] = await response.json();
      return orders;
    } catch (error) {
      console.error("Error in getOrders:", error);
      throw error;
    }
  },

  /**
   * Fetch a single order by ID
   */
  async getOrderById(_id: string): Promise<Order> {
    // TODO: Implement this function
    // 1. Make a GET request to /api/orders/:id
    // 2. Handle 404 errors
    // 3. Return the parsed JSON response
    // Example: const response = await fetch(`${API_BASE_URL}/orders/${id}`);

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${_id}`);

      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }

      const order: Order = await response.json();
      return order;
    } catch (error) {
      console.error("Error in getOrderById:", error);
      throw error;
    }
  },

  /**
   * Update an order's status
   */
  async updateOrderStatus(_id: string, _status: OrderStatus): Promise<Order> {
    // TODO: Implement this function
    // 1. Make a PATCH request to /api/orders/:id
    // 2. Send the new status in the request body
    // 3. Handle errors appropriately
    // 4. Return the updated order
    // Example: fetch(`${API_BASE_URL}/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: _status }),
      });

      if (!response.ok) {
        throw new Error(`Error updating order status: ${response.statusText}`);
      }

      const updatedOrder: Order = await response.json();
      return updatedOrder;
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      throw error;
    }
  },

  /**
   * Create a new order (for testing)
   */
  async createOrder(_order: CreateOrderRequest): Promise<Order> {
    // TODO: Implement this function
    // 1. Make a POST request to /api/orders
    // 2. Send the order data in the request body
    // 3. Handle validation errors
    // 4. Return the created order
    // Example: fetch(`${API_BASE_URL}/orders`, { method: 'POST', body: JSON.stringify(order) })

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_order),
      });

      if (!response.ok) {
        throw new Error(`Error creating order: ${response.statusText}`);
      }

      const createdOrder: Order = await response.json();
      return createdOrder;
    } catch (error) {
      console.error("Error in createOrder:", error);
      throw error;
    }
  },
};

export const customersApi = {
  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer`);

      if (!response.ok) {
        throw new Error(`Error fetching customers: ${response.statusText}`);
      }

      const customers: Customer[] = await response.json();
      return customers;
    } catch (error) {
      console.error("Error in getCustomers:", error);
      throw error;
    }
  },

  async getCustomerById(_id: string): Promise<Customer> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/${_id}`);

      if (!response.ok) {
        throw new Error(`Error fetching customer: ${response.statusText}`);
      }

      const customer: Customer = await response.json();
      return customer;
    } catch (error) {
      console.error("Error in getCustomerById:", error);
      throw error;
    }
  },

  async createCustomer(_customer: CreateCustomerRequest): Promise<Customer> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_customer),
      });

      if (!response.ok) {
        throw new Error(`Error creating customer: ${response.statusText}`);
      }

      const createdCustomer: Customer = await response.json();
      return createdCustomer;
    } catch (error) {
      console.error("Error in createCustomer:", error);
      throw error;
    }
  },
};

// Note: API_BASE_URL is available for use in the functions above
console.log("API configured for:", API_BASE_URL);
