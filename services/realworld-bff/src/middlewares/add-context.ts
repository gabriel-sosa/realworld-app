import { Pool } from "pg";
import type { Request, Response, NextFunction } from "express";

import { UserService, TokenService } from "../services";
import type { Config } from "../schemas";
import type { Context } from "../types";

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

  const logger = console;

  return (req: Request, _: Response, next: NextFunction) => {
    const userService = new UserService(pgPool, config);
    const tokenService = new TokenService(config);
    const authHeader = req.header("Authorization");
    let auth: Context["auth"] = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const [, token] = authHeader.split(" ");
      try {
        if (!token) throw Error("No token");

        const payload = tokenService.verifyToken(token);
        auth = { ...payload, token };
      } catch (err) {
        logger.error(err);
      }
    }

    req.context = { config, userService, auth, tokenService, logger };
    next();
  };
};
