import { describe, test, expect, vi } from "vitest";

import { requestLogger } from "./request-logger";

describe.only("requestLogger", () => {
  test("should log good status codes as as info", () => {
    const req = { context: { logger: { info: vi.fn(), error: vi.fn() } } };

    const res = {
      statusCode: 200,
      once: (_: string, cb: () => void) => cb(),
    };
    const nextFn = vi.fn();

    // @ts-expect-error test call
    requestLogger(req, res, nextFn);

    expect(nextFn).toBeCalled();
    expect(req.context.logger.info).toBeCalled();
  });

  test("should log bad status codes as errors", () => {
    const req = { context: { logger: { info: vi.fn(), error: vi.fn() } } };

    const res = {
      statusCode: 500,
      once: (_: string, cb: () => void) => cb(),
    };
    const nextFn = vi.fn();

    // @ts-expect-error test call
    requestLogger(req, res, nextFn);

    expect(nextFn).toBeCalled();
    expect(req.context.logger.error).toBeCalled();
  });
});
