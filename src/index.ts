import "dotenv/config";
import "reflect-metadata";
import http from "http";
import { logger } from "./utils/logger";
import createDatabaseConnection from "./database/connect";
import initializeApp from "./app";
import { io } from "./socket";
import { alarmJob } from "./services/admin/AdminController";

process.on("uncaughtException", e => {
  console.error(e);
  logger.error(`Closeing server : ${e.message}`);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.error(e);
  logger.error(`Closeing server : ${e}`);
  process.exit(1);
});

const main = async () => {
  await createDatabaseConnection();

  const app = initializeApp();

  const { PORT = 3000 } = process.env;

  const server = http.createServer(app);

  io.listen(server);

  server.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}`)
  );

  alarmJob.start();
};

main();
