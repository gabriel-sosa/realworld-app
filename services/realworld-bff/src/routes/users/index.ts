import express, { type Response, type Request } from "express";
import type { components } from "@packages/realworld-bff-types";

import type { GetUser } from "../../services";

const userRouter = express.Router();

const getUserHandler = async (
  _: Request,
  res: Response<components["schemas"]["User"], { userService: GetUser }>,
) => {
  const { userService } = res.locals;

  res.json(await userService.getUser());
};

const postUserLoginHandler = () => {
  throw Error("handler not yet implemented");
};

userRouter.get("/user", getUserHandler).post("/users/login", postUserLoginHandler);

export { userRouter };
