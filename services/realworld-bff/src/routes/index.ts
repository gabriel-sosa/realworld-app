import express from "express";
import { Client } from "pg";
import { z } from "zod";

import { userRouter } from "./users";
import { errorHandler } from "../middlewares";
import { UserService } from "../services";

const app = express();

app.get("/ping", (_, res) => {
  res.send("pong");
});

const Config = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.string().transform((val) => parseInt(val)),
});

const config = Config.parse(process.env);

const pgClient = new Client({
  user: config.POSTGRES_USER,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
});

app.use((req, _, next) => {
  const userService = new UserService(pgClient);

  req.context = { userService };
  next();
});

app.use(userRouter);

app.use(errorHandler);

export { app };
