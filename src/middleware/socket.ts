import { Server } from "socket.io";
import { logStream } from "./../services/admin/AdminController";

export const handleSocketIO = (server: Server) => {
  logStream(server);
};
