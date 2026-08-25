import { Box, Container, Typography } from "@mui/material";

interface CustomerViewProps {
  trackedOrderId?: string;
}

function CustomerView({ trackedOrderId }: CustomerViewProps) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Online
        </Typography>
        {trackedOrderId ? (
          <Typography variant="body1" color="text.secondary">
            Live tracking for order {trackedOrderId}
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            order
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default CustomerView;
