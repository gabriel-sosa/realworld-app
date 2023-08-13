import { Pool } from "pg";
import type { Request, Response, NextFunction } from "express";

import { UserService, TokenService } from "../services";
import type { Config, JwtPayload } from "../schemas";

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
    const userService = new UserService(pgPool, config);
    const authService = new TokenService(config);
    const authHeader = req.header("Authorization");
    let jwtPayload: JwtPayload | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const [, token] = authHeader.split(" ");
      try {
        if (!token) throw Error("No token");

        jwtPayload = authService.verifyToken(token);
      } catch (err) {
        console.error(err);
      }
    }

    req.context = { config, userService, jwtPayload, authService };
    next();
  };
};
