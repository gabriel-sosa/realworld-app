import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

import { InsertError } from "../errors";

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
