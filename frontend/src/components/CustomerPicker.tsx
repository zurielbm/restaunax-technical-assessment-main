import { useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Customer } from "../../../shared/types";
import { customersApi } from "../services/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CustomerPickerProps {
  customers: Customer[];
  value: Customer | null;
  onChange: (customer: Customer | null) => void;
  onCreated: (customer: Customer) => void;
}

function CustomerPicker({
  customers,
  value,
  onChange,
  onCreated,
}: CustomerPickerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const openDialog = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCreateError(null);
    setDialogOpen(true);
  };

  const formValid =
    name.trim() !== "" && EMAIL_PATTERN.test(email) && phone.trim() !== "";

  const create = () => {
    setSaving(true);
    setCreateError(null);
    customersApi
      .createCustomer({ name: name.trim(), email: email.trim(), phone: phone.trim() })
      .then((customer) => {
        onCreated(customer);
        onChange(customer);
        setDialogOpen(false);
      })
      .catch(() =>
        setCreateError(
          "Couldn't create the customer, the email may already be in use",
        ),
      )
      .finally(() => setSaving(false));
  };

  return (
    <Stack spacing={1}>
      <Autocomplete
        options={customers}
        value={value}
        onChange={(_event, next) => onChange(next)}
        getOptionLabel={(customer) => `${customer.name} · ${customer.phone}`}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Customer"
            placeholder="Search by name or phone"
          />
        )}
      />
      <Button
        size="small"
        startIcon={<PersonAddAltIcon />}
        onClick={openDialog}
        sx={{ alignSelf: "flex-start" }}
      >
        New customer
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>New customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {createError && <Alert severity="error">{createError}</Alert>}
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={email !== "" && !EMAIL_PATTERN.test(email)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={create}
            disabled={!formValid || saving}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default CustomerPicker;
