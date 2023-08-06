import type { Request, Response, NextFunction } from "express";

import { UserService } from "../services";

export const addContext = (_: Request, res: Response, next: NextFunction) => {
  const context = {
    userService: new UserService(),
  };

  res.locals = context;
  next();
};

export const errorHandler = (
  err: unknown,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  res.send("bruh");
  next();
};
