import { describe, test, expect, vi } from "vitest";
import { sign, verify } from "jsonwebtoken";

import { TokenService } from "./token-service";
import type { Config } from "../schemas";

vi.mock("jsonwebtoken", () => ({ verify: vi.fn(), sign: vi.fn() }));

const mockJwtPayload = {
  id: 1,
  email: "test@email.com",
  username: "test-username",
};

describe("token-service", () => {
  test("verifyToken should verify token", () => {
    vi.mocked<(token: string, secretOrPublicKey: string) => unknown>(verify).mockReturnValue(
      mockJwtPayload,
    );

    const config = {} as Config;
    const payload = new TokenService(config).verifyToken("test-token");

    expect(payload).toMatchInlineSnapshot(`
      {
        "email": "test@email.com",
        "id": 1,
        "username": "test-username",
      }
    `);
  });

  test("generateToken should return token", () => {
    vi.mocked<(payload: typeof mockJwtPayload, secret: string) => string>(sign).mockReturnValue(
      "test-token",
    );

    const config = {} as Config;
    const token = new TokenService(config).generateToken(mockJwtPayload);

    expect(token).toBe("test-token");
  });
});
