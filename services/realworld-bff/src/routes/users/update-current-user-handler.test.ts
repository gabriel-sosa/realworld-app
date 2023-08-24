import { describe, test, expect, vi } from "vitest";

import { updateCurrentUserHandler } from "./update-current-user-handler";

const mockUser = {
  email: "test@email.com",
  username: "test-username",
  bio: "",
  image: "",
} as const;
const testToken = "test-token";

describe("updateCurrentUserHandler", () => {
  test("if not auth should throw", async () => {
    const req = { context: { auth: null } };

    // @ts-expect-error test call
    await expect(updateCurrentUserHandler(req, {})).rejects.toThrowErrorMatchingInlineSnapshot(
      '"Authentication Error: not authenticated"',
    );
  });

  test("if empty user in request body should throw", async () => {
    const req = {
      context: { auth: { id: 1 } },
      body: { user: {} },
    };

    // @ts-expect-error test call
    await expect(updateCurrentUserHandler(req, {})).rejects.toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"code\\": \\"custom\\",
          \\"message\\": \\"at least 1 field must be provided\\",
          \\"path\\": [
            \\"user\\"
          ]
        }
      ]"
    `);
  });

  test("should update and return user", async () => {
    const req = {
      context: {
        auth: { id: 1, token: testToken },
        userService: { updateUserById: vi.fn().mockResolvedValue(mockUser) },
      },
      body: { user: { email: "test@email.com" } },
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };

    // @ts-expect-error test call
    await updateCurrentUserHandler(req, res);

    expect(req.context.userService.updateUserById).toBeCalled();
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
