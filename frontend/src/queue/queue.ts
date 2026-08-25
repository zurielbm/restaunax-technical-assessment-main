import { Order, OrderStatus } from "../../../shared/types";

export const WAIT_WARNING_MINUTES = 10;
export const WAIT_CRITICAL_MINUTES = 20;
export const PREP_MINUTES_PER_ORDER = 8;

export type WaitSeverity = "ok" | "warning" | "critical";

export interface QueueEntry {
  order: Order;
  position: number;
  waitMinutes: number;
}

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "preparing",
  preparing: "ready",
  ready: "delivered",
};

export const ADVANCE_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Mark preparing",
  preparing: "Mark ready",
  ready: "Mark delivered",
};

export function isActive(order: Order): boolean {
  return order.status !== "delivered";
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
