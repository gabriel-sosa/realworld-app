import type { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const { logger } = req.context;

  res.once("finish", () => {
    if (res.statusCode < 400) {
      logger.info(req.method, req.url, res.statusCode, res);
      logger.info(res);
      return;
    }

    logger.error(req.method, req.url, res.statusCode);
  });

  next();
};
