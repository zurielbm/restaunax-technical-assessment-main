import { Chip } from "@mui/material";
import { waitSeverity, WaitSeverity } from "../queue/queue";

const chipColor: Record<WaitSeverity, "success" | "warning" | "error"> = {
  ok: "success",
  warning: "warning",
  critical: "error",
};

function formatWait(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function WaitChip({ minutes }: { minutes: number }) {
  const severity = waitSeverity(minutes);
  return (
    <Chip
      label={`waiting ${formatWait(minutes)}`}
      color={chipColor[severity]}
      size="small"
      sx={{
        fontWeight: 700,
        animation:
          severity === "critical" ? "waitPulse 1.6s infinite" : undefined,
        "@keyframes waitPulse": {
          "0%": { opacity: 1 },
          "50%": { opacity: 0.5 },
          "100%": { opacity: 1 },
        },
      }}
    />
  );
}

export default WaitChip;
