import { describe, expect, test, vi } from "vitest";
import { Pool } from "pg";
import type { Request, Response } from "express";

import { addContext } from "./add-context";
import { UserService, TokenService } from "../services";
import type { Config } from "../schemas";

vi.mock("pg", () => ({ Pool: vi.fn().mockReturnValue({}) }));
vi.mock("../services");

describe("addContext", () => {
  test("should add context object in request", () => {
    const verifyTokenFn = vi.fn().mockReturnValue({
      id: 1,
      email: "test@email.com",
      username: "test-username",
    });
    vi.mocked(TokenService).mockReturnValue({
      verifyToken: verifyTokenFn,
    } as unknown as TokenService);

    const reqHeaderFn = vi.fn().mockReturnValue("Bearer test-token") as Request["header"];
    const req = { header: reqHeaderFn } as Request;
    const res = {} as Response;
    const nextFn = vi.fn();
    const config = {} as Config;

    const middleware = addContext(config);
    middleware(req, res, nextFn);

    expect(nextFn).toBeCalled();
    expect(Pool).toBeCalled();
    expect(UserService).toBeCalled();
    expect(TokenService).toBeCalled();

    expect(req.context).toEqual({
      config: expect.anything(),
      userService: expect.anything(),
      tokenService: expect.anything(),
      logger: expect.anything(),
      auth: {
        id: 1,
        email: "test@email.com",
        username: "test-username",
        token: "test-token",
      },
    });
  });

  test.each([undefined, "Bearer "])("if no auth header, auth should be null", (authHeader) => {
    const reqHeaderFn = vi.fn().mockReturnValue(authHeader) as Request["header"];
    const req = { header: reqHeaderFn } as Request;
    const res = {} as Response;
    const nextFn = vi.fn();
    const config = {} as Config;

    const middleware = addContext(config);
    middleware(req, res, nextFn);

    expect(req.context).toEqual(
      expect.objectContaining({
        auth: null,
      }),
    );
  });
});
