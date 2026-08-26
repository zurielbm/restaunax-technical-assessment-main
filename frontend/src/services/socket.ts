import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/types";
import { API_ORIGIN } from "./api";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(API_ORIGIN);
