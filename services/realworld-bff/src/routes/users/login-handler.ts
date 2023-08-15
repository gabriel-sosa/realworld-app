import { z } from "zod";

import type { RouteHandler } from "../../types";

const LoginRequestSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const loginHandler: RouteHandler<"/users/login", "post"> = async (req, res) => {
  const { user } = LoginRequestSchema.parse(req.body);
  const { userService, tokenService } = req.context;

  const { id, email, username, bio, image } = await userService.authenticateUser(
    user.email,
    user.password,
  );
  const token = tokenService.generateToken({ id, username, email });
  res.status(200).json({ user: { email, username, bio, image, token } });
};
