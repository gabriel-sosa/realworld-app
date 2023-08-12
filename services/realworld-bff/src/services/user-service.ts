import type { Pool } from "pg";
import * as types from "../types";

export class UserService implements types.UserService {
  constructor(private db: Pool) {}

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
}
