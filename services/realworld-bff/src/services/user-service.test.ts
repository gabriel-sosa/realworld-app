import { beforeEach, describe, expect, test, vi } from "vitest";
import { DatabaseError, type Pool } from "pg";
import { hash, compare } from "bcrypt";

import { UserService } from "./user-service";
import type { Config } from "../schemas";

vi.mock("bcrypt");

const mockUser = {
  id: 1,
  email: "test@email.com",
  username: "test-username",
  bio: "",
  image: "",
  password: "password",
};

describe("UserService", () => {
  describe("createUser", () => {
    beforeEach(() => {
      vi.mocked<(data: string | Buffer, saltOrRounds: string | number) => Promise<string>>(
        hash,
      ).mockResolvedValue("HASHED_PASSWORD");
    });

    test("should insert user in db", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...mock } = mockUser;
      const queryFn = vi.fn().mockResolvedValue({
        rows: [mock],
      });
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const createUserPromise = new UserService(mockDb, config).createUser({
        username: "test-username",
        email: "test@email.com",
        password: "password",
      });

      await expect(createUserPromise).resolves.toMatchInlineSnapshot(`
        {
          "bio": "",
          "email": "test@email.com",
          "id": 1,
          "image": "",
          "username": "test-username",
        }
      `);
      expect(queryFn).toBeCalledWith(
        expect.objectContaining({
          values: expect.arrayContaining(["test-username", "test@email.com", "HASHED_PASSWORD"]),
        }),
      );
    });

    test("if no user returned should throw", async () => {
      const queryFn = vi.fn().mockResolvedValue({
        rows: [],
      });
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const createUserPromise = new UserService(mockDb, config).createUser({
        username: "test-username",
        email: "test@email.com",
        password: "password",
      });

      await expect(createUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"No user returned from database"',
      );
    });

    test("if username already exists should throw insert error", async () => {
      const dbError = new DatabaseError("test error", 1, "error");
      dbError.code = "23505";
      dbError.constraint = "users_username_key";

      const queryFn = vi.fn().mockRejectedValue(dbError);
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const createUserPromise = new UserService(mockDb, config).createUser({
        username: "test-username",
        email: "test@email.com",
        password: "password",
      });

      await expect(createUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"Insert Error: username test-username already in use"',
      );
    });

    test("if email already exists should throw insert error", async () => {
      const dbError = new DatabaseError("test error", 1, "error");
      dbError.code = "23505";
      dbError.constraint = "users_email_key";

      const queryFn = vi.fn().mockRejectedValue(dbError);
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const createUserPromise = new UserService(mockDb, config).createUser({
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
      });

      await expect(createUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"Insert Error: email test@email.com already in use"',
      );
    });
  });

  describe("authenticateUser", () => {
    beforeEach(() => {
      vi.mocked<(data: string | Buffer, encrypted: string) => Promise<boolean>>(
        compare,
      ).mockResolvedValue(true);
    });

    test("returns authenticated user", async () => {
      const queryFn = vi.fn().mockResolvedValue({
        rows: [mockUser],
      });
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const authenticateUserPromise = new UserService(mockDb, config).authenticateUser(
        mockUser.email,
        mockUser.password,
      );

      await expect(authenticateUserPromise).resolves.toMatchInlineSnapshot(`
        {
          "bio": "",
          "email": "test@email.com",
          "id": 1,
          "image": "",
          "password": "password",
          "username": "test-username",
        }
      `);
      expect(queryFn).toBeCalledWith(expect.objectContaining({ values: [mockUser.email] }));
    });

    test("if no user found throw error", async () => {
      const queryFn = vi.fn().mockResolvedValue({
        rows: [],
      });
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const authenticateUserPromise = new UserService(mockDb, config).authenticateUser(
        mockUser.email,
        mockUser.password,
      );

      await expect(authenticateUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"Authentication Error: no user with email test@email.com"',
      );
    });

    test("if passwords don't match throw error", async () => {
      vi.mocked<(data: string | Buffer, encrypted: string) => Promise<boolean>>(
        compare,
      ).mockResolvedValue(false);

      const queryFn = vi.fn().mockResolvedValue({
        rows: [mockUser],
      });
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const authenticateUserPromise = new UserService(mockDb, config).authenticateUser(
        mockUser.email,
        mockUser.password,
      );

      await expect(authenticateUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"Authentication Error: wrong password"',
      );
    });
  });

  describe("updateUserById", () => {
    beforeEach(() => {
      vi.mocked<(data: string | Buffer, saltOrRounds: string | number) => Promise<string>>(
        hash,
      ).mockResolvedValue("HASHED_PASSWORD");
    });

    test("should update and return user", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, id, ...mock } = mockUser;
      const queryFn = vi.fn().mockResolvedValue({
        rows: [mock],
      });
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const updateUserPromise = new UserService(mockDb, config).updateUserById(1, {
        email: mockUser.email,
        password: mockUser.password,
      });

      await expect(updateUserPromise).resolves.toMatchInlineSnapshot(`
        {
          "bio": "",
          "email": "test@email.com",
          "image": "",
          "username": "test-username",
        }
      `);
      expect(hash).toBeCalled();
      expect(queryFn).toBeCalledWith(
        expect.objectContaining({
          values: expect.arrayContaining([mockUser.email, "HASHED_PASSWORD"]),
        }),
      );
    });

    test("if no user returned should throw error", async () => {
      const queryFn = vi.fn().mockResolvedValue({
        rows: [],
      });
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const updateUserPromise = new UserService(mockDb, config).updateUserById(1, {
        email: mockUser.email,
        password: mockUser.password,
      });

      await expect(updateUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"no user returned"',
      );
    });

    test("if username already exists should throw insert error", async () => {
      const dbError = new DatabaseError("Test error", 1, "error");
      dbError.code = "23505";
      dbError.constraint = "users_username_key";

      const queryFn = vi.fn().mockRejectedValue(dbError);
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const updateUserPromise = new UserService(mockDb, config).updateUserById(1, {
        username: mockUser.username,
      });

      await expect(updateUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"Insert Error: username test-username already in use"',
      );
    });

    test("if email already exists should throw insert error", async () => {
      const dbError = new DatabaseError("Test error", 1, "error");
      dbError.code = "23505";
      dbError.constraint = "users_email_key";

      const queryFn = vi.fn().mockRejectedValue(dbError);
      const mockDb = { query: queryFn } as unknown as Pool;
      const config = {} as Config;

      const updateUserPromise = new UserService(mockDb, config).updateUserById(1, {
        email: mockUser.email,
        password: mockUser.password,
      });

      await expect(updateUserPromise).rejects.toThrowErrorMatchingInlineSnapshot(
        '"Insert Error: email test@email.com already in use"',
      );
    });
  });

  test("getUserById", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, ...mock } = mockUser;
    const queryFn = vi.fn().mockResolvedValue({ rows: [mock] });
    const mockDb = { query: queryFn } as unknown as Pool;
    const config = {} as Config;

    const user = await new UserService(mockDb, config).getUserById(1);

    expect(queryFn).toBeCalled();
    expect(user).toMatchInlineSnapshot(`
      {
        "bio": "",
        "email": "test@email.com",
        "image": "",
        "username": "test-username",
      }
    `);
  });
});
