import { describe, expect, it } from "vitest";
import { buildClaudeWrapper, buildCodexWrapper, formatForClaude, formatForCodex } from "../src/index.js";

const contexts = [
  {
    id: "abc",
    type: "identity",
    title: "User Profile",
    content: "Build tools in TypeScript.",
    isActive: true,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
];

describe("adapters", () => {
  it("formats codex and claude packs", () => {
    const codex = formatForCodex(contexts);
    const claude = formatForClaude(contexts);

    expect(codex.text).toContain("Runtime Context For Codex");
    expect(claude.text).toContain("Runtime Context For Claude");
  });

  it("builds printable wrappers", () => {
    const codex = buildCodexWrapper("Fix bug", "ctx");
    const claude = buildClaudeWrapper("Plan feature", "ctx");

    expect(codex.command).toBe("codex");
    expect(claude.command).toBe("claude");
    expect(codex.printable).toContain("codex");
    expect(claude.printable).toContain("claude");
  });
});
