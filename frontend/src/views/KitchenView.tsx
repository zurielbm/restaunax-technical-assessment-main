import { Box, Container, Typography } from "@mui/material";

function KitchenView() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Kitchen
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The order queue dashboard will live here: orders sorted
          first-come-first-serve with wait-time alerts and one-tap status
          updates.
        </Typography>
      </Box>
    </Container>
  );
}

export default KitchenView;
