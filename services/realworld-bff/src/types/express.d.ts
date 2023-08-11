import type { Context } from "./index";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface Request {
      context: Context;
    }
  }
}
