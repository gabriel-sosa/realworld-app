import type { Request, Response, NextFunction } from "express";
import type { Client } from "pg";

import { UserService } from "../services";
import type { Config } from "../schemas";

export const addContext =
  (config: Config, pgCLient: Client) => (req: Request, _: Response, next: NextFunction) => {
    const userService = new UserService(pgCLient);

    req.context = { config, userService };
    next();
  };

export const errorHandler = (err: unknown, _: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.send("bruh");
  next();
};
