import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Order } from "../../../shared/types";
import { formatCurrency, relativeTime, shortOrderId } from "../utils/format";
import StatusChip from "./StatusChip";

interface OrderCardProps {
  order: Order;
  customerName: string;
}

function OrderCard({ order, customerName }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const TypeIcon =
    order.orderType === "delivery" ? DeliveryDiningIcon : ShoppingBagIcon;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {shortOrderId(order.id)}
          </Typography>
          <StatusChip status={order.status} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75} my={0.5}>
          <TypeIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap>
            {customerName}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
          {order.orderType} · {relativeTime(order.createdAt)}
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
        </Stack>
      </CardContent>
    </Card>
  );
}

export default OrderCard;
