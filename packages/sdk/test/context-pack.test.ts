import { describe, expect, it } from "vitest";
import { buildContextPack } from "../src/index.js";

describe("buildContextPack", () => {
  it("formats codex pack and truncates deterministically", () => {
    const pack = buildContextPack({
      style: "codex",
      maxChars: 180,
      sources: [
        {
          id: "b",
          title: "Second",
          type: "note",
          content: "B".repeat(200),
          isActive: true,
          createdAt: "2026-03-02T00:00:00.000Z",
        },
        {
          id: "a",
          title: "First",
          type: "note",
          content: "A".repeat(10),
          isActive: true,
          createdAt: "2026-03-01T00:00:00.000Z",
        },
      ],
    });

    expect(pack.style).toBe("codex");
    expect(pack.truncated).toBe(true);
    expect(pack.text).toContain("Runtime Context For Codex");
  });

  it("formats claude style", () => {
    const pack = buildContextPack({
      style: "claude",
      sources: [
        {
          id: "a",
          title: "Persona",
          type: "identity",
          content: "Prefers concise responses.",
          isActive: true,
          createdAt: "2026-03-01T00:00:00.000Z",
        },
      ],
    });

    expect(pack.text).toContain("Runtime Context For Claude");
    expect(pack.text).toContain("Persona (identity)");
    expect(pack.truncated).toBe(false);
  });
});
