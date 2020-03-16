import { createConnection, Connection } from "typeorm";

import * as entities from "../entities";

const createTestDatabaseConnection = (): Promise<Connection> =>
  createConnection({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_TEST_DATABASE,
    entities: Object.values(entities),
    synchronize: true
  });

export default createTestDatabaseConnection;
