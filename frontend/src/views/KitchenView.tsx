import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Order } from "../../../shared/types";
import { useCustomers } from "../hooks/useCustomers";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useOrders } from "../hooks/useOrders";
import { buildQueue, NEXT_STATUS, QueueEntry } from "../queue/queue";
import NextUpBanner from "../components/NextUpBanner";
import OrderDetailDrawer from "../components/OrderDetailDrawer";
import OrderFilters, { StatusFilter } from "../components/OrderFilters";
import OrderList from "../components/OrderList";
import OrderListSkeleton from "../components/OrderListSkeleton";
import StatsRow from "../components/StatsRow";
import OrderToolbar, {
  SortOrder,
  TypeFilter,
} from "../components/OrderToolbar";
import { shortOrderId } from "../utils/format";

function comparatorFor(
  sort: SortOrder,
  queueByOrderId: ReadonlyMap<string, QueueEntry>,
): (a: Order, b: Order) => number {
  switch (sort) {
    case "queue":
      return (a, b) => {
        const positionA =
          queueByOrderId.get(a.id)?.position ?? Number.MAX_SAFE_INTEGER;
        const positionB =
          queueByOrderId.get(b.id)?.position ?? Number.MAX_SAFE_INTEGER;
        if (positionA !== positionB) return positionA - positionB;
        return b.createdAt.localeCompare(a.createdAt);
      };
    case "newest":
      return (a, b) => b.createdAt.localeCompare(a.createdAt);
    case "oldest":
      return (a, b) => a.createdAt.localeCompare(b.createdAt);
    case "total":
      return (a, b) => b.total - a.total;
  }
}

interface SnackMessage {
  message: string;
  severity: "success" | "error";
}

function KitchenView() {
  const { orders, error, isFetching, refetch, updateStatus } = useOrders();
  const { customersById, failed: customersFailed, retry } = useCustomers();
  const [filter, setFilter] = useState<StatusFilter>("queue");
  const [searchInput, setSearchInput] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortOrder>("queue");
  const [snack, setSnack] = useState<SnackMessage | null>(null);
  const [confirmOrder, setConfirmOrder] = useState<Order | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const search = useDebouncedValue(searchInput.trim().toLowerCase(), 250);

  const loadedOrders = useMemo(() => orders ?? [], [orders]);

  const queue = useMemo(
    () => buildQueue(loadedOrders, Date.now()),
    [loadedOrders],
  );

  const queueByOrderId = useMemo(
    () =>
      new Map<string, QueueEntry>(
        queue.map((entry) => [entry.order.id, entry]),
      ),
    [queue],
  );

  const counts = useMemo<Record<StatusFilter, number>>(
    () => ({
      queue: queue.length,
      all: loadedOrders.length,
      pending: loadedOrders.filter((order) => order.status === "pending")
        .length,
      preparing: loadedOrders.filter((order) => order.status === "preparing")
        .length,
      ready: loadedOrders.filter((order) => order.status === "ready").length,
      delivered: loadedOrders.filter((order) => order.status === "delivered")
        .length,
    }),
    [loadedOrders, queue],
  );

  const visibleOrders = useMemo(() => {
    const matchesSearch = (order: Order) => {
      if (!search) return true;
      const customerName =
        customersById.get(order.customerId)?.name.toLowerCase() ?? "";
      return (
        order.id.toLowerCase().includes(search) ||
        customerName.includes(search) ||
        order.items.some((item) => item.name.toLowerCase().includes(search))
      );
    };

    const base =
      filter === "queue"
        ? queue.map((entry) => entry.order)
        : loadedOrders.filter(
            (order) => filter === "all" || order.status === filter,
          );

    return base
      .filter((order) => type === "all" || order.orderType === type)
      .filter(matchesSearch)
      .sort(comparatorFor(sort, queueByOrderId));
  }, [loadedOrders, queue, queueByOrderId, filter, type, search, sort, customersById]);

  const nextUp = queue[0];
  const selectedOrder =
    loadedOrders.find((order) => order.id === selectedId) ?? null;
  const hasActiveFilters =
    filter !== "queue" || type !== "all" || search !== "";
  const initialLoading = !orders && isFetching;
  const initialError = !orders && !isFetching && error;
  const refreshError = orders && error;

  const clearFilters = () => {
    setFilter("queue");
    setType("all");
    setSearchInput("");
  };

  const olderPendingCount = (order: Order) =>
    loadedOrders.filter(
      (other) =>
        other.status === "pending" && other.createdAt < order.createdAt,
    ).length;

  const performAdvance = (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    updateStatus(order.id, next).then((succeeded) =>
      setSnack(
        succeeded
          ? {
              message: `${shortOrderId(order.id)} moved to ${next}`,
              severity: "success",
            }
          : {
              message: `Couldn't update ${shortOrderId(order.id)}, the change was rolled back`,
              severity: "error",
            },
      ),
    );
  };

  const requestAdvance = (order: Order) => {
    if (order.status === "pending" && olderPendingCount(order) > 0) {
      setConfirmOrder(order);
    } else {
      performAdvance(order);
    }
  };

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

        {(orders || initialLoading) && (
          <StatsRow
            queue={queue}
            orders={loadedOrders}
            loading={initialLoading}
          />
        )}

        <OrderToolbar
          search={searchInput}
          onSearchChange={setSearchInput}
          type={type}
          onTypeChange={setType}
          sort={sort}
          onSortChange={setSort}
        />

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

        {orders && filter === "queue" && nextUp && (
          <NextUpBanner
            entry={nextUp}
            customerName={
              customersById.get(nextUp.order.customerId)?.name ??
              `Customer ${shortOrderId(nextUp.order.customerId)}`
            }
            onAdvance={() => requestAdvance(nextUp.order)}
          />
        )}

        {orders && (
          <OrderList
            orders={visibleOrders}
            customersById={customersById}
            queueByOrderId={queueByOrderId}
            emptyMessage={
              filter === "queue" && !hasActiveFilters
                ? "The queue is clear."
                : hasActiveFilters
                  ? "No orders match your filters."
                  : "No orders yet."
            }
            onClearFilter={hasActiveFilters ? clearFilters : undefined}
            onAdvance={requestAdvance}
            onOpen={(order) => setSelectedId(order.id)}
          />
        )}
      </Stack>

      <OrderDetailDrawer
        order={selectedOrder}
        customer={
          selectedOrder
            ? customersById.get(selectedOrder.customerId)
            : undefined
        }
        queueEntry={
          selectedOrder ? queueByOrderId.get(selectedOrder.id) : undefined
        }
        onClose={() => setSelectedId(null)}
        onAdvance={requestAdvance}
      />

      <Dialog open={confirmOrder !== null} onClose={() => setConfirmOrder(null)}>
        <DialogTitle>Skip the queue?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmOrder &&
              `${olderPendingCount(confirmOrder)} pending ${
                olderPendingCount(confirmOrder) === 1 ? "order has" : "orders have"
              } waited longer than ${shortOrderId(confirmOrder.id)}.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOrder(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (confirmOrder) performAdvance(confirmOrder);
              setConfirmOrder(null);
            }}
          >
            Start anyway
          </Button>
        </DialogActions>
      </Dialog>

      {snack && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setSnack(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snack.severity} onClose={() => setSnack(null)}>
            {snack.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default KitchenView;
