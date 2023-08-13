import { DatabaseError, type Pool } from "pg";
import { hash, compare } from "bcrypt";
import type { components } from "@packages/realworld-bff-types";

import { InsertError, AuthenticationError } from "../errors";
import {
  insertUserQuery,
  selectUserByEmail,
  selectUserById,
  type InsertUserQueryReturn,
  type SelectUserByEmailReturn,
  type SelectUserByIdReturn,
} from "../queries";
import type { UserService as UserServiceType } from "../types";
import type { Config } from "../schemas";

export class UserService implements UserServiceType {
  constructor(
    private db: Pool,
    private config: Config,
  ) {}

  public async createUser(user: components["schemas"]["NewUser"]) {
    const hashedPassword = await hash(user.password, this.config.BCRYPT_SALT_ROUNDS);

    try {
      const {
        rows: [dbUser],
      } = await this.db.query<InsertUserQueryReturn>(
        insertUserQuery(user.email, user.username, hashedPassword),
      );

      if (!dbUser) throw Error("No user returned from database");

      return dbUser;
    } catch (err) {
      // handle unique constrains db errors
      if (err instanceof DatabaseError && err.code === "23505") {
        switch (err.constraint) {
          case "users_username_key":
            throw new InsertError(`username ${user.username} already in use`);
          case "users_email_key":
            throw new InsertError(`email ${user.email} already in use`);
        }
      }

      throw err;
    }
  }

  public async authenticateUser(email: string, password: string) {
    const {
      rows: [user],
    } = await this.db.query<SelectUserByEmailReturn>(selectUserByEmail(email));
    if (!user) throw new AuthenticationError("no user with email " + email);

    const passwordsMatch = await compare(password, user.password);
    if (!passwordsMatch) throw new AuthenticationError("wrong password");

    return user;
  }

  public async getUserById(id: number) {
    const {
      rows: [user],
    } = await this.db.query<SelectUserByIdReturn>(selectUserById(id));

    if (!user) throw Error("user not found");

    return user;
  }
}
