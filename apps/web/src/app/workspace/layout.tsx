"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";

/* ── Shared workspace state ── */
export type ContextSummary = {
  id: string;
  type: string;
  title: string;
  isActive: boolean;
  collection?: string | null;
  createdAt: string;
};

export type ContextFull = ContextSummary & {
  content: string;
  updatedAt?: string;
};

type WorkspaceState = {
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  contexts: ContextSummary[];
  fullContexts: ContextFull[];
  connected: boolean;
  loading: boolean;
  error: string | null;
  loadContexts: (query?: string) => Promise<void>;
  prompt: string;
  generatePrompt: () => Promise<void>;
  toast: { message: string; type: "success" | "error" } | null;
  showToast: (message: string, type?: "success" | "error") => void;
};

const WorkspaceCtx = createContext<WorkspaceState | null>(null);
export function useWorkspace() {
  const ctx = useContext(WorkspaceCtx);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceLayout");
  return ctx;
}

const DEFAULT_BASE_URL = "https://remo.rocks";

async function callRemo(
  baseUrl: string,
  apiKey: string,
  action: string,
  params: Record<string, string> = {},
) {
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/api/v1/context`);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `REMO request failed (${res.status})`);
  return json;
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [apiKey, setApiKey] = useState("");
  const [contexts, setContexts] = useState<ContextSummary[]>([]);
  const [fullContexts, setFullContexts] = useState<ContextFull[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* Hydrate key from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("remo-code-web-key");
    if (stored) setApiKey(stored);
    const storedUrl = localStorage.getItem("remo-code-web-url");
    if (storedUrl) setBaseUrl(storedUrl);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadContexts = useCallback(
    async (query?: string) => {
      if (!apiKey.trim()) return;
      setLoading(true);
      setError(null);
      try {
        localStorage.setItem("remo-code-web-key", apiKey);
        localStorage.setItem("remo-code-web-url", baseUrl);

        const summaryRes = query?.trim()
          ? await callRemo(baseUrl, apiKey, "search", { q: query })
          : await callRemo(baseUrl, apiKey, "list-contexts");

        const summaries: ContextSummary[] = (summaryRes.contexts ?? []).map((c: any) => ({
          id: String(c.id),
          type: String(c.type),
          title: String(c.title),
          isActive: Boolean(c.isActive ?? c.is_active ?? true),
          collection: (c.collection as string | null | undefined) ?? null,
          createdAt: String(c.createdAt ?? c.created_at ?? ""),
        }));

        const fullRes = await callRemo(baseUrl, apiKey, "get-context");
        const full: ContextFull[] = (fullRes.contexts ?? []).map((c: any) => ({
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
        setConnected(true);
        showToast(`Loaded ${summaries.length} contexts`);
      } catch (e) {
        setError((e as Error).message);
        setConnected(false);
        showToast((e as Error).message, "error");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, baseUrl, showToast],
  );

  const doGeneratePrompt = useCallback(async () => {
    if (!apiKey.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await callRemo(baseUrl, apiKey, "get-prompt");
      setPrompt(String(data.prompt ?? ""));
      showToast("Prompt generated");
    } catch (e) {
      setError((e as Error).message);
      showToast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }, [apiKey, baseUrl, showToast]);

  const state: WorkspaceState = {
    baseUrl,
    setBaseUrl,
    apiKey,
    setApiKey,
    contexts,
    fullContexts,
    connected,
    loading,
    error,
    loadContexts,
    prompt,
    generatePrompt: doGeneratePrompt,
    toast,
    showToast,
  };

  return (
    <WorkspaceCtx.Provider value={state}>
      <div className="app-shell">
        <Sidebar contextCount={contexts.length} connected={connected} />
        <div className="main-content">
          {loading && (
            <div className="loading-bar">
              <div className="loading-bar-inner" />
            </div>
          )}
          {children}
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          <span>{toast.type === "error" ? "\u2717" : "\u2713"}</span>
          {toast.message}
        </div>
      )}
    </WorkspaceCtx.Provider>
  );
}
