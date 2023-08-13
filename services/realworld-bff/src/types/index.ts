import type { components } from "@packages/realworld-bff-types";

import type { Config, JwtPayload } from "../schemas";
import type { InsertUserQueryReturn, SelectUserByEmailReturn } from "../queries";

export type UserService = {
  getUser(): Promise<components["schemas"]["User"]>;
  createUser(user: components["schemas"]["NewUser"]): Promise<InsertUserQueryReturn>;
  authenticateUser(email: string, password: string): Promise<SelectUserByEmailReturn>;
};

export type TokenService = {
  verifyToken(token: string): JwtPayload;
  generateToken(payload: JwtPayload): string;
};

export type Context = {
  config: Config;
  jwtPayload: JwtPayload | null;
  userService: UserService;
  authService: TokenService;
};
