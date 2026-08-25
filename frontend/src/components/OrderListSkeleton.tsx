import { Box, Skeleton } from "@mui/material";

function OrderListSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={150} />
      ))}
    </Box>
  );
}

export default OrderListSkeleton;
