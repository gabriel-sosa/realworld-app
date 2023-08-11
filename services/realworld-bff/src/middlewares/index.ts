import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: unknown, _: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.send("bruh");
  next();
};
