import { describe, test, expect, vi } from "vitest";

import { createUserHandler } from "./create-user-handler";

const mockUser = {
  email: "test@email.com",
  username: "test-username",
  bio: "",
  image: "",
  id: 1,
} as const;

const testToken = "test-token";

describe.only("createUserHandler", () => {
  test("should create adn return user", async () => {
    const req = {
      context: {
        userService: { createUser: vi.fn().mockResolvedValue(mockUser) },
        tokenService: { generateToken: vi.fn().mockReturnValue(testToken) },
      },
      body: {
        user: {
          email: mockUser.email,
          password: "password",
          username: mockUser.username,
        },
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // @ts-expect-error mock call
    await createUserHandler(req, res);

    expect(req.context.userService.createUser).toBeCalled();
    expect(req.context.tokenService.generateToken).toBeCalled();
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      user: expect.objectContaining({
        email: mockUser.email,
        username: mockUser.username,
        token: testToken,
      }),
    });
  });
});
