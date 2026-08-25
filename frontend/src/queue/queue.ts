import { Order } from "../../../shared/types";

export const WAIT_WARNING_MINUTES = 10;
export const WAIT_CRITICAL_MINUTES = 20;
export const PREP_MINUTES_PER_ORDER = 8;

export type WaitSeverity = "ok" | "warning" | "critical";

export interface QueueEntry {
  order: Order;
  position: number;
  waitMinutes: number;
}

export function isActive(order: Order): boolean {
  return order.status === "pending" || order.status === "preparing";
}

export function waitMinutes(order: Order, now: number): number {
  return Math.max(
    0,
    Math.floor((now - new Date(order.createdAt).getTime()) / 60_000),
  );
}

export function buildQueue(orders: Order[], now: number): QueueEntry[] {
  return orders
    .filter(isActive)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((order, index) => ({
      order,
      position: index + 1,
      waitMinutes: waitMinutes(order, now),
    }));
}

export function waitSeverity(minutes: number): WaitSeverity {
  if (minutes >= WAIT_CRITICAL_MINUTES) return "critical";
  if (minutes >= WAIT_WARNING_MINUTES) return "warning";
  return "ok";
}

export function estimatedQueueMinutes(queueLength: number): number {
  return queueLength * PREP_MINUTES_PER_ORDER;
}
