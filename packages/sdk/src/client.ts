import { RemoApiError, parseRateLimit } from "./errors.js";
import { buildContextPack } from "./context-pack.js";
import type {
  ContextPack,
  CreateContextInput,
  CreditsInfo,
  GeneratePromptOptions,
  ListContextsOptions,
  RemoClientConfig,
  RemoContext,
  RemoContextSummary,
} from "./types.js";

const DEFAULT_BASE_URL = "https://remo.rocks";
const DEFAULT_TIMEOUT = 15_000;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function mapContextSummary(raw: Record<string, unknown>): RemoContextSummary {
  return {
    id: String(raw.id),
    type: String(raw.type),
    title: String(raw.title),
    collection: (raw.collection as string | null | undefined) ?? null,
    isActive: Boolean(raw.isActive ?? raw.is_active ?? true),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
  };
}

function mapContext(raw: Record<string, unknown>): RemoContext {
  const summary = mapContextSummary(raw);
  return {
    ...summary,
    content: String(raw.content ?? ""),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : raw.updated_at ? String(raw.updated_at) : undefined,
  };
}

interface RequestOptions {
  action: string;
  method?: "GET" | "POST";
  params?: Record<string, string | number | boolean | undefined>;
  body?: Record<string, unknown>;
}

interface RemoResponse {
  contexts?: Array<Record<string, unknown>>;
  context?: Record<string, unknown>;
  credits?: number;
  prompt?: string;
  [key: string]: unknown;
}

export class RemoClient {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(config: RemoClientConfig = {}) {
    const env = typeof process !== "undefined" ? process.env : undefined;
    this.baseUrl = normalizeBaseUrl(config.baseUrl ?? env?.REMO_BASE_URL ?? DEFAULT_BASE_URL);
    this.apiKey = config.apiKey ?? env?.REMO_API_KEY;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT;
    this.fetchImpl = config.fetchImplementation ?? fetch;
  }

  private async request(options: RequestOptions): Promise<RemoResponse> {
    if (!this.apiKey) {
      throw new RemoApiError("Missing REMO API key. Set REMO_API_KEY or configure apiKey.", 401, "MISSING_API_KEY");
    }

    const url = new URL(`${this.baseUrl}/api/v1/context`);
    url.searchParams.set("action", options.action);
    Object.entries(options.params ?? {}).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await this.fetchImpl(url.toString(), {
        method: options.method ?? "GET",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : null,
        signal: controller.signal,
      });
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        throw new RemoApiError(`Request timed out after ${this.timeoutMs}ms`, 408, "TIMEOUT");
      }
      throw new RemoApiError((error as Error).message, 503, "NETWORK_ERROR");
    } finally {
      clearTimeout(timeout);
    }

    const rateLimit = parseRateLimit(response.headers);
    let data: RemoResponse = {};

    try {
      data = (await response.json()) as RemoResponse;
    } catch {
      data = {};
    }

    if (!response.ok) {
      const message = typeof data.error === "string" ? data.error : `REMO request failed (${response.status})`;
      const code = response.status === 429
        ? "RATE_LIMITED"
        : response.status === 402
          ? "INSUFFICIENT_CREDITS"
          : response.status >= 500
            ? "SERVER_ERROR"
            : "REQUEST_ERROR";

      throw new RemoApiError(message, response.status, code, rateLimit);
    }

    return data;
  }

  async getAllContexts(): Promise<RemoContext[]> {
    const data = await this.request({ action: "get-context" });
    return (data.contexts ?? []).map((context) => mapContext(context));
  }

  async listContexts(options: ListContextsOptions = {}): Promise<RemoContextSummary[]> {
    const data = await this.request({
      action: "list-contexts",
      params: {
        type: options.type,
        active: options.active,
        collection: options.collection,
      },
    });
    return (data.contexts ?? []).map((context) => mapContextSummary(context));
  }

  async getContextById(params: { id: string }): Promise<RemoContext> {
    const data = await this.request({
      action: "get-by-id",
      params: { id: params.id },
    });

    if (!data.context || typeof data.context !== "object") {
      throw new RemoApiError("Context not found", 404, "NOT_FOUND");
    }

    return mapContext(data.context);
  }

  async searchContexts(params: { q: string }): Promise<RemoContextSummary[]> {
    const data = await this.request({
      action: "search",
      params: { q: params.q },
    });

    return (data.contexts ?? []).map((context) => mapContextSummary(context));
  }

  async createContext(input: CreateContextInput): Promise<RemoContextSummary> {
    const data = await this.request({
      action: "create-context",
      method: "POST",
      body: {
        title: input.title,
        content: input.content,
        type: input.type ?? "custom",
        collection: input.collection,
      },
    });

    if (!data.context || typeof data.context !== "object") {
      throw new RemoApiError("Invalid create-context response", 500, "INVALID_RESPONSE");
    }

    return mapContextSummary(data.context);
  }

  async getCredits(): Promise<CreditsInfo> {
    const data = await this.request({ action: "get-credits" });
    return { credits: Number(data.credits ?? 0) };
  }

  async generatePrompt(options: GeneratePromptOptions = {}): Promise<string> {
    const data = await this.request({ action: "get-prompt" });
    const prompt = typeof data.prompt === "string" ? data.prompt : "";

    if (options.mode === "compact") {
      return prompt.length > 2000 ? `${prompt.slice(0, 1997)}...` : prompt;
    }
    return prompt;
  }

  async buildContextPack(params: {
    sourceType?: "all" | "list";
    maxChars?: number;
    style?: "codex" | "claude" | "generic";
  }): Promise<ContextPack> {
    const sources = params.sourceType === "list"
      ? await this.listContexts()
      : await this.getAllContexts();

    return buildContextPack({
      sources,
      includeInstructionPreface: true,
      ...(params.maxChars !== undefined ? { maxChars: params.maxChars } : {}),
      ...(params.style !== undefined ? { style: params.style } : {}),
    });
  }
}
