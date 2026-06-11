import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set.",
    );
  }

  _redis = new Redis({ url, token });
  return _redis;
}

export const REDIS_KEYS = {
  DASHBOARD_CONTENT: "dashboard:content",
  AUTH_BLOCKED: "auth:blocked",
} as const;
