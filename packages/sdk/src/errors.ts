import type { RateLimitInfo } from "./types.js";

export class RemoApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly rateLimit: RateLimitInfo | undefined;

  constructor(message: string, status: number, code?: string, rateLimit?: RateLimitInfo) {
    super(message);
    this.name = "RemoApiError";
    this.status = status;
    this.code = code;
    this.rateLimit = rateLimit;
  }
}

export function parseRateLimit(headers: Headers): RateLimitInfo {
  const limit = headers.get("X-RateLimit-Limit");
  const remaining = headers.get("X-RateLimit-Remaining");
  const reset = headers.get("X-RateLimit-Reset");
  const retryAfterSec = headers.get("Retry-After");

  return {
    limit: limit ? Number(limit) : undefined,
    remaining: remaining ? Number(remaining) : undefined,
    reset: reset ? Number(reset) : undefined,
    retryAfterSec: retryAfterSec ? Number(retryAfterSec) : undefined,
  };
}
