import { Box, Button, Typography } from "@mui/material";
import { Customer, Order } from "../../../shared/types";
import { QueueEntry } from "../queue/queue";
import { shortOrderId } from "../utils/format";
import OrderCard from "./OrderCard";

interface OrderListProps {
  orders: Order[];
  customersById: ReadonlyMap<string, Customer>;
  queueByOrderId: ReadonlyMap<string, QueueEntry>;
  emptyMessage: string;
  onClearFilter?: () => void;
}

function OrderList({
  orders,
  customersById,
  queueByOrderId,
  emptyMessage,
  onClearFilter,
}: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        {onClearFilter && (
          <Button onClick={onClearFilter}>Show all orders</Button>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      {orders.map((order) => {
        const entry = queueByOrderId.get(order.id);
        return (
          <OrderCard
            key={order.id}
            order={order}
            customerName={
              customersById.get(order.customerId)?.name ??
              `Customer ${shortOrderId(order.customerId)}`
            }
            queuePosition={entry?.position}
            waitMinutes={entry?.waitMinutes}
          />
        );
      })}
    </Box>
  );
}

export default OrderList;
