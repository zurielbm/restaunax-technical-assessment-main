import { Grid, Skeleton } from "@mui/material";

function OrderListSkeleton() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 6 }, (_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Skeleton variant="rounded" height={140} />
        </Grid>
      ))}
    </Grid>
  );
}

export default OrderListSkeleton;
