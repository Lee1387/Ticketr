import { z } from "zod";

const portSchema = z.preprocess(
  (value) => (value === undefined ? 3000 : value),
  z.coerce.number().int().min(1).max(65_535),
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_HOST: z.string().min(1).default("0.0.0.0"),
  API_PORT: portSchema,
  DATABASE_URL: z.url(),
});

export type ApiEnv = z.infer<typeof envSchema>;

export function parseEnv(input: NodeJS.ProcessEnv): ApiEnv {
  return envSchema.parse(input);
}
