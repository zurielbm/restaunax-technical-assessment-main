import { Router, Request, Response } from "express";
import { Order, OrderStatus } from "../../../shared/types";
import { mockOrders } from "../data/old.mockOrders";
import { prisma } from "../lib/prisma";

const router = Router();

const validOrderStatuses: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "delivered",
];

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    validOrderStatuses.includes(value as OrderStatus)
  );
}

// TODO: Implement your data storage solution here
// This starter uses in-memory storage with mock data
// @ts-expect-error - This variable is for candidates to use when implementing endpoints
// let orders: Order[] = [...mockOrders];

/**
 * GET /api/orders
 * List all orders, optionally filtered by status
 * Query params: ?status=pending (optional)
 */
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

    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(501).json({ error: "Not implemented yet" });
  }
});

/**
 * GET /api/orders/:id
 * Get a specific order by ID
 */
router.get("/:id", (_req: Request, res: Response) => {
  // TODO: Implement this endpoint
  // 1. Extract the order ID from params
  // 2. Find the order in your data store
  // 3. Return 404 if not found, or the order if found

  res.status(501).json({ error: "Not implemented yet" });
});

/**
 * POST /api/orders
 * Create a new order
 */
router.post("/", (_req: Request, res: Response) => {
  // TODO: Implement this endpoint
  // 1. Validate the request body
  // 2. Generate a unique ID for the new order
  // 3. Add createdAt timestamp
  // 4. Save to your data store
  // 5. Return the created order with 201 status

  res.status(501).json({ error: "Not implemented yet" });
});

/**
 * PATCH /api/orders/:id
 * Update an order's status
 */
router.patch("/:id", (_req: Request, res: Response) => {
  // TODO: Implement this endpoint
  // 1. Extract order ID from params
  // 2. Validate the new status from request body
  // 3. Find the order and update its status
  // 4. Return 404 if order not found
  // 5. Return the updated order

  res.status(501).json({ error: "Not implemented yet" });
});

export default router;
