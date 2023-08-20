import { describe, expect, test, vi } from "vitest";
import type { Pool } from "pg";

import { UserService } from "./user-service";
import type { Config } from "../schemas";

const mockUser = {
  id: 1,
  email: "string",
  username: "string",
  bio: "string",
  image: "string",
  password: "string",
};

describe("user-service", () => {
  test("getUserById", async () => {
    const queryFn = vi.fn().mockResolvedValue({ rows: [mockUser] });
    const mockDb = { query: queryFn } as unknown as Pool;
    const config = {} as Config;

    const user = await new UserService(mockDb, config).getUserById(1);

    expect(queryFn).toBeCalled();
    expect(user).toMatchInlineSnapshot(`
      {
        "bio": "string",
        "email": "string",
        "id": 1,
        "image": "string",
        "password": "string",
        "username": "string",
      }
    `);
  });
});
