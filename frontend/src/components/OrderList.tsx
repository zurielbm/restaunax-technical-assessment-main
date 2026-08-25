import { Box, Button, Grid, Typography } from "@mui/material";
import { Customer, Order } from "../../../shared/types";
import { shortOrderId } from "../utils/format";
import OrderCard from "./OrderCard";

interface OrderListProps {
  orders: Order[];
  customersById: ReadonlyMap<string, Customer>;
  emptyMessage: string;
  onClearFilter?: () => void;
}

function OrderList({
  orders,
  customersById,
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
    <Grid container spacing={2}>
      {orders.map((order) => (
        <Grid item key={order.id} xs={12} sm={6} md={4}>
          <OrderCard
            order={order}
            customerName={
              customersById.get(order.customerId)?.name ??
              `Customer ${shortOrderId(order.customerId)}`
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default OrderList;
