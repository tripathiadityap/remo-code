import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { maskApiKey, readConfig, resolveApiConfig, writeConfig } from "../src/config.js";

describe("cli config", () => {
  afterEach(() => {
    delete process.env.REMO_CODE_CONFIG_DIR;
    delete process.env.REMO_API_KEY;
    delete process.env.REMO_BASE_URL;
  });

  it("writes and reads config", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "remo-code-"));
    process.env.REMO_CODE_CONFIG_DIR = dir;

    await writeConfig({ apiKey: "remo_abc", baseUrl: "https://remo.rocks" });
    const config = await readConfig();

    expect(config.apiKey).toBe("remo_abc");
    expect(config.baseUrl).toBe("https://remo.rocks");
  });

  it("env vars override stored config", () => {
    process.env.REMO_API_KEY = "remo_env";
    process.env.REMO_BASE_URL = "https://example.com";

    const resolved = resolveApiConfig({ apiKey: "remo_file", baseUrl: "https://remo.rocks" });

    expect(resolved.apiKey).toBe("remo_env");
    expect(resolved.baseUrl).toBe("https://example.com");
  });

  it("masks api keys", () => {
    expect(maskApiKey("remo_1234567890")).toBe("remo_123...7890");
  });
});
