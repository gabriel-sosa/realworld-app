import { sign, verify } from "jsonwebtoken";

import { AuthSchema, type Auth, type Config } from "../schemas";
import type { TokenService as TokenServiceType } from "../types";

export class TokenService implements TokenServiceType {
  constructor(private config: Config) {}

  public verifyToken(token: string) {
    const payload = verify(token, this.config.JWT_SECRET);

    return AuthSchema.parse(payload);
  }

  public generateToken({ id, email, username }: Auth) {
    return sign({ id, email, username }, this.config.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
  }
}
