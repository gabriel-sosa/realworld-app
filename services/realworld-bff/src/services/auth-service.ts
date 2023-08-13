import { sign, verify } from "jsonwebtoken";

import { JwtPayloadSchema, type JwtPayload, type Config } from "../schemas";
import type { AuthService as AuthServiceType } from "../types";

export class AuthService implements AuthServiceType {
  constructor(private config: Config) {}

  public verifyToken(token: string) {
    const payload = verify(token, this.config.JWT_SECRET);

    return JwtPayloadSchema.parse(payload);
  }

  public generateToken({ id, email, username }: JwtPayload) {
    return sign({ id, email, username }, this.config.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
  }
}
