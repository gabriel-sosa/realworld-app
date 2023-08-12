import express from "express";

import { userRouter } from "./routes";
import { errorHandler, addContext } from "./middlewares";
import { ConfigSchema } from "./schemas";

const config = ConfigSchema.parse(process.env);
const app = express();

app.get("/ping", (_, res) => {
  res.send("pong");
});

app
  .use(addContext(config))
  .use(userRouter)
  .use(errorHandler)
  .listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
