import { type Response, type Request } from "express";
import { z } from "zod";

import type { operations } from "@packages/realworld-bff-types";

const CreateUserRequestSchema = z.object({
  user: z.object({
    email: z.string().email().max(256),
    password: z.string().min(4).max(256),
    username: z.string().min(4).max(36),
  }),
});

export const createUserHandler = async (
  req: Request,
  res: Response<operations["CreateUser"]["responses"][201]["content"]["application/json"]>,
) => {
  const validatedBody = CreateUserRequestSchema.parse(req.body);

  const { userService, tokenService } = req.context;
  const { email, username, bio, image, id } = await userService.createUser(validatedBody.user);
  const token = tokenService.generateToken({ id, email, username });

  res.status(201).json({ user: { email, username, bio, image, token } });
};
