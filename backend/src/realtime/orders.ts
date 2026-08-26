import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/types";
import { prisma } from "../lib/prisma";

export type OrderSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents
>;

const allOrdersRoom = "orders:all";
const orderRoom = (orderId: string) => `order:${orderId}`;

export function registerOrderSocketHandlers(io: OrderSocketServer): void {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("orders:watch", async (acknowledge) => {
      await socket.join(allOrdersRoom);
      acknowledge({ ok: true });
    });

    socket.on("orders:unwatch", async () => {
      await socket.leave(allOrdersRoom);
    });

    socket.on("order:watch", async (orderId, acknowledge) => {
      if (typeof orderId !== "string" || orderId.trim() === "") {
        acknowledge({ ok: false, error: "A valid order id is required" });
        return;
      }

      const orderExists = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true },
      });

      if (!orderExists) {
        acknowledge({ ok: false, error: "Order not found" });
        return;
      }

      await socket.join(orderRoom(orderId));
      acknowledge({ ok: true });
    });

    socket.on("order:unwatch", async (orderId) => {
      await socket.leave(orderRoom(orderId));
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });
}

export function emitOrderCreated(
  io: OrderSocketServer,
  order: Parameters<ServerToClientEvents["order:created"]>[0],
): void {
  io.to(allOrdersRoom).emit("order:created", order);
  io.to(orderRoom(order.id)).emit("order:created", order);
}

export function emitOrderUpdated(
  io: OrderSocketServer,
  order: Parameters<ServerToClientEvents["order:updated"]>[0],
): void {
  io.to(allOrdersRoom).emit("order:updated", order);
  io.to(orderRoom(order.id)).emit("order:updated", order);
}
