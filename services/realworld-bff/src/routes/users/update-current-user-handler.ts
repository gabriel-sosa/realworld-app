import { z } from "zod";

import { AuthenticationError } from "../../errors";
import type { RouteHandler } from "../../types";

const UpdateCurrentUserRequestSchema = z.object({
  user: z
    .object({
      email: z.string().email().max(256),
      password: z.string().max(246),
      username: z.string().max(36),
      bio: z.string().max(3500),
      image: z.string().max(256),
    })
    .partial()
    .refine((val) => Object.values(val).filter(Boolean).length >= 1, {
      message: "at least 1 field must be provided",
    }),
});

export const updateCurrentUserHandler: RouteHandler<"/user", "put"> = async (req, res) => {
  const { auth, userService } = req.context;
  if (!auth) throw new AuthenticationError("not authenticated");

  const { user: reqUser } = UpdateCurrentUserRequestSchema.parse(req.body);
  const { email, username, bio, image } = await userService.updateUserById(auth.id, reqUser);

  res.status(200).json({ user: { email, username, bio, image, token: auth.token } });
};
