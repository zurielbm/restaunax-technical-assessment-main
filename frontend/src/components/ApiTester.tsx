import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { OrderStatus, OrderType } from "../../../shared/types";

const API_BASE_URL = "http://localhost:3000/api";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "delivered",
];
const ORDER_TYPES: OrderType[] = ["delivery", "pickup"];

interface ApiResult {
  label: string;
  status: number;
  statusText: string;
  ok: boolean;
  body: unknown;
}

function ApiTester() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState("");
  const [lookupOrderId, setLookupOrderId] = useState("ord_001");
  const [patchOrderId, setPatchOrderId] = useState("ord_001");
  const [patchStatus, setPatchStatus] = useState<OrderStatus>("preparing");

  const [newOrderCustomerId, setNewOrderCustomerId] = useState("cust_001");
  const [newOrderType, setNewOrderType] = useState<OrderType>("pickup");
  const [newOrderItems, setNewOrderItems] = useState(
    '[{ "name": "Margherita Pizza", "quantity": 2, "price": 15.99 }]'
  );

  const [lookupCustomerId, setLookupCustomerId] = useState("cust_001");
  const [customerName, setCustomerName] = useState("Test Person");
  const [customerEmail, setCustomerEmail] = useState("test.person@email.com");
  const [customerPhone, setCustomerPhone] = useState("+1-555-9999");

  const run = async (label: string, path: string, init?: RequestInit) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, init);
      const body = await response.json().catch(() => null);
      setResult({
        label,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        body,
      });
    } catch (error) {
      setResult({
        label,
        status: 0,
        statusText: "network error",
        ok: false,
        body: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const jsonInit = (method: string, body: unknown): RequestInit => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const handleCreateOrder = () => {
    let items: unknown;
    try {
      items = JSON.parse(newOrderItems);
    } catch {
      setResult({
        label: "POST /orders",
        status: 0,
        statusText: "client error",
        ok: false,
        body: "Items field is not valid JSON",
      });
      return;
    }
    run(
      "POST /orders",
      "/orders",
      jsonInit("POST", {
        customerId: newOrderCustomerId,
        orderType: newOrderType,
        items,
      })
    );
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Orders
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
          >
            <TextField
              select
              size="small"
              label="status filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">all</MenuItem>
              {ORDER_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                run(
                  "GET /orders",
                  filterStatus ? `/orders?status=${filterStatus}` : "/orders"
                )
              }
            >
              GET /orders
            </Button>
            <TextField
              size="small"
              label="order id"
              value={lookupOrderId}
              onChange={(e) => setLookupOrderId(e.target.value)}
              sx={{ width: 140 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                run(`GET /orders/${lookupOrderId}`, `/orders/${lookupOrderId}`)
              }
            >
              GET /orders/:id
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Update order status
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
          >
            <TextField
              size="small"
              label="order id"
              value={patchOrderId}
              onChange={(e) => setPatchOrderId(e.target.value)}
              sx={{ width: 140 }}
            />
            <TextField
              select
              size="small"
              label="new status"
              value={patchStatus}
              onChange={(e) => setPatchStatus(e.target.value as OrderStatus)}
              sx={{ minWidth: 140 }}
            >
              {ORDER_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                run(
                  `PATCH /orders/${patchOrderId}`,
                  `/orders/${patchOrderId}`,
                  jsonInit("PATCH", { status: patchStatus })
                )
              }
            >
              PATCH /orders/:id
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Create order
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
          >
            <TextField
              size="small"
              label="customer id"
              value={newOrderCustomerId}
              onChange={(e) => setNewOrderCustomerId(e.target.value)}
              sx={{ width: 300 }}
            />
            <TextField
              select
              size="small"
              label="order type"
              value={newOrderType}
              onChange={(e) => setNewOrderType(e.target.value as OrderType)}
              sx={{ minWidth: 120 }}
            >
              {ORDER_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="items (JSON)"
              value={newOrderItems}
              onChange={(e) => setNewOrderItems(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 320 }}
            />
            <Button variant="outlined" size="small" onClick={handleCreateOrder}>
              POST /orders
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Customers
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => run("GET /customer", "/customer")}
            >
              GET /customer
            </Button>
            <TextField
              size="small"
              label="customer id"
              value={lookupCustomerId}
              onChange={(e) => setLookupCustomerId(e.target.value)}
              sx={{ width: 300 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                run(
                  `GET /customer/${lookupCustomerId}`,
                  `/customer/${lookupCustomerId}`
                )
              }
            >
              GET /customer/:id
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
            sx={{ mt: 1 }}
          >
            <TextField
              size="small"
              label="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              sx={{ width: 160 }}
            />
            <TextField
              size="small"
              label="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              sx={{ width: 220 }}
            />
            <TextField
              size="small"
              label="phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              sx={{ width: 160 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                run(
                  "POST /customer",
                  "/customer",
                  jsonInit("POST", {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                  })
                )
              }
            >
              POST /customer
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Response</Typography>
            {loading && <CircularProgress size={16} />}
            {result && !loading && (
              <>
                <Chip
                  size="small"
                  color={result.ok ? "success" : "error"}
                  label={`${result.status || "—"} ${result.statusText}`}
                />
                <Typography variant="caption" color="text.secondary">
                  {result.label}
                </Typography>
              </>
            )}
          </Stack>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              maxHeight: 320,
              overflow: "auto",
              bgcolor: "grey.100",
              borderRadius: 1,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            {result
              ? typeof result.body === "string"
                ? result.body
                : JSON.stringify(result.body, null, 2)
              : "Run a request to see the response here."}
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

export default ApiTester;
