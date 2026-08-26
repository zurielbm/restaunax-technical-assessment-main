import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { Customer, OrderType } from "../../../shared/types";
import { useCart } from "../hooks/useCart";
import { useCustomers } from "../hooks/useCustomers";
import { useOrders } from "../hooks/useOrders";
import { buildQueue, estimatedQueueMinutes } from "../queue/queue";
import { ordersApi } from "../services/api";
import { formatDuration, shortOrderId } from "../utils/format";
import CartPanel from "../components/CartPanel";
import CustomerPicker from "../components/CustomerPicker";
import MenuGrid from "../components/MenuGrid";

interface SnackMessage {
  message: string;
  severity: "success" | "error";
}

function CashierView() {
  const { orders, refetch } = useOrders();
  const { customers, failed: customersFailed, retry, register } = useCustomers();
  const cart = useCart();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState<SnackMessage | null>(null);

  const queue = useMemo(
    () => buildQueue(orders ?? [], Date.now()),
    [orders],
  );
  const nextPosition = queue.length + 1;

  const submitDisabled =
    cart.lines.length === 0 || customer === null || submitting;

  const submitHint =
    customer === null
      ? "Attach a customer to place the order"
      : cart.lines.length === 0
        ? "The cart is empty"
        : `Joins the queue at #${nextPosition} · est. wait ~${formatDuration(
            estimatedQueueMinutes(nextPosition),
          )}`;

  const submit = () => {
    if (customer === null) return;
    setSubmitting(true);
    ordersApi
      .createOrder({
        customerId: customer.id,
        orderType,
        items: cart.lines.map((line) => ({
          name: line.item.name,
          quantity: line.quantity,
          price: line.item.price,
        })),
      })
      .then((order) => {
        setSnack({
          message: `${shortOrderId(order.id)} placed for ${customer.name} · #${nextPosition} in queue`,
          severity: "success",
        });
        cart.clear();
        setCustomer(null);
        refetch();
      })
      .catch(() =>
        setSnack({
          message: "Couldn't place the order, nothing was saved",
          severity: "error",
        }),
      )
      .finally(() => setSubmitting(false));
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={2} my={4}>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Typography variant="h4" component="h1">
            Cashier
          </Typography>
          {orders && (
            <Chip
              label={`Queue: ${queue.length} orders · ~${formatDuration(
                estimatedQueueMinutes(queue.length),
              )}`}
              variant="outlined"
            />
          )}
        </Stack>

        {customersFailed && (
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={retry}>
                Retry
              </Button>
            }
          >
            Customers couldn't be loaded, so orders can't be attached yet.
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <MenuGrid onAdd={cart.add} />
          <Paper
            variant="outlined"
            sx={{ p: 2, position: { md: "sticky" }, top: { md: 80 } }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">New order</Typography>
              <CustomerPicker
                customers={customers}
                value={customer}
                onChange={setCustomer}
                onCreated={register}
              />
              <CartPanel
                lines={cart.lines}
                total={cart.total}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                onChangeQuantity={cart.changeQuantity}
                submitDisabled={submitDisabled}
                submitHint={submitHint}
                onSubmit={submit}
              />
            </Stack>
          </Paper>
        </Box>
      </Stack>

      {snack && (
        <Snackbar
          open
          autoHideDuration={4000}
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

export default CashierView;
