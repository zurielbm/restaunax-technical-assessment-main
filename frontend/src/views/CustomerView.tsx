import { useMemo, useState } from "react";
import { Alert, Box, Container, Paper, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { OrderType } from "../../../shared/types";
import { useCart } from "../hooks/useCart";
import { useCustomers } from "../hooks/useCustomers";
import { useOrders } from "../hooks/useOrders";
import { buildQueue, estimatedQueueMinutes } from "../queue/queue";
import { customersApi, ordersApi } from "../services/api";
import { formatDuration, shortOrderId } from "../utils/format";
import CartPanel from "../components/CartPanel";
import CheckoutDialog, { CheckoutDetails } from "../components/CheckoutDialog";
import MenuGrid from "../components/MenuGrid";

interface PlacedOrder {
  id: string;
  position: number;
  waitMinutes: number;
}

function Storefront() {
  const { orders, refetch } = useOrders();
  const { customers, register } = useCustomers();
  const cart = useCart();
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const queue = useMemo(() => buildQueue(orders ?? [], Date.now()), [orders]);
  const nextPosition = queue.length + 1;

  const checkout = (details: CheckoutDetails) => {
    setSubmitting(true);
    setCheckoutError(null);
    const existing = customers.find(
      (customer) =>
        customer.email.toLowerCase() === details.email.toLowerCase(),
    );
    const ensureCustomer = existing
      ? Promise.resolve(existing)
      : customersApi.createCustomer(details).then((customer) => {
          register(customer);
          return customer;
        });

    ensureCustomer
      .then((customer) =>
        ordersApi.createOrder({
          customerId: customer.id,
          orderType,
          items: cart.lines.map((line) => ({
            name: line.item.name,
            quantity: line.quantity,
            price: line.item.price,
          })),
        }),
      )
      .then((order) => {
        setPlaced({
          id: order.id,
          position: nextPosition,
          waitMinutes: estimatedQueueMinutes(nextPosition),
        });
        cart.clear();
        setCheckoutOpen(false);
        refetch();
      })
      .catch(() =>
        setCheckoutError("Couldn't place your order, please try again"),
      )
      .finally(() => setSubmitting(false));
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={2} my={4}>
        <Typography variant="h4" component="h1">
          Order Online
        </Typography>

        {placed && (
          <Alert severity="success" onClose={() => setPlaced(null)}>
            Order {shortOrderId(placed.id)} placed! estimated ready in ~15 to 20
            minutes.
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
              <Typography variant="h6">Your order</Typography>
              <CartPanel
                lines={cart.lines}
                total={cart.total}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                onChangeQuantity={cart.changeQuantity}
                submitDisabled={cart.lines.length === 0 || submitting}
                submitHint={
                  cart.lines.length === 0
                    ? "Add something tasty to get started"
                    : `Joins the queue at #${nextPosition} · est. wait ~${formatDuration(
                        estimatedQueueMinutes(nextPosition),
                      )}`
                }
                submitLabel="Checkout"
                onSubmit={() => {
                  setCheckoutError(null);
                  setCheckoutOpen(true);
                }}
              />
            </Stack>
          </Paper>
        </Box>
      </Stack>

      <CheckoutDialog
        open={checkoutOpen}
        submitting={submitting}
        error={checkoutError}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={checkout}
      />
    </Container>
  );
}

interface CustomerViewProps {
  trackedOrderId?: string;
}

function CustomerView({ trackedOrderId }: CustomerViewProps) {
  if (trackedOrderId) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Order Online
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live tracking for order {trackedOrderId}
          </Typography>
        </Box>
      </Container>
    );
  }
  return <Storefront />;
}

export default CustomerView;
