import type { components } from "@packages/realworld-bff-types";

import type { Config, JwtPayload } from "../schemas";
import type { InsertUserQueryReturn } from "../queries";

export type UserService = {
  getUser(): Promise<components["schemas"]["User"]>;
  createUser(user: components["schemas"]["NewUser"]): Promise<InsertUserQueryReturn>;
};

export type AuthService = {
  verifyToken(token: string): JwtPayload;
  generateToken(payload: JwtPayload): string;
};

export type Context = {
  config: Config;
  jwtPayload: JwtPayload | null;
  userService: UserService;
  authService: AuthService;
};
