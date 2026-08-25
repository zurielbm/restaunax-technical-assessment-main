import { InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { OrderType } from "../../../shared/types";

export type TypeFilter = OrderType | "all";
export type SortOrder = "queue" | "newest" | "oldest" | "total";

interface OrderToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
  sort: SortOrder;
  onSortChange: (value: SortOrder) => void;
}

function OrderToolbar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
}: OrderToolbarProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      <TextField
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search order, customer or item"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        inputProps={{ "aria-label": "Search orders" }}
      />
      <TextField
        value={type}
        onChange={(event) => onTypeChange(event.target.value as TypeFilter)}
        select
        size="small"
        label="Type"
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="all">All types</MenuItem>
        <MenuItem value="delivery">Delivery</MenuItem>
        <MenuItem value="pickup">Pickup</MenuItem>
      </TextField>
      <TextField
        value={sort}
        onChange={(event) => onSortChange(event.target.value as SortOrder)}
        select
        size="small"
        label="Sort"
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="queue">Queue first</MenuItem>
        <MenuItem value="newest">Newest first</MenuItem>
        <MenuItem value="oldest">Oldest first</MenuItem>
        <MenuItem value="total">Highest total</MenuItem>
      </TextField>
    </Stack>
  );
}

export default OrderToolbar;
