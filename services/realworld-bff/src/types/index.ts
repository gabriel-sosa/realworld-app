import type { components } from "@packages/realworld-bff-types";

import type { Config, JwtPayload } from "../schemas";

export type UserService = {
  getUser(): Promise<components["schemas"]["User"]>;
  createUser(user: components["schemas"]["NewUser"]): Promise<components["schemas"]["User"]>;
};

export type Context = {
  config: Config;
  jwtPayload: JwtPayload | null;
  userService: UserService;
};
