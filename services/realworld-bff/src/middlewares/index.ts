import { Pool } from "pg";
import type { Request, Response, NextFunction } from "express";

import { UserService } from "../services";
import type { Config } from "../schemas";

export const addContext = (config: Config) => {
  const pgPool = new Pool({
    user: config.POSTGRES_USER,
    host: config.POSTGRES_HOST,
    database: config.POSTGRES_DB,
    password: config.POSTGRES_PASSWORD,
    port: config.POSTGRES_PORT,
    query_timeout: 30000,
    connectionTimeoutMillis: 10000,
  });

  return (req: Request, _: Response, next: NextFunction) => {
    const userService = new UserService(pgPool);

    req.context = { config, userService };
    next();
  };
};

export const errorHandler = (err: unknown, _: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.send("bruh");
  next();
};
