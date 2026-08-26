import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { ADVANCE_LABEL, NEXT_STATUS, QueueEntry } from "../queue/queue";
import { shortOrderId } from "../utils/format";
import StatusChip from "./StatusChip";
import WaitChip from "./WaitChip";

interface NextUpBannerProps {
  entry: QueueEntry;
  customerName: string;
  onAdvance: () => void;
}

function NextUpBanner({ entry, customerName, onAdvance }: NextUpBannerProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderColor: "primary.main",
        borderWidth: 2,
        bgcolor: "#FFF4ED",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        flexWrap="wrap"
        useFlexGap
      >
        <Chip label="NEXT UP" color="primary" size="small" />
        <Typography fontWeight={700}>{shortOrderId(entry.order.id)}</Typography>
        <Typography noWrap>{customerName}</Typography>
        <StatusChip status={entry.order.status} />
        <WaitChip minutes={entry.waitMinutes} />
        {NEXT_STATUS[entry.order.status] && (
          <Button
            variant="contained"
            size="small"
            onClick={onAdvance}
            sx={{ ml: "auto" }}
          >
            {ADVANCE_LABEL[entry.order.status]}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

export default NextUpBanner;
