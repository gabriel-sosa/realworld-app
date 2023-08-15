import { AuthenticationError } from "../../errors";
import type { RouteHandler } from "../../types";

export const getCurrentUserHandler: RouteHandler<"/user", "get"> = async (req, res) => {
  const { auth, userService } = req.context;
  if (!auth) throw new AuthenticationError("not authenticated");

  const { email, username, bio, image } = await userService.getUserById(auth.id);

  res.status(200).json({ user: { email, username, bio, image, token: auth.token } });
};
