import { useCallback, useEffect, useRef, useState } from "react";
import { Order, OrderStatus } from "../../../shared/types";
import { ordersApi } from "../services/api";

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
