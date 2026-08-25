import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Container,
  IconButton,
  LinearProgress,
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
  const { orders, error, isFetching, refetch } = useOrders();
  const { customersById, failed: customersFailed, retry } = useCustomers();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const loadedOrders = orders ?? [];

  const counts = useMemo<Record<StatusFilter, number>>(
    () => ({
      all: loadedOrders.length,
      pending: loadedOrders.filter((order) => order.status === "pending")
        .length,
      preparing: loadedOrders.filter((order) => order.status === "preparing")
        .length,
      ready: loadedOrders.filter((order) => order.status === "ready").length,
      delivered: loadedOrders.filter((order) => order.status === "delivered")
        .length,
    }),
    [loadedOrders],
  );

  const visibleOrders = useMemo(
    () =>
      filter === "all"
        ? loadedOrders
        : loadedOrders.filter((order) => order.status === filter),
    [loadedOrders, filter],
  );

  const initialLoading = !orders && isFetching;
  const initialError = !orders && !isFetching && error;
  const refreshError = orders && error;

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
            disabled={isFetching}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>

        <OrderFilters value={filter} counts={counts} onChange={setFilter} />

        {orders && (
          <LinearProgress
            sx={{ visibility: isFetching ? "visible" : "hidden" }}
          />
        )}

        {refreshError && (
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            Refresh failed: {error}. Showing the last loaded orders.
          </Alert>
        )}

        {customersFailed && (
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={retry}>
                Retry
              </Button>
            }
          >
            Customer names couldn't be loaded, so orders show customer ids
            instead.
          </Alert>
        )}

        {initialLoading && <OrderListSkeleton />}

        {initialError && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            Couldn't load orders: {error}. Check if the backend is running.
          </Alert>
        )}

        {orders && (
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
