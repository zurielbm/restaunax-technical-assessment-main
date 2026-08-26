import { useCallback, useEffect, useRef, useState } from "react";
import { Order, OrderStatus } from "../../../shared/types";
import { ordersApi } from "../services/api";
import { socket } from "../services/socket";

interface OrdersResult {
  orders?: Order[];
  error?: string;
  isFetching: boolean;
  refetch: () => void;
  updateStatus: (id: string, status: OrderStatus) => Promise<boolean>;
}

export function errorMessage(error: unknown): string {
  if (error instanceof TypeError) return "the server is unreachable";
  if (error instanceof Error) return error.message;
  return "something went wrong";
}

export function useOrders(): OrdersResult {
  const [orders, setOrders] = useState<Order[]>();
  const [error, setError] = useState<string>();
  const [isFetching, setIsFetching] = useState(true);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const id = ++requestId.current;
    setIsFetching(true);
    ordersApi
      .getOrders()
      .then((fetched) => {
        if (id !== requestId.current) return;
        setOrders(fetched);
        setError(undefined);
      })
      .catch((cause: unknown) => {
        if (id !== requestId.current) return;
        setError(errorMessage(cause));
      })
      .finally(() => {
        if (id === requestId.current) setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const watch = () => {
      socket.emit("orders:watch", () => undefined);
    };
    const upsert = (order: Order) => {
      setOrders((current) => {
        if (!current) return current;
        if (current.some((candidate) => candidate.id === order.id)) {
          return current.map((candidate) =>
            candidate.id === order.id ? order : candidate,
          );
        }
        return [order, ...current];
      });
    };
    const replace = (order: Order) => {
      setOrders((current) =>
        current?.map((candidate) =>
          candidate.id === order.id ? order : candidate,
        ),
      );
    };

    socket.on("order:created", upsert);
    socket.on("order:updated", replace);
    socket.on("connect", watch);
    watch();

    return () => {
      socket.emit("orders:unwatch");
      socket.off("order:created", upsert);
      socket.off("order:updated", replace);
      socket.off("connect", watch);
    };
  }, []);

  const updateStatus = useCallback(
    (id: string, status: OrderStatus): Promise<boolean> => {
      let previous: OrderStatus | undefined;
      setOrders((current) =>
        current?.map((order) => {
          if (order.id !== id) return order;
          previous = order.status;
          return { ...order, status };
        }),
      );
      return ordersApi.updateOrderStatus(id, status).then(
        (updated) => {
          setOrders((current) =>
            current?.map((order) => (order.id === id ? updated : order)),
          );
          return true;
        },
        () => {
          setOrders((current) =>
            current?.map((order) =>
              order.id === id && previous
                ? { ...order, status: previous }
                : order,
            ),
          );
          return false;
        },
      );
    },
    [],
  );

  return { orders, error, isFetching, refetch: load, updateStatus };
}
