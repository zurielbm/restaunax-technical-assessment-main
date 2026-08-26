import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        return res.status(500).json({ error: "Failed to fetch customers" });
    }
})

/**
 * GET /api/customer/email/:email
 * Get a specific customer by email
 */
router.get("/email/:email", async (_req: Request, res: Response) => {
    try {
        const customerEmail = _req.params.email;

        if (!EMAIL_REGEX.test(customerEmail)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const customer = await prisma.customer.findUnique({
            where: {
                email: customerEmail,
            },
        });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        return res.json(customer);
    } catch (error) {
        console.error("Error fetching customer by email:", error);
        return res.status(500).json({ error: "Failed to fetch customer" });
    }
});

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
        return res.status(500).json({ error: "Failed to fetch customer" });
    }
});

/**
 * POST /api/customer
 * Create a new customer
 */
router.post("/", async (_req: Request, res: Response) => {
    try {
        const { name, email, phone } = _req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
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
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({
                error: "Customer already exists",
                message: "A customer with this email already exists",
            });
        }
        console.error("Error creating customer:", error);
        return res.status(500).json({ error: "Failed to create customer" });
    }
});

export default router;