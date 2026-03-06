"use client";

import { useEffect, useMemo, useState } from "react";
import { formatForClaude, formatForCodex } from "@remo-code/adapters";

type ContextSummary = {
  id: string;
  type: string;
  title: string;
  isActive: boolean;
  collection?: string | null;
  createdAt: string;
};

type ContextFull = ContextSummary & {
  content: string;
  updatedAt?: string;
};

const defaultBaseUrl = "https://remo.rocks";

async function callRemo(baseUrl: string, apiKey: string, action: string, params: Record<string, string> = {}) {
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/api/v1/context`);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `REMO request failed (${res.status})`);
  return json;
}

export function WorkspaceClient() {
  const [baseUrl, setBaseUrl] = useState(defaultBaseUrl);
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [contexts, setContexts] = useState<ContextSummary[]>([]);
  const [fullContexts, setFullContexts] = useState<ContextFull[]>([]);
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"codex" | "claude" | "raw">("codex");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("remo-code-web-key");
    if (stored) setApiKey(stored);
  }, []);

  const codexPack = useMemo(() => formatForCodex(fullContexts, 12000).text, [fullContexts]);
  const claudePack = useMemo(() => formatForClaude(fullContexts, 12000).text, [fullContexts]);

  async function loadContexts() {
    setLoading(true);
    setError(null);

    try {
      localStorage.setItem("remo-code-web-key", apiKey);
      const summaryRes = query.trim()
        ? await callRemo(baseUrl, apiKey, "search", { q: query })
        : await callRemo(baseUrl, apiKey, "list-contexts");

      const summaries = (summaryRes.contexts ?? []).map((c: any) => ({
        id: String(c.id),
        type: String(c.type),
        title: String(c.title),
        isActive: Boolean(c.isActive ?? c.is_active ?? true),
        collection: (c.collection as string | null | undefined) ?? null,
        createdAt: String(c.createdAt ?? c.created_at ?? ""),
      }));

      const fullRes = await callRemo(baseUrl, apiKey, "get-context");
      const full = (fullRes.contexts ?? []).map((c: any) => ({
        id: String(c.id),
        type: String(c.type),
        title: String(c.title),
        content: String(c.content ?? ""),
        isActive: Boolean(c.isActive ?? c.is_active ?? true),
        collection: (c.collection as string | null | undefined) ?? null,
        createdAt: String(c.createdAt ?? c.created_at ?? ""),
        updatedAt: c.updatedAt ? String(c.updatedAt) : c.updated_at ? String(c.updated_at) : undefined,
      }));

      setContexts(summaries);
      setFullContexts(full);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function generatePrompt() {
    setLoading(true);
    setError(null);

    try {
      const data = await callRemo(baseUrl, apiKey, "get-prompt");
      setPrompt(String(data.prompt ?? ""));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const rawJson = JSON.stringify(fullContexts, null, 2);
  const tabContent = activeTab === "codex" ? codexPack : activeTab === "claude" ? claudePack : rawJson;

  function copyCurrentTab() {
    if (!tabContent) return;
    navigator.clipboard.writeText(tabContent);
  }

  function downloadCurrentTab() {
    const ext = activeTab === "raw" ? "json" : "md";
    const blob = new Blob([tabContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `remo-pack-${activeTab}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <h1>Remo Code Workspace</h1>
      <p>Use your REMO API key to browse contexts and generate Codex/Claude context packs.</p>

      <section className="card grid">
        <div className="grid cols-2">
          <label>
            REMO Base URL
            <input className="input" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
          </label>
          <label>
            REMO API Key
            <input className="input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="remo_..." />
          </label>
        </div>

        <div className="row">
          <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search query (optional)" />
          <button className="button" onClick={loadContexts} disabled={loading || !apiKey.trim()}>
            {loading ? "Loading..." : "Load Contexts"}
          </button>
          <button className="button secondary" onClick={generatePrompt} disabled={loading || !apiKey.trim()}>
            Generate Prompt
          </button>
        </div>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      </section>

      <section className="grid cols-2" style={{ marginTop: "1rem" }}>
        <article className="card">
          <h2>Contexts ({contexts.length})</h2>
          <div className="grid">
            {contexts.map((ctx) => (
              <div key={ctx.id} className="card" style={{ padding: "0.75rem" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong>{ctx.title}</strong>
                  <span className="badge">{ctx.type}</span>
                </div>
                <small>{ctx.id}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Generated Prompt</h2>
          <pre>{prompt || "No prompt generated yet."}</pre>
        </article>
      </section>

      <section className="card" style={{ marginTop: "1rem" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>Pack Preview</h2>
          <div className="row">
            <button className="button secondary" onClick={copyCurrentTab}>Copy</button>
            <button className="button" onClick={downloadCurrentTab}>Download</button>
          </div>
        </div>
        <div className="row" style={{ marginBottom: "0.75rem" }}>
          <button className={`button ${activeTab === "codex" ? "" : "secondary"}`} onClick={() => setActiveTab("codex")}>
            Codex
          </button>
          <button className={`button ${activeTab === "claude" ? "" : "secondary"}`} onClick={() => setActiveTab("claude")}>
            Claude
          </button>
          <button className={`button ${activeTab === "raw" ? "" : "secondary"}`} onClick={() => setActiveTab("raw")}>
            Raw JSON
          </button>
        </div>
        <pre>{tabContent || "No contexts loaded."}</pre>
      </section>
    </main>
  );
}
