import { useCallback, useEffect, useState } from "react";
import { Order } from "../../../shared/types";
import { ordersApi } from "../services/api";

export type OrdersState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orders: Order[] };

export function useOrders(): { state: OrdersState; refetch: () => void } {
  const [state, setState] = useState<OrdersState>({ status: "loading" });

  const load = useCallback(() => {
    setState({ status: "loading" });
    ordersApi
      .getOrders()
      .then((orders) => setState({ status: "ready", orders }))
      .catch((error: unknown) =>
        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : "Failed to load orders",
        })
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { state, refetch: load };
}
