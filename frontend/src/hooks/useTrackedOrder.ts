import { useCallback, useEffect, useState } from "react";
import { Order } from "../../../shared/types";
import { ordersApi } from "../services/api";
import { socket } from "../services/socket";
import { errorMessage } from "./useOrders";

type TrackedOrderState =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "error"; message: string }
  | { status: "ready"; order: Order };

export function useTrackedOrder(orderId: string): {
  state: TrackedOrderState;
  retry: () => void;
} {
  const [state, setState] = useState<TrackedOrderState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });

    ordersApi
      .getOrderById(orderId)
      .then((order) => {
        if (active) setState({ status: "ready", order });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setState(
          cause instanceof Error && cause.message.includes("Not Found")
            ? { status: "notFound" }
            : { status: "error", message: errorMessage(cause) },
        );
      });

    const applyUpdate = (order: Order) => {
      if (active && order.id === orderId) {
        setState({ status: "ready", order });
      }
    };
    const watch = () => {
      socket.emit("order:watch", orderId, (result) => {
        if (active && !result.ok) setState({ status: "notFound" });
      });
    };

    socket.on("order:updated", applyUpdate);
    socket.on("order:created", applyUpdate);
    socket.on("connect", watch);
    watch();

    return () => {
      active = false;
      socket.emit("order:unwatch", orderId);
      socket.off("order:updated", applyUpdate);
      socket.off("order:created", applyUpdate);
      socket.off("connect", watch);
    };
  }, [orderId, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { state, retry };
}
