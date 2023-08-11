import type { Client } from "pg";
import * as types from "../types";

export class UserService implements types.UserService {
  constructor(private db: Client) {}

  public async getUser() {
    await this.db.connect();
    const res = await this.db.query("SELECT * FROM users;");
    console.log(res);
    await this.db.end();
    return {
      email: "string",
      token: "string",
      username: "string",
      bio: "string",
      image: "string",
    };
  }
}
