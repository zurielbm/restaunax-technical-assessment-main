import { Router, Request, Response } from "express";
import { Order, OrderStatus } from "../../../shared/types";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET /api/customer
 * get all customers
 */
router.get("/", async (_req: Request, res: Response) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
})

/**
 * GET /api/customer/:id
 * Get a specific customer by ID
 */
router.get("/:id", async (_req: Request, res: Response) => {
    try {
        const customerId = _req.params.id;

        const customer = await prisma.customer.findUnique({
            where: {
                id: customerId,
            },
        });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        return res.json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ error: "Failed to fetch customer" });
    }
});

/**
 * POST /api/customer
 * Create a new customer
 */
router.post("/", async (_req: Request, res: Response) => {
    try {
        const { name, email, phone } = _req.body;

        // Validate input
        if (!name || !email || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newCustomer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                rewardPoints: 0, // Initialize reward points to 0
            },
        });

        return res.status(201).json(newCustomer);
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ error: "Failed to create customer" });
    }
});

export default router;