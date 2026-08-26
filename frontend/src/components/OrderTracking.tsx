import { useMemo } from "react";
import {
  Alert,
  Button,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { OrderStatus } from "../../../shared/types";
import { useOrders } from "../hooks/useOrders";
import { useTrackedOrder } from "../hooks/useTrackedOrder";
import { buildQueue, estimatedQueueMinutes } from "../queue/queue";
import { formatCurrency, formatDuration, shortOrderId } from "../utils/format";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "delivered",
];

const HEADLINE: Record<OrderStatus, string> = {
  pending: "Order received",
  preparing: "Your order is being prepared",
  ready: "Your order is ready!",
  delivered: "Delivered, enjoy!",
};

function OrderTracking({ orderId }: { orderId: string }) {
  const { state, retry } = useTrackedOrder(orderId);
  const { orders } = useOrders();

  const queue = useMemo(() => buildQueue(orders ?? [], Date.now()), [orders]);
  const entry = queue.find((candidate) => candidate.order.id === orderId);

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} my={4}>
        {state.status === "loading" && (
          <Skeleton variant="rounded" height={320} />
        )}

        {state.status === "notFound" && (
          <Alert severity="warning">
            We couldn't find an order with id {orderId}. Check the link from
            your confirmation.
          </Alert>
        )}

        {state.status === "error" && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={retry}>
                Retry
              </Button>
            }
          >
            Couldn't load your order: {state.message}.
          </Alert>
        )}

        {state.status === "ready" && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2.5} textAlign="center">
              <Typography variant="overline" color="text.secondary">
                Order {shortOrderId(state.order.id)}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {HEADLINE[state.order.status]}
              </Typography>

              {entry &&
                (state.order.status === "pending" ||
                  state.order.status === "preparing") && (
                  <Typography color="text.secondary">
                    You're <b>#{entry.position}</b> in line · estimated ready
                    in ~
                    {formatDuration(estimatedQueueMinutes(entry.position))}
                  </Typography>
                )}

              <LinearProgress
                variant="determinate"
                value={(STATUS_STEPS.indexOf(state.order.status) / 3) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />

              <Stepper
                activeStep={
                  state.order.status === "delivered"
                    ? STATUS_STEPS.length
                    : STATUS_STEPS.indexOf(state.order.status)
                }
                alternativeLabel
              >
                {STATUS_STEPS.map((step) => (
                  <Step key={step}>
                    <StepLabel sx={{ textTransform: "capitalize" }}>
                      {step}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider />

              <Stack spacing={0.5} textAlign="left">
                {state.order.items.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">
                      {item.quantity}× {item.name}
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Stack>
                ))}
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2">Total</Typography>
                  <Typography variant="subtitle2">
                    {formatCurrency(state.order.total)}
                  </Typography>
                </Stack>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                {state.order.orderType} · updates live
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}

export default OrderTracking;
