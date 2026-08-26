import {
  Button,
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { OrderType } from "../../../shared/types";
import { CartLine } from "../hooks/useCart";
import { formatCurrency } from "../utils/format";

interface CartPanelProps {
  lines: CartLine[];
  total: number;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  onChangeQuantity: (itemId: string, delta: number) => void;
  submitDisabled: boolean;
  submitHint: string;
  submitLabel?: string;
  onSubmit: () => void;
}

function CartPanel({
  lines,
  total,
  orderType,
  onOrderTypeChange,
  onChangeQuantity,
  submitDisabled,
  submitHint,
  submitLabel = "Place order",
  onSubmit,
}: CartPanelProps) {
  return (
    <Stack spacing={1.5}>
      {lines.length === 0 ? (
        <Typography variant="body2" color="text.secondary" py={2}>
          Tap menu items to build the order.
        </Typography>
      ) : (
        lines.map((line) => (
          <Stack
            key={line.item.id}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
              {line.item.name}
            </Typography>
            <IconButton
              aria-label={`Remove one ${line.item.name}`}
              size="small"
              onClick={() => onChangeQuantity(line.item.id, -1)}
            >
              <RemoveIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body2" fontWeight={700} minWidth={16} textAlign="center">
              {line.quantity}
            </Typography>
            <IconButton
              aria-label={`Add one ${line.item.name}`}
              size="small"
              onClick={() => onChangeQuantity(line.item.id, 1)}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body2" minWidth={56} textAlign="right">
              {formatCurrency(line.item.price * line.quantity)}
            </Typography>
          </Stack>
        ))
      )}

      <ToggleButtonGroup
        value={orderType}
        exclusive
        onChange={(_event, next: OrderType | null) => {
          if (next) onOrderTypeChange(next);
        }}
        size="small"
        fullWidth
      >
        <ToggleButton value="pickup">Pickup</ToggleButton>
        <ToggleButton value="delivery">Delivery</ToggleButton>
      </ToggleButtonGroup>

      <Divider />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight={700}>
          Total
        </Typography>
        <Typography variant="subtitle1" fontWeight={700}>
          {formatCurrency(total)}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        size="large"
        disabled={submitDisabled}
        onClick={onSubmit}
      >
        {submitLabel}
      </Button>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        {submitHint}
      </Typography>
    </Stack>
  );
}

export default CartPanel;
