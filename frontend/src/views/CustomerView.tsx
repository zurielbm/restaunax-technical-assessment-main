import { useMemo, useState } from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useCart } from "../hooks/useCart";
import { useCustomers } from "../hooks/useCustomers";
import { useOrders } from "../hooks/useOrders";
import { buildQueue, estimatedQueueMinutes } from "../queue/queue";
import { customersApi, ordersApi } from "../services/api";
import { formatDuration } from "../utils/format";
import { earnedPoints, pointsDiscountCents } from "../utils/points";
import { savePlacedNote } from "../utils/placedNote";
import CartPanel from "../components/CartPanel";
import CheckoutDialog, { CheckoutDetails } from "../components/CheckoutDialog";
import MenuGrid from "../components/MenuGrid";
import OrderTracking from "../components/OrderTracking";
import { OrderType } from "../../../shared/types";

function Storefront() {
  const { orders, refetch } = useOrders();
  const { customers, register, retry } = useCustomers();
  const cart = useCart();
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const queue = useMemo(() => buildQueue(orders ?? [], Date.now()), [orders]);
  const nextPosition = queue.length + 1;

  const checkout = (details: CheckoutDetails) => {
    setSubmitting(true);
    setCheckoutError(null);
    const existing =
      details.customer ??
      customers.find(
        (customer) =>
          customer.email.toLowerCase() === details.email.toLowerCase(),
      );
    const ensureCustomer = existing
      ? Promise.resolve(existing)
      : customersApi
          .createCustomer({
            name: details.name,
            email: details.email,
            phone: details.phone,
          })
          .then((customer) => {
            register(customer);
            return customer;
          });

    const totalCents = Math.round(cart.total * 100);
    const paidCents = totalCents - pointsDiscountCents(details.redeemPoints);

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
          redeemPoints: details.redeemPoints,
        }),
      )
      .then((order) => {
        savePlacedNote(order.id, {
          earnedPoints: earnedPoints(paidCents),
          redeemedPoints: details.redeemPoints,
        });
        cart.clear();
        setCheckoutOpen(false);
        refetch();
        retry();
        window.location.hash = `/track/${order.id}`;
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
        total={cart.total}
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
    return <OrderTracking orderId={trackedOrderId} />;
  }
  return <Storefront />;
}

export default CustomerView;
