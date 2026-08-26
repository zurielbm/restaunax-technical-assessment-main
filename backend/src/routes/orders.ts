import { Router, Request, Response } from "express";
import {
  Order,
  OrderStatus,
  OrderType,
  OrderItem,
} from "../../../shared/types";
import { prisma } from "../lib/prisma";
import {
  emitOrderCreated,
  emitOrderUpdated,
  OrderSocketServer,
} from "../realtime/orders";

interface StoredOrder {
  id: string;
  customerId: string;
  orderType: OrderType;
  status: OrderStatus;
  createdAt: Date;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const validOrderStatuses: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "delivered",
];

const validOrderTypes: OrderType[] = ["delivery", "pickup"];

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    validOrderStatuses.includes(value as OrderStatus)
  );
}

function isOrderType(value: unknown): value is OrderType {
  return (
    typeof value === "string" && validOrderTypes.includes(value as OrderType)
  );
}

function toApiOrder(order: StoredOrder): Order {
  const totalCents = order.items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  );
  return {
    id: order.id,
    customerId: order.customerId,
    orderType: order.orderType,
    status: order.status,
    items: order.items.map(({ id, name, quantity, price }) => ({
      id,
      name,
      quantity,
      price,
    })),
    total: totalCents / 100,
    createdAt: order.createdAt.toISOString(),
  };
}

// TODO: Implement your data storage solution here
// This starter uses in-memory storage with mock data

/**
 * GET /api/orders
 * List all orders, optionally filtered by status
 * Query params: ?status=pending (optional)
 */
export default function ordersRouter(io: OrderSocketServer): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    // TODO: Implement this endpoint
    // 1. Get the status query parameter if provided
    // 2. Filter orders by status if query param exists
    // 3. Return the filtered/all orders

    try {
      const status =
        typeof _req.query.status === "string" ? _req.query.status : undefined;

      if (status && !isOrderStatus(status)) {
        return res.status(400).json({
          error: "Invalid status",
        });
      }

      const orders = await prisma.order.findMany({
        where: status
          ? {
              status: status as OrderStatus,
            }
          : undefined,

        include: {
          items: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(orders.map(toApiOrder));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  /**
   * GET /api/orders/:id
   * Get a specific order by ID
   */
  router.get("/:id", async (_req: Request, res: Response) => {
    // TODO: Implement this endpoint
    // 1. Extract the order ID from params
    // 2. Find the order in your data store
    // 3. Return 404 if not found, or the order if found
    try {
      const orderId = _req.params.id;

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      return res.json(toApiOrder(order));
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  /**
   * POST /api/orders
   * Create a new order
   */
  router.post("/", async (_req: Request, res: Response) => {
    // TODO: Implement this endpoint
    // 1. Validate the request body
    // 2. Generate a unique ID for the new order
    // 3. Add createdAt timestamp
    // 4. Save to your data store
    // 5. Return the created order with 201 status

    try {
      const { customerId, orderType, items, redeemPoints } = _req.body;

      if (
        typeof customerId !== "string" ||
        !isOrderType(orderType) ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          error: "Invalid request body",
          message:
            "customerId (string), orderType (delivery | pickup) and a non-empty items array are required",
        });
      }

      if (
        redeemPoints !== undefined &&
        (!Number.isInteger(redeemPoints) || redeemPoints < 0)
      ) {
        return res.status(400).json({
          error: "Invalid redeem points",
          message: "redeemPoints must be a non-negative integer",
        });
      }

      const itemsAreValid = items.every(
        (item: OrderItem) =>
          typeof item.name === "string" &&
          item.name.trim() !== "" &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          typeof item.price === "number" &&
          item.price >= 0,
      );
      if (!itemsAreValid) {
        return res.status(400).json({
          error: "Invalid order items",
          message:
            "each item needs a name, a positive integer quantity and a non-negative price",
        });
      }

      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        return res.status(400).json({
          error: "Unknown customer",
          message: "No customer exists with the provided customerId",
        });
      }

      // Points economy: 1000 points redeem to $1, every full dollar paid earns 1 point
      const totalCents = items.reduce(
        (sum: number, item: OrderItem) =>
          sum + Math.round(item.price * 100) * item.quantity,
        0,
      );
      const redeemedPoints = Math.min(
        redeemPoints ?? 0,
        customer.rewardPoints,
        totalCents * 10,
      );
      const paidCents = totalCents - Math.floor(redeemedPoints / 10);
      const earnedPoints = Math.floor(paidCents / 100);

      // Create the new order and settle the customer's points in one transaction
      const [newOrder] = await prisma.$transaction([
        prisma.order.create({
          data: {
            customerId,
            orderType,
            status: "pending", // Default status for new orders
            createdAt: new Date().toISOString(),
            items: {
              create: items.map((item: OrderItem) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: {
            items: true,
          },
        }),
        prisma.customer.update({
          where: { id: customerId },
          data: {
            rewardPoints: customer.rewardPoints - redeemedPoints + earnedPoints,
          },
        }),
      ]);

      const order = toApiOrder(newOrder);
      emitOrderCreated(io, order);
      return res.status(201).json(order);
    } catch (error: any) {
      if (error.code === "P2003") {
        return res.status(400).json({
          error: "Unknown customer",
          message: "No customer exists with the provided customerId",
        });
      }
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
  });

  /**
   * PATCH /api/orders/:id
   * Update an order's status
   */
  router.patch("/:id", async (_req: Request, res: Response) => {
    // TODO: Implement this endpoint
    // 1. Extract order ID from params
    // 2. Validate the new status from request body
    // 3. Find the order and update its status
    // 4. Return 404 if order not found
    // 5. Return the updated order

    try {
      const orderId = _req.params.id;
      const { status } = _req.body;

      // Validate new status
      if (!isOrderStatus(status)) {
        return res.status(400).json({ error: "Invalid order status" });
      }

      // Update the order's status in the database
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: { items: true },
      });

      const order = toApiOrder(updatedOrder);
      emitOrderUpdated(io, order);
      return res.json(order);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Order not found" });
      }
      console.error("Error updating order status:", error);
      return res.status(500).json({ error: "Failed to update order status" });
    }
  });

  return router;
}
