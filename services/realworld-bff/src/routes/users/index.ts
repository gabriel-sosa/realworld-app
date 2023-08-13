import express from "express";

import { createUserHandler } from "./create-user-handler";
import { loginHandler } from "./login-handler";
import { getCurrentUserHandler } from "./get-current-user-handler";

const userRouter = express.Router();

userRouter
  .get("/user", getCurrentUserHandler)
  .post("/users", createUserHandler)
  .post("/users/login", loginHandler);

export { userRouter };
