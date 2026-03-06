import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

export interface CliStoredConfig {
  apiKey?: string | undefined;
  baseUrl?: string | undefined;
}

export function getConfigDir(): string {
  return process.env.REMO_CODE_CONFIG_DIR ?? path.join(homedir(), ".remo-code");
}

export function getConfigPath(): string {
  return path.join(getConfigDir(), "config.json");
}

export async function readConfig(): Promise<CliStoredConfig> {
  try {
    const raw = await readFile(getConfigPath(), "utf8");
    return JSON.parse(raw) as CliStoredConfig;
  } catch {
    return {};
  }
}

export async function writeConfig(update: CliStoredConfig): Promise<void> {
  const current = await readConfig();
  const next = { ...current, ...update };
  await mkdir(getConfigDir(), { recursive: true });
  await writeFile(getConfigPath(), JSON.stringify(next, null, 2), "utf8");
}

export function resolveApiConfig(stored: CliStoredConfig): { apiKey: string | undefined; baseUrl: string } {
  return {
    apiKey: process.env.REMO_API_KEY ?? stored.apiKey,
    baseUrl: process.env.REMO_BASE_URL ?? stored.baseUrl ?? "https://remo.rocks",
  };
}

export function maskApiKey(value: string): string {
  if (value.length < 12) return "***";
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}
