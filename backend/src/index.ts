import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../shared/types';
import ordersRouter from './routes/orders';
import customerRouter from './routes/customer';
import { registerOrderSocketHandlers } from './realtime/orders';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
  },
});

// Middleware
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter(io));
app.use('/api/customer', customerRouter);

registerOrderSocketHandlers(io);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Restaunax API is running' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 Orders API available at http://localhost:${PORT}/api/orders`);
  console.log(`🔌 Socket.IO accepts connections from ${CLIENT_ORIGIN}`);
});
