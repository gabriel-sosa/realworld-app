import { z } from "zod";

export const ConfigSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.string().transform((val) => parseInt(val)),
  BCRYPT_SALT_ROUNDS: z.string().transform((val) => parseInt(val)),
  JWT_SECRET: z.string(),
});

export type Config = z.infer<typeof ConfigSchema>;

export const AuthSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
});

export type Auth = z.infer<typeof AuthSchema>;
