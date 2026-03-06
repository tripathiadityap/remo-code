import { describe, expect, it, vi } from "vitest";
import { RemoApiError, RemoClient } from "../src/index.js";

describe("RemoClient", () => {
  it("throws missing api key error", async () => {
    const client = new RemoClient({
      baseUrl: "https://remo.rocks",
      fetchImplementation: vi.fn() as unknown as typeof fetch,
    });

    await expect(client.getAllContexts()).rejects.toMatchObject({
      status: 401,
      code: "MISSING_API_KEY",
    });
  });

  it("maps listContexts query params", async () => {
    const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      expect(url).toContain("action=list-contexts");
      expect(url).toContain("type=note");
      expect(url).toContain("active=false");
      expect(url).toContain("collection=work");

      return new Response(JSON.stringify({ contexts: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const client = new RemoClient({
      apiKey: "remo_test",
      fetchImplementation: mockFetch as unknown as typeof fetch,
      baseUrl: "https://remo.rocks",
    });

    await client.listContexts({ type: "note", active: false, collection: "work" });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("normalizes rate-limit errors", async () => {
    const mockFetch = vi.fn(async () => {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": "1234",
          "Retry-After": "30",
        },
      });
    });

    const client = new RemoClient({
      apiKey: "remo_test",
      fetchImplementation: mockFetch as unknown as typeof fetch,
    });

    await expect(client.getAllContexts()).rejects.toBeInstanceOf(RemoApiError);

    try {
      await client.getAllContexts();
    } catch (error) {
      const apiError = error as RemoApiError;
      expect(apiError.status).toBe(429);
      expect(apiError.code).toBe("RATE_LIMITED");
      expect(apiError.rateLimit?.retryAfterSec).toBe(30);
    }
  });

  it("maps insufficient credits to typed code", async () => {
    const mockFetch = vi.fn(async () => {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    const client = new RemoClient({
      apiKey: "remo_test",
      fetchImplementation: mockFetch as unknown as typeof fetch,
    });

    await expect(client.generatePrompt()).rejects.toMatchObject({
      status: 402,
      code: "INSUFFICIENT_CREDITS",
    });
  });
});
