import type { BuildContextPackOptions, ContextPack, ContextStyle, RemoContext, RemoContextSummary } from "./types.js";

const DEFAULT_MAX_CHARS = 12000;

function getContextContent(context: RemoContext | RemoContextSummary): string {
  if ("content" in context && typeof context.content === "string") {
    return context.content;
  }
  return "";
}

function sortDeterministically(sources: Array<RemoContext | RemoContextSummary>): Array<RemoContext | RemoContextSummary> {
  return [...sources].sort((a, b) => {
    const byDate = b.createdAt.localeCompare(a.createdAt);
    if (byDate !== 0) return byDate;
    return a.id.localeCompare(b.id);
  });
}

function stylePrefix(style: ContextStyle, includeInstructionPreface: boolean): string {
  if (!includeInstructionPreface) return "";

  if (style === "codex") {
    return [
      "# Runtime Context For Codex",
      "Use this context as grounding for code generation and edits.",
      "Prefer precise references and preserve user intent.",
      "",
    ].join("\n");
  }

  if (style === "claude") {
    return [
      "# Runtime Context For Claude",
      "Treat this as persistent memory. Prioritize user goals, constraints, and tone.",
      "Synthesize across sources before answering.",
      "",
    ].join("\n");
  }

  return [
    "# Runtime Context",
    "Use these sources as primary context for response generation.",
    "",
  ].join("\n");
}

function styleBlock(style: ContextStyle, context: RemoContext | RemoContextSummary): string {
  const content = getContextContent(context);
  if (style === "codex") {
    return [
      `## [${context.type}] ${context.title}`,
      `- id: ${context.id}`,
      `- active: ${String(context.isActive)}`,
      `- created_at: ${context.createdAt}`,
      content ? "```text\n" + content.trim() + "\n```" : "",
      "",
    ].join("\n");
  }

  if (style === "claude") {
    return [
      `## ${context.title} (${context.type})`,
      `Source ID: ${context.id}`,
      `Created: ${context.createdAt}`,
      content ? content.trim() : "",
      "",
    ].join("\n");
  }

  return [
    `## ${context.title}`,
    `Type: ${context.type}`,
    `ID: ${context.id}`,
    content ? content.trim() : "",
    "",
  ].join("\n");
}

export function buildContextPack(options: BuildContextPackOptions): ContextPack {
  const style = options.style ?? "generic";
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const includePreface = options.includeInstructionPreface ?? true;

  const ordered = sortDeterministically(options.sources);
  const chunks: string[] = [stylePrefix(style, includePreface)];

  let truncated = false;
  for (const source of ordered) {
    const nextBlock = styleBlock(style, source);
    const candidate = chunks.join("\n") + nextBlock;
    if (candidate.length > maxChars) {
      truncated = true;
      break;
    }
    chunks.push(nextBlock);
  }

  const text = chunks.join("\n").trim();

  return {
    style,
    text,
    sourceCount: ordered.length,
    truncated,
    totalChars: text.length,
  };
}
