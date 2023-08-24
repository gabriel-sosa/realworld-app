import { describe, test, expect, vi } from "vitest";

import { loginHandler } from "./login-handler";

const mockCredentials = { email: "test@email.com", password: "password" } as const;
const mockUser = {
  id: 1,
  email: mockCredentials.email,
  username: "test-username",
  bio: "",
  image: "",
};
const testToken = "test-token";

describe("loginHandler", () => {
  test("should return user", async () => {
    const req = {
      body: { user: mockCredentials },
      context: {
        userService: { authenticateUser: vi.fn().mockResolvedValue(mockUser) },
        tokenService: { generateToken: vi.fn().mockReturnValue(testToken) },
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // @ts-expect-error test call
    await loginHandler(req, res);

    expect(req.context.userService.authenticateUser).toBeCalled();
    expect(req.context.tokenService.generateToken).toBeCalled();
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      user: expect.objectContaining({
        email: mockUser.email,
        username: mockUser.username,
        token: testToken,
      }),
    });
  });
});
