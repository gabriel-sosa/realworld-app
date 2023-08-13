import express, { type Response, type Request } from "express";

import { createUserHandler } from "./create-user-handler";
import { loginHandler } from "./login-handler";

const userRouter = express.Router();

const getUserHandler = async (req: Request, res: Response) => {
  const { userService } = req.context;
  res.json(await userService.getUser());
};

userRouter
  .get("/user", getUserHandler)
  .post("/users", createUserHandler)
  .post("/users/login", loginHandler);

export { userRouter };
