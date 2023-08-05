import express from "express";

import { userRouter } from "./users";
import { UserService } from "../services";

const app = express();

app.get("/ping", (_, res) => {
  res.send("pong");
});

app.use((_, res, next) => {
  const context = {
    userService: new UserService(),
  };

  res.locals = context;
  next();
});

app.use(userRouter);

app.use([
  (err, _, res, next) => {
    console.log(err);
    res.send("bruh");
    next();
  },
]);

export { app };
