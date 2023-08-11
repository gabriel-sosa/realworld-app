import type { components } from "@packages/realworld-bff-types";

import type { Config } from "../schemas";

export type UserService = {
  getUser(): Promise<components["schemas"]["User"]>;
};

export type Context = {
  config: Config;
  userService: UserService;
};
