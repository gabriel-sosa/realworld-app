import type { Request, Response } from "express";
import type { operations } from "@packages/realworld-bff-types";

import { AuthenticationError } from "../../errors";

export const getCurrentUserHandler = async (
  req: Request,
  res: Response<operations["GetCurrentUser"]["responses"]["200"]["content"]["application/json"]>,
) => {
  const { auth, userService } = req.context;
  if (!auth) throw new AuthenticationError("not authenticated");

  const { email, username, bio, image } = await userService.getUserById(auth.id);

  res.status(200).json({ user: { email, username, bio, image, token: auth.token } });
};
