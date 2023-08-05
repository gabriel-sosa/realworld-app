import express, { type Response, type Request } from "express";
import type { components } from "@packages/realworld-bff-types";

import type { UserService } from "../../services";

const userRouter = express.Router();

const getUserHandler = (
  _: Request,
  res: Response<components["schemas"]["User"], { userService: UserService }>
) => {
  const { userService } = res.locals;

  res.json(userService.getUser());
};

const postUserLoginHandler = () => {
  throw Error("handler not yet implemented");
};

userRouter
  .get("/user", getUserHandler)
  .post("/users/login", postUserLoginHandler);

export { userRouter };
