import { z } from "zod";

import {
  postgresConnectionStringSchema,
  redisConnectionStringSchema,
} from "../../shared/config/connectionStringSchemas.js";

const portSchema = z.preprocess(
  (value) => (value === undefined ? 3000 : value),
  z.coerce.number().int().min(1).max(65_535),
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  API_HOST: z.string().min(1).default("0.0.0.0"),
  API_PORT: portSchema,
  DATABASE_URL: postgresConnectionStringSchema,
  REDIS_URL: redisConnectionStringSchema,
  JWT_AUDIENCE: z.string().min(1).default("ticketr-api"),
  JWT_ISSUER: z.string().min(1).default("ticketr"),
  JWT_SECRET: z.string().min(32),
});

export type ApiEnv = z.infer<typeof envSchema>;

export function parseEnv(input: NodeJS.ProcessEnv): ApiEnv {
  return envSchema.parse(input);
}
