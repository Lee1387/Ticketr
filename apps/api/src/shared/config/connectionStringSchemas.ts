import { z } from "zod";

export const postgresConnectionStringSchema = z.url().refine(
  (value) => {
    const protocol = new URL(value).protocol;

    return protocol === "postgres:" || protocol === "postgresql:";
  },
  { message: "Postgres connection string must use postgres:// or postgresql://." },
);

export const redisConnectionStringSchema = z.url().refine(
  (value) => {
    const protocol = new URL(value).protocol;

    return protocol === "redis:" || protocol === "rediss:";
  },
  { message: "Redis connection string must use redis:// or rediss://." },
);
