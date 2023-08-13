import { type Response, type Request } from "express";
import { z } from "zod";

import type { operations } from "@packages/realworld-bff-types";

const LoginRequestSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const loginHandler = async (
  req: Request,
  res: Response<operations["Login"]["responses"][200]["content"]["application/json"]>,
) => {
  const { user } = LoginRequestSchema.parse(req.body);
  const { userService, authService } = req.context;

  const { id, email, username, bio, image } = await userService.authenticateUser(
    user.email,
    user.password,
  );
  const token = authService.generateToken({ id, username, email });
  res.status(200).json({ user: { email, username, bio, image, token } });
};
