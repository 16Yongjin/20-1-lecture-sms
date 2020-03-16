import express, { Express } from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import routes from "./services";
import errorHandlers from "./middleware/errorHandlers";
import monitor from "express-status-monitor";
import { io } from "./socket";

const initializeApp = (): Express => {
  const app = express();

  app.use(monitor({ websocket: io }));

  applyMiddleware(middleware, app);
  applyRoutes(routes, app);
  applyMiddleware(errorHandlers, app);

  return app;
};

export default initializeApp;
