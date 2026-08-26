import { Chip } from "@mui/material";
import { OrderStatus } from "../../../shared/types";

const statusColor: Record<
  OrderStatus,
  "warning" | "info" | "success" | "default"
> = {
  pending: "warning",
  preparing: "info",
  ready: "success",
  delivered: "default",
};

function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <Chip
      label={status}
      color={statusColor[status]}
      size="small"
      sx={{ textTransform: "capitalize", fontWeight: 600 }}
    />
  );
}

export default StatusChip;
