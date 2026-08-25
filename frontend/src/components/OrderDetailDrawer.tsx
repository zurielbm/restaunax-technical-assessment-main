import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Customer, Order, OrderStatus } from "../../../shared/types";
import { ADVANCE_LABEL, NEXT_STATUS, QueueEntry } from "../queue/queue";
import { formatCurrency, relativeTime, shortOrderId } from "../utils/format";
import StatusChip from "./StatusChip";
import WaitChip from "./WaitChip";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "delivered",
];

interface OrderDetailDrawerProps {
  order: Order | null;
  customer?: Customer;
  queueEntry?: QueueEntry;
  onClose: () => void;
  onAdvance: (order: Order) => void;
}

function OrderDetailDrawer({
  order,
  customer,
  queueEntry,
  onClose,
  onAdvance,
}: OrderDetailDrawerProps) {
  const theme = useTheme();
  const asBottomSheet = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      anchor={asBottomSheet ? "bottom" : "right"}
      open={order !== null}
      onClose={onClose}
    >
      {order && (
        <Stack
          spacing={2}
          sx={{
            p: 3,
            width: asBottomSheet ? "auto" : 400,
            maxHeight: asBottomSheet ? "85vh" : undefined,
            overflowY: "auto",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">{shortOrderId(order.id)}</Typography>
            <StatusChip status={order.status} />
            {queueEntry && <WaitChip minutes={queueEntry.waitMinutes} />}
            <Box flexGrow={1} />
            <IconButton aria-label="Close order details" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {order.orderType} · placed {relativeTime(order.createdAt)}
            {queueEntry && ` · #${queueEntry.position} in queue`}
          </Typography>

          <Stepper
            activeStep={
              order.status === "delivered"
                ? STATUS_STEPS.length
                : STATUS_STEPS.indexOf(order.status)
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

          <Stack spacing={1}>
            <Typography variant="subtitle2">Items</Typography>
            {order.items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                justifyContent="space-between"
                spacing={2}
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
              <Typography variant="subtitle1" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {formatCurrency(order.total)}
              </Typography>
            </Stack>
          </Stack>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Customer
            </Typography>
            {customer ? (
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {customer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.rewardPoints} reward points
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Customer {shortOrderId(order.customerId)}
              </Typography>
            )}
          </Paper>

          {NEXT_STATUS[order.status] && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onAdvance(order)}
            >
              {ADVANCE_LABEL[order.status]}
            </Button>
          )}
        </Stack>
      )}
    </Drawer>
  );
}

export default OrderDetailDrawer;
