import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useCustomers } from "../hooks/useCustomers";
import { useOrders } from "../hooks/useOrders";
import OrderFilters, { StatusFilter } from "../components/OrderFilters";
import OrderList from "../components/OrderList";
import OrderListSkeleton from "../components/OrderListSkeleton";

function KitchenView() {
  const { state, refetch } = useOrders();
  const customersById = useCustomers();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const orders = state.status === "ready" ? state.orders : [];

  const counts = useMemo<Record<StatusFilter, number>>(
    () => ({
      all: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      preparing: orders.filter((order) => order.status === "preparing").length,
      ready: orders.filter((order) => order.status === "ready").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    }),
    [orders]
  );

  const visibleOrders = useMemo(
    () =>
      filter === "all"
        ? orders
        : orders.filter((order) => order.status === filter),
    [orders, filter]
  );

  return (
    <Container maxWidth="lg">
      <Stack spacing={2} my={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h4" component="h1">
            Kitchen
          </Typography>
          <IconButton
            aria-label="Refresh orders"
            onClick={refetch}
            disabled={state.status === "loading"}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>

        <OrderFilters value={filter} counts={counts} onChange={setFilter} />

        {state.status === "loading" && <OrderListSkeleton />}

        {state.status === "error" && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            Couldn't load orders: {state.message}. Check that the backend is
            running on port 3000.
          </Alert>
        )}

        {state.status === "ready" && (
          <OrderList
            orders={visibleOrders}
            customersById={customersById}
            emptyMessage={
              filter === "all"
                ? "No orders yet."
                : `No ${filter} orders right now.`
            }
            onClearFilter={
              filter === "all" ? undefined : () => setFilter("all")
            }
          />
        )}
      </Stack>
    </Container>
  );
}

export default KitchenView;
