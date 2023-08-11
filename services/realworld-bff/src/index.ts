import express from "express";
import { Client } from "pg";

import { userRouter } from "./routes";
import { errorHandler, addContext } from "./middlewares";
import { ConfigSchema } from "./schemas";

const config = ConfigSchema.parse(process.env);
const app = express();

app.get("/ping", (_, res) => {
  res.send("pong");
});

const pgClient = new Client({
  user: config.POSTGRES_USER,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
});

app
  .use(addContext(config, pgClient))
  .use(userRouter)
  .use(errorHandler)
  .listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
