import { DatabaseError, type Pool } from "pg";
import { hash } from "bcrypt";
import type { components } from "@packages/realworld-bff-types";

import { InsertError } from "../errors";
import type * as types from "../types";
import type { Config } from "../schemas";

type DbUser = {
  id: number;
  email: string;
  username: string;
};

const insertUserQuery = (email: string, username: string, password: string) => ({
  name: "insert-new-user",
  text: "INSERT INTO users(email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username;",
  values: [email, username, password],
});

export class UserService implements types.UserService {
  constructor(
    private db: Pool,
    private config: Config,
  ) {}

  public async getUser() {
    const res = await this.db.query("SELECT * FROM users;");
    console.log(res);

    return {
      email: "string",
      token: "string",
      username: "string",
      bio: "string",
      image: "string",
    };
  }

  public async createUser(
    user: components["schemas"]["NewUser"],
  ): Promise<components["schemas"]["User"]> {
    const hashedPassword = await hash(user.password, this.config.BCRYPT_SALT_ROUNDS);

    try {
      const {
        rows: [dbUser],
      } = await this.db.query<DbUser>(insertUserQuery(user.email, user.username, hashedPassword));

      if (!dbUser) throw Error("No user returned from database");

      return {
        email: user.email,
        token: "string",
        username: user.username,
        bio: "",
        image: "",
      };
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
}
