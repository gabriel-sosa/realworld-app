import { DatabaseError, type Pool } from "pg";
import { hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import type { components } from "@packages/realworld-bff-types";

import { InsertError } from "../errors";
import { JwtPayloadSchema, JwtPayload } from "../schemas";
import type { UserService as UserServiceType } from "../types";
import type { Config } from "../schemas";

type DbUser = {
  id: number;
  email: string;
  username: string;
  bio: string;
  image: string;
};

const insertUserQuery = (email: string, username: string, password: string) => ({
  name: "insert-new-user",
  text: "INSERT INTO users(email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username, bio, image;",
  values: [email, username, password],
});

export class UserService implements UserServiceType {
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

  public async createUser(user: components["schemas"]["NewUser"]) {
    const hashedPassword = await hash(user.password, this.config.BCRYPT_SALT_ROUNDS);

    try {
      const {
        rows: [dbUser],
      } = await this.db.query<DbUser>(insertUserQuery(user.email, user.username, hashedPassword));

      if (!dbUser) throw Error("No user returned from database");

      return {
        email: dbUser.email,
        username: dbUser.username,
        bio: dbUser.bio,
        image: dbUser.image,
        token: this.generateJwtToken(dbUser),
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

  public verifyJwtToken(token: string) {
    const payload = verify(token, this.config.JWT_SECRET);

    return JwtPayloadSchema.parse(payload);
  }

  private generateJwtToken({ id, email, username }: JwtPayload) {
    return sign({ id, email, username }, this.config.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
  }
}
