import type { components } from "@packages/realworld-bff-types";

export type UserService = {
  getUser(): Promise<components["schemas"]["User"]>;
};

export type Context = {
  userService: UserService;
};
