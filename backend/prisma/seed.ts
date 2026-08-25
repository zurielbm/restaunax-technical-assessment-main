import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  customerData,
  mockOrders,
  sanitizationReport,
} from "../src/data/mockOrders.sanitize";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  if (sanitizationReport.problems.length > 0) {
    console.error(
      `Refusing to seed: ${sanitizationReport.problems.length} unfixable data problem(s) — fix the raw data first.`
    );
    process.exit(1);
  }

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();

  await prisma.customer.createMany({ data: customerData });

  for (const order of mockOrders) {
    await prisma.order.create({
      data: {
        id: order.id,
        customerId: order.customerId,
        orderType: order.orderType,
        status: order.status,
        createdAt: order.createdAt,
        items: {
          create: order.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  }

  const counts = {
    customers: await prisma.customer.count(),
    orders: await prisma.order.count(),
    items: await prisma.orderItem.count(),
  };
  console.log("Seeded:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
