import { Chip, Tab, Tabs } from "@mui/material";
import { OrderStatus } from "../../../shared/types";

export type StatusFilter = OrderStatus | "all";

const filters: StatusFilter[] = [
  "all",
  "pending",
  "preparing",
  "ready",
  "delivered",
];

interface OrderFiltersProps {
  value: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
}

function OrderFilters({ value, counts, onChange }: OrderFiltersProps) {
  return (
    <Tabs
      value={value}
      onChange={(_event, next: StatusFilter) => onChange(next)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      aria-label="Filter orders by status"
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      {filters.map((filter) => (
        <Tab
          key={filter}
          value={filter}
          iconPosition="end"
          icon={<Chip label={counts[filter]} size="small" />}
          label={filter === "all" ? "All" : filter}
          sx={{ textTransform: "capitalize", minHeight: 48 }}
        />
      ))}
    </Tabs>
  );
}

export default OrderFilters;
