import express from "express";

import { userRouter } from "./users";
import { addContext, errorHandler } from "../middlewares";

const app = express();

app.get("/ping", (_, res) => {
  res.send("pong");
});

app.use(addContext);

app.use(userRouter);

app.use(errorHandler);

export { app };
