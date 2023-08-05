import type { components } from "@packages/realworld-bff-types";

export type GetUser = {
  getUser: () => Promise<components["schemas"]["User"]>;
};

export class UserService implements GetUser {
  public async getUser() {
    return {
      email: "string",
      token: "string",
      username: "string",
      bio: "string",
      image: "string",
    };
  }
}
