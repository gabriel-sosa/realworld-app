import { describe, test, expect, vi } from "vitest";
import { ZodError } from "zod";

import { errorHandler } from "./error-handler";
import { AuthenticationError, InsertError } from "../errors";

const getMockRequest = () => ({
  context: { logger: { error: vi.fn() } },
});
const getMockResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});

describe("errorHandler", () => {
  test("if unexpected error return 500", () => {
    const req = getMockRequest();
    const res = getMockResponse();
    const nextFn = vi.fn();
    const err = Error("Test error");

    // @ts-expect-error test mocks
    errorHandler(err, req, res, nextFn);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({ errors: ["Unexpected internal error"] });
    expect(req.context.logger.error).toBeCalled();
  });

  test("if authentication error return 401", () => {
    const req = getMockRequest();
    const res = getMockResponse();
    const nextFn = vi.fn();
    const err = new AuthenticationError("Test error");

    // @ts-expect-error test mocks
    errorHandler(err, req, res, nextFn);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({});
  });

  test("if Insert Error error return 422", () => {
    const req = getMockRequest();
    const res = getMockResponse();
    const nextFn = vi.fn();
    const err = new InsertError("Test error");

    // @ts-expect-error test mocks
    errorHandler(err, req, res, nextFn);

    expect(res.status).toBeCalledWith(422);
    expect(res.json).toBeCalledWith({
      errors: ["Insert Error: Test error"],
    });
  });

  test("if Zod Error error return 422", () => {
    const req = getMockRequest();
    const res = getMockResponse();
    const nextFn = vi.fn();
    const err = new ZodError([{ message: "test error", code: "custom", path: [] }]);

    // @ts-expect-error test mocks
    errorHandler(err, req, res, nextFn);

    expect(res.status).toBeCalledWith(422);
    expect(res.json).toBeCalledWith({
      errors: ["test error"],
    });
  });
});
