import type { Response as ExpressResponse, Request } from "express";
import type { components, paths } from "@packages/realworld-bff-types";

import type { Config, Auth } from "../schemas";
import type {
  InsertUserQueryReturn,
  SelectUserByEmailReturn,
  SelectUserByIdReturn,
  UpdateUserByIdReturn,
} from "../queries";

export type UserService = {
  createUser(user: components["schemas"]["NewUser"]): Promise<InsertUserQueryReturn>;
  authenticateUser(email: string, password: string): Promise<SelectUserByEmailReturn>;
  getUserById(id: number): Promise<SelectUserByIdReturn>;
  updateUserById(
    id: number,
    user: components["schemas"]["UpdateUser"],
  ): Promise<UpdateUserByIdReturn>;
};

export type TokenService = {
  verifyToken(token: string): Auth;
  generateToken(payload: Auth): string;
};

export type Context = {
  config: Config;
  auth: null | (Auth & { token: string });
  userService: UserService;
  tokenService: TokenService;
};

type ExtractResponse<T extends Record<string, unknown>> = T extends { "application/json": unknown }
  ? T["application/json"]
  : T;

type Response<T extends keyof paths, U extends keyof paths[T]> = ExpressResponse<
  paths[T][U] extends { responses: Record<number, infer V> }
    ? V extends { content: Record<string, unknown> }
      ? ExtractResponse<V["content"]> extends Record<string, never>
        ? Record<string, never>
        : ExtractResponse<V["content"]>
      : never
    : never
>;

export type RouteHandler<T extends keyof paths, U extends keyof paths[T]> = (
  req: Request,
  res: Response<T, U>,
) => void;
