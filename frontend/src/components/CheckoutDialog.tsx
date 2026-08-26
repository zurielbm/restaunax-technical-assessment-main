import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EMAIL_PATTERN } from "../utils/validation";

export interface CheckoutDetails {
  name: string;
  email: string;
  phone: string;
}

interface CheckoutDialogProps {
  open: boolean;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (details: CheckoutDetails) => void;
}

function CheckoutDialog({
  open,
  submitting,
  error,
  onClose,
  onSubmit,
}: CheckoutDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setPhone("");
    }
  }, [open]);

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
            fullWidth
          />
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            fullWidth
          />
          <Typography variant="caption" color="text.secondary">
            Ordered with us before? We'll recognize you by your email.
          </Typography>
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
