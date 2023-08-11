import express, { type Response, type Request } from "express";

const userRouter = express.Router();

const getUserHandler = async (req: Request, res: Response) => {
  const { userService } = req.context;
  res.json(await userService.getUser());
};

const postUserLoginHandler = () => () => {
  throw Error("handler not yet implemented");
};

userRouter.get("/user", getUserHandler).post("/users/login", postUserLoginHandler);

export { userRouter };
