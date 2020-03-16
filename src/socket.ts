import socketIO, { Server } from "socket.io";
import { handleSocketIO } from "./middleware/socket";

export const io = socketIO();

handleSocketIO(io);
