import { useState } from "react";
import { Alert, Container, Snackbar, Stack, Typography } from "@mui/material";
import { MenuItem } from "../../../shared/types";
import MenuGrid from "../components/MenuGrid";

function CashierView() {
  const [lastAdded, setLastAdded] = useState<MenuItem | null>(null);

  return (
    <Container maxWidth="lg">
      <Stack spacing={2} my={4}>
        <Typography variant="h4" component="h1">
          Cashier
        </Typography>
        <MenuGrid onAdd={setLastAdded} />
      </Stack>

      {lastAdded && (
        <Snackbar
          open
          autoHideDuration={2000}
          onClose={() => setLastAdded(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setLastAdded(null)}>
            {lastAdded.name} added, cart test working
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default CashierView;
