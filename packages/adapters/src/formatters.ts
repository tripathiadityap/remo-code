import { buildContextPack } from "@remo-code/sdk";
import type { BuildContextPackOptions, ContextPack, RemoContext, RemoContextSummary } from "@remo-code/sdk";

function buildPack(
  style: "codex" | "claude" | "generic",
  contexts: Array<RemoContext | RemoContextSummary>,
  maxChars?: number,
): ContextPack {
  return buildContextPack({
    sources: contexts,
    style,
    includeInstructionPreface: true,
    ...(maxChars !== undefined ? { maxChars } : {}),
  } satisfies BuildContextPackOptions);
}

export function formatForCodex(contexts: Array<RemoContext | RemoContextSummary>, maxChars?: number): ContextPack {
  return buildPack("codex", contexts, maxChars);
}

export function formatForClaude(contexts: Array<RemoContext | RemoContextSummary>, maxChars?: number): ContextPack {
  return buildPack("claude", contexts, maxChars);
}

export function formatGeneric(contexts: Array<RemoContext | RemoContextSummary>, maxChars?: number): ContextPack {
  return buildPack("generic", contexts, maxChars);
}
