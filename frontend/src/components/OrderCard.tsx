import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Order } from "../../../shared/types";
import { ADVANCE_LABEL, NEXT_STATUS } from "../queue/queue";
import { formatCurrency, relativeTime, shortOrderId } from "../utils/format";
import StatusChip from "./StatusChip";
import WaitChip from "./WaitChip";

interface OrderCardProps {
  order: Order;
  customerName: string;
  queuePosition?: number;
  waitMinutes?: number;
  onAdvance?: () => void;
  onOpen?: () => void;
}

function OrderCard({
  order,
  customerName,
  queuePosition,
  waitMinutes,
  onAdvance,
  onOpen,
}: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const TypeIcon =
    order.orderType === "delivery" ? DeliveryDiningIcon : ShoppingBagIcon;

  return (
    <Card
      variant="outlined"
      onClick={onOpen}
      sx={{ height: "100%", cursor: onOpen ? "pointer" : undefined }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {queuePosition !== undefined && (
              <Box
                aria-label={`Queue position ${queuePosition}`}
                sx={{
                  minWidth: 28,
                  height: 28,
                  px: 0.5,
                  borderRadius: "50%",
                  bgcolor:
                    queuePosition === 1 ? "primary.main" : "secondary.main",
                  color: "common.white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {queuePosition}
              </Box>
            )}
            <Typography variant="subtitle1" fontWeight={700}>
              {shortOrderId(order.id)}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end" spacing={0.5}>
            <StatusChip status={order.status} />
            {waitMinutes !== undefined && <WaitChip minutes={waitMinutes} />}
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75} my={0.5}>
          <TypeIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap>
            {customerName}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {itemCount} {itemCount === 1 ? "item" : "items"} · {order.orderType}{" "}
          · {relativeTime(order.createdAt)}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={1.5}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {formatCurrency(order.total)}
          </Typography>
          {onAdvance && NEXT_STATUS[order.status] && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onAdvance();
              }}
            >
              {ADVANCE_LABEL[order.status]}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default OrderCard;
