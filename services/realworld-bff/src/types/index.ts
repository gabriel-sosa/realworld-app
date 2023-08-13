import type { components } from "@packages/realworld-bff-types";

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
