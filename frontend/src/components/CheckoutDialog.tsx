import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Customer } from "../../../shared/types";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { customersApi } from "../services/api";
import { formatCurrency } from "../utils/format";
import {
  earnedPoints,
  maxRedeemablePoints,
  pointsDiscountCents,
  pointsValue,
} from "../utils/points";
import { EMAIL_PATTERN } from "../utils/validation";

export interface CheckoutDetails {
  name: string;
  email: string;
  phone: string;
  customer: Customer | null;
  redeemPoints: number;
}

interface CheckoutDialogProps {
  open: boolean;
  total: number;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (details: CheckoutDetails) => void;
}

function CheckoutDialog({
  open,
  total,
  submitting,
  error,
  onClose,
  onSubmit,
}: CheckoutDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [matched, setMatched] = useState<Customer | null>(null);
  const [pointsInput, setPointsInput] = useState("");
  const lookupId = useRef(0);
  const debouncedEmail = useDebouncedValue(email.trim(), 400);

  useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setPhone("");
      setMatched(null);
      setPointsInput("");
    }
  }, [open]);

  useEffect(() => {
    const id = ++lookupId.current;
    if (!EMAIL_PATTERN.test(debouncedEmail)) {
      setMatched(null);
      return;
    }
    customersApi
      .getCustomerByEmail(debouncedEmail)
      .then((customer) => {
        if (id !== lookupId.current) return;
        setMatched(customer);
        setPointsInput("");
        if (customer) {
          setName(customer.name);
          setPhone(customer.phone);
        }
      })
      .catch(() => {
        if (id === lookupId.current) setMatched(null);
      });
  }, [debouncedEmail]);

  const totalCents = Math.round(total * 100);
  const maxPoints = matched
    ? maxRedeemablePoints(matched.rewardPoints, totalCents)
    : 0;
  const requested = Math.max(0, Math.floor(Number(pointsInput) || 0));
  const applied = Math.min(requested, maxPoints);
  const discountCents = pointsDiscountCents(applied);
  const payCents = totalCents - discountCents;
  const earned = earnedPoints(payCents);

  const formValid =
    name.trim() !== "" && EMAIL_PATTERN.test(email) && phone.trim() !== "";

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={email !== "" && !EMAIL_PATTERN.test(email)}
            autoFocus
            fullWidth
          />
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            fullWidth
          />

          {matched && matched.rewardPoints > 0 && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Typography variant="body2">
                  Welcome back, {matched.name}! You have{" "}
                  <b>{matched.rewardPoints.toLocaleString()} points</b> (worth{" "}
                  {formatCurrency(pointsValue(matched.rewardPoints))}).
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Points to apply"
                    type="number"
                    size="small"
                    value={pointsInput}
                    onChange={(event) => setPointsInput(event.target.value)}
                    inputProps={{ min: 0, step: 100 }}
                    helperText={
                      applied > 0
                        ? `Applying ${applied.toLocaleString()} points (−${formatCurrency(discountCents / 100)})`
                        : `1,000 points = $1 · up to ${maxPoints.toLocaleString()} on this order`
                    }
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    onClick={() => setPointsInput(String(maxPoints))}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Max
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          )}

          <Divider />
          <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Total</Typography>
              <Typography variant="body2">{formatCurrency(total)}</Typography>
            </Stack>
            {applied > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Points discount</Typography>
                <Typography variant="body2">
                  −{formatCurrency(discountCents / 100)}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={700}>
                To pay
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {formatCurrency(payCents / 100)}
              </Typography>
            </Stack>
            <Typography variant="caption" color="success.main">
              You'll earn {earned} points on this order
            </Typography>
          </Stack>

          {!matched && (
            <Typography variant="caption" color="text.secondary">
              Ordered with us before? We'll recognize you by your email.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!formValid || submitting}
          onClick={() =>
            onSubmit({
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              customer: matched,
              redeemPoints: applied,
            })
          }
        >
          Place order
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CheckoutDialog;
