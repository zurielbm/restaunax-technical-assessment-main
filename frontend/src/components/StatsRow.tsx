import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { SvgIconComponent } from "@mui/icons-material";
import { Order } from "../../../shared/types";
import {
  estimatedQueueMinutes,
  QueueEntry,
  WAIT_CRITICAL_MINUTES,
} from "../queue/queue";
import { formatCurrency, formatDuration } from "../utils/format";

interface StatTileProps {
  icon: SvgIconComponent;
  iconColor: string;
  label: string;
  value: string;
  caption: string;
}

function StatTile({
  icon: Icon,
  iconColor,
  label,
  value,
  caption,
}: StatTileProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" spacing={0.75} alignItems="center" mb={0.5}>
        <Icon fontSize="small" sx={{ color: iconColor }} />
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
    </Paper>
  );
}

interface StatsRowProps {
  queue: QueueEntry[];
  orders: Order[];
  loading: boolean;
}

function StatsRow({ queue, orders, loading }: StatsRowProps) {
  const grid = {
    display: "grid",
    gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
    gap: 2,
  };

  if (loading) {
    return (
      <Box sx={grid}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={104} />
        ))}
      </Box>
    );
  }

  const critical = queue.filter(
    (entry) => entry.waitMinutes >= WAIT_CRITICAL_MINUTES,
  ).length;
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Box sx={grid}>
      <StatTile
        icon={ReceiptLongOutlinedIcon}
        iconColor="secondary.main"
        label="In queue"
        value={String(queue.length)}
        caption="pending through ready"
      />
      <StatTile
        icon={ScheduleOutlinedIcon}
        iconColor="secondary.main"
        label="Est. queue time"
        value={formatDuration(estimatedQueueMinutes(queue.length))}
        caption="at 8 min per order"
      />
      <StatTile
        icon={critical > 0 ? WarningAmberIcon : CheckCircleOutlineIcon}
        iconColor={critical > 0 ? "error.main" : "success.main"}
        label={`Waiting over ${WAIT_CRITICAL_MINUTES}m`}
        value={String(critical)}
        caption={critical > 0 ? "needs attention" : "all on time"}
      />
      <StatTile
        icon={PaymentsOutlinedIcon}
        iconColor="secondary.main"
        label="Revenue"
        value={formatCurrency(revenue)}
        caption={`across ${orders.length} orders`}
      />
    </Box>
  );
}

export default StatsRow;
