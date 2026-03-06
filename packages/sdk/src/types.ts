export type ContextStyle = "codex" | "claude" | "generic";

export interface RemoClientConfig {
  baseUrl?: string | undefined;
  apiKey?: string | undefined;
  timeoutMs?: number | undefined;
  fetchImplementation?: typeof fetch | undefined;
}

export interface RateLimitInfo {
  limit: number | undefined;
  remaining: number | undefined;
  reset: number | undefined;
  retryAfterSec: number | undefined;
}

export interface RemoContext {
  id: string;
  type: string;
  title: string;
  content: string;
  collection?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | undefined;
}

export interface RemoContextSummary {
  id: string;
  type: string;
  title: string;
  collection?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreditsInfo {
  credits: number;
}

export interface ListContextsOptions {
  type?: string | undefined;
  active?: boolean | undefined;
  collection?: string | undefined;
}

export interface CreateContextInput {
  title: string;
  content: string;
  type?: string | undefined;
  collection?: string | undefined;
}

export interface BuildContextPackOptions {
  sources: Array<RemoContext | RemoContextSummary>;
  maxChars?: number | undefined;
  style?: ContextStyle | undefined;
  includeInstructionPreface?: boolean | undefined;
}

export interface ContextPack {
  style: ContextStyle;
  text: string;
  sourceCount: number;
  truncated: boolean;
  totalChars: number;
}

export interface GeneratePromptOptions {
  mode?: "full" | "compact" | undefined;
}
