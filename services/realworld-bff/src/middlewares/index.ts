import { Pool } from "pg";
import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

import { UserService } from "../services";
import { InsertError } from "../errors";
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
    const authHeader = req.header("Authorization");
    let jwtPayload: JwtPayload | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const [, token] = authHeader.split(" ");
      try {
        jwtPayload = userService.verifyJwtToken(token ?? "");
      } catch (err) {
        console.error(err);
      }
    }

    req.context = { config, userService, jwtPayload };
    next();
  };
};

const zodErrorToStringArray = (err: ZodError): string[] => {
  const { formErrors, fieldErrors } = err.flatten();

  const formattedFieldErrors = Object.entries(fieldErrors).flatMap(
    ([key, value]) => value?.map((val) => `validation error in ${key}: ${val}`) ?? [],
  );

  return [...formErrors, ...formattedFieldErrors];
};

// Even if we don't need the next function inside the error handler, express needs the function to have 4 arguments to know is an error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = async (err: unknown, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(422).json({ errors: zodErrorToStringArray(err) });
    return;
  }

  if (err instanceof InsertError) {
    res.status(422).json({ errors: [err.message] });
    return;
  }

  console.error(err);
  res.status(500).json({ errors: ["Unexpected internal error"] });
};
