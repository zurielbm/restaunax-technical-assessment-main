import { AppBar, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Route, RoutePath, useHashRoute } from "./router/useHashRoute";
import CashierView from "./views/CashierView";
import CustomerView from "./views/CustomerView";
import KitchenView from "./views/KitchenView";

function activeTab(route: Route): Exclude<RoutePath, `track/${string}`> {
  return route.view === "track" ? "order" : route.view;
}

function ActiveView({ route }: { route: Route }) {
  switch (route.view) {
    case "kitchen":
      return <KitchenView />;
    case "cashier":
      return <CashierView />;
    case "order":
      return <CustomerView />;
    case "track":
      return <CustomerView trackedOrderId={route.orderId} />;
  }
}

function App() {
  const { route, navigate } = useHashRoute();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ flexWrap: "wrap", columnGap: 2 }}>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Restaunax
          </Typography>
          <Tabs
            value={activeTab(route)}
            onChange={(_event, value: RoutePath) => navigate(value)}
            textColor="inherit"
            aria-label="Switch view"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              width: { xs: "100%", sm: "auto" },
              "& .MuiTabs-indicator": { backgroundColor: "common.white" },
            }}
          >
            <Tab
              value="kitchen"
              label="Kitchen"
              icon={<RestaurantMenuIcon />}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab
              value="cashier"
              label="Cashier"
              icon={<PointOfSaleIcon />}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab
              value="order"
              label="Order Online"
              icon={<ShoppingBagIcon />}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          </Tabs>
        </Toolbar>
      </AppBar>
      <ActiveView route={route} />
    </>
  );
}

export default App;
