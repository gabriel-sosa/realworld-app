import { describe, test, expect, vi } from "vitest";

import { getCurrentUserHandler } from "./get-current-user-handler";

const mockUser = {
  email: "test@email.com",
  username: "test-username",
  bio: "",
  image: "",
} as const;
const testToken = "test-token";

describe.only("getCurrentUserHandler", () => {
  test("if not auth should throw", async () => {
    const req = {
      context: { auth: null },
    };

    // @ts-expect-error test call
    await expect(getCurrentUserHandler(req, {})).rejects.toThrowErrorMatchingInlineSnapshot(
      '"Authentication Error: not authenticated"',
    );
  });

  test("should return authenticated user", async () => {
    const req = {
      context: {
        auth: { id: 1, token: testToken },
        userService: { getUserById: vi.fn().mockResolvedValue(mockUser) },
      },
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };

    // @ts-expect-error test call
    await getCurrentUserHandler(req, res);

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
