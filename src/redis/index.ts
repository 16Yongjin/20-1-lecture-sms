import redis from "redis";
import { promisify } from "util";

export const client = redis.createClient();

export const getAsync = promisify(client.get).bind(client);

export const setAsync = promisify(client.set).bind(client);

export const SETEX = promisify(client.SETEX).bind(client);

client.on("error", function(error) {
  console.error(error);
});
