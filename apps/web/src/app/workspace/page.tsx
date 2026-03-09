"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  LayoutDashboard,
  Layers,
  Link2,
  Package,
  Settings,
  Sparkles,
} from "lucide-react";
import { useWorkspace } from "./layout";

export default function WorkspaceDashboard() {
  const ws = useWorkspace();
  const [query, setQuery] = useState("");

  const activeCount = useMemo(
    () => ws.contexts.filter((context) => context.isActive).length,
    [ws.contexts],
  );
  const typeCount = useMemo(
    () => new Set(ws.contexts.map((context) => context.type)).size,
    [ws.contexts],
  );
  const collectionCount = useMemo(
    () => new Set(ws.contexts.map((context) => context.collection).filter(Boolean)).size,
    [ws.contexts],
  );
  const recentContexts = useMemo(() => ws.contexts.slice(0, 5), [ws.contexts]);

  const handleConnect = () => {
    ws.loadContexts(query || undefined);
  };

  return (
    <>
      <div className="content-header">
        <div className="content-header-title">
          <h2 className="flex items-center gap-sm">
            <LayoutDashboard size={18} strokeWidth={1.5} />
            Workspace
          </h2>
        </div>
        <div className="content-header-actions">
          <span className={`badge ${ws.connected ? "badge-green" : "badge-default"}`}>
            {ws.connected ? "Connected" : "Idle"}
          </span>
          <Link href="/docs" className="btn btn-ghost btn-sm">
            Docs
          </Link>
        </div>
      </div>

      <div className="content-body">
        <section className="workspace-hero card animate-in">
          <div className="workspace-hero-copy">
            <span className="section-kicker">Control Room</span>
            <h1 className="workspace-title">Run REMO Code like an agent workspace, not a form.</h1>
            <p className="workspace-description">
              Connect REMO, inspect context, generate prompts, and export agent-ready packs from
              one shell. The workflow is still simple, but the surface is now organized around the
              actual sequence developers use.
            </p>
          </div>

          <div className="workspace-inline-actions">
            <Link href="/workspace/contexts" className="btn btn-secondary">
              <Layers size={15} strokeWidth={1.5} />
              Browse Contexts
            </Link>
            <Link href="/workspace/packs" className="btn btn-secondary">
              <Package size={15} strokeWidth={1.5} />
              Build Packs
            </Link>
            <Link href="/workspace/prompt" className="btn btn-primary">
              <Sparkles size={15} strokeWidth={1.5} />
              Prompt Generator
            </Link>
          </div>
        </section>

        <section className="workspace-stack mt-lg">
          <div className="config-panel animate-in animate-in-delay-1">
            <div className="card-header">
              <span className="card-title">
                <span className="card-icon">
                  <Settings size={16} strokeWidth={1.5} />
                </span>
                REMO Configuration
              </span>
              <span className="badge badge-default">Browser-local key storage</span>
            </div>

            <div className="config-row mb-md">
              <div className="input-group">
                <label className="input-label">Base URL</label>
                <input
                  className="input"
                  value={ws.baseUrl}
                  onChange={(e) => ws.setBaseUrl(e.target.value)}
                  placeholder="https://remo.rocks"
                />
              </div>
              <div className="input-group">
                <label className="input-label">API Key</label>
                <input
                  className="input"
                  type="password"
                  value={ws.apiKey}
                  onChange={(e) => ws.setApiKey(e.target.value)}
                  placeholder="remo_..."
                />
              </div>
            </div>

            <div className="workspace-action-row">
              <div className="input-group workspace-search">
                <label className="input-label">Optional Search Seed</label>
                <input
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try auth, architecture, onboarding..."
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleConnect}
                disabled={ws.loading || !ws.apiKey.trim()}
              >
                {ws.loading ? (
                  <>
                    <span className="spinner" /> Loading...
                  </>
                ) : (
                  "Load Contexts"
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => ws.generatePrompt()}
                disabled={ws.loading || !ws.apiKey.trim()}
              >
                Generate Prompt
              </button>
            </div>

            {ws.error && <div className="callout-card callout-error mt-sm">{ws.error}</div>}
          </div>

          {ws.connected ? (
            <>
              <div className="grid grid-4 animate-in animate-in-delay-2">
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--accent)" }}>
                    {ws.contexts.length}
                  </div>
                  <div className="stat-label">Contexts loaded</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--green)" }}>
                    {activeCount}
                  </div>
                  <div className="stat-label">Active contexts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--blue)" }}>
                    {typeCount}
                  </div>
                  <div className="stat-label">Content types</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--orange)" }}>
                    {collectionCount}
                  </div>
                  <div className="stat-label">Collections</div>
                </div>
              </div>

              <div className="grid grid-2 mt-lg animate-in animate-in-delay-3">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <span className="card-icon">
                        <Layers size={16} strokeWidth={1.5} />
                      </span>
                      Recent Contexts
                    </span>
                    <Link href="/workspace/contexts" className="btn btn-ghost btn-sm">
                      Open
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="workspace-list">
                    {recentContexts.map((context) => (
                      <div key={context.id} className="context-card">
                        <div className="flex items-center justify-between">
                          <span className="context-card-title">{context.title}</span>
                          <span className={`badge ${getBadgeClass(context.type)}`}>{context.type}</span>
                        </div>
                        <div className="context-card-meta">
                          <span>{context.id}</span>
                          {context.collection ? <span>{context.collection}</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      <span className="card-icon">
                        <Sparkles size={16} strokeWidth={1.5} />
                      </span>
                      Prompt Status
                    </span>
                    <Link href="/workspace/prompt" className="btn btn-ghost btn-sm">
                      Open
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {ws.prompt ? (
                    <div className="prompt-block">{ws.prompt}</div>
                  ) : (
                    <div className="callout-card">
                      <strong>No prompt generated yet.</strong>
                      <p>
                        Generate a system prompt after loading contexts so Codex or Claude starts
                        with your architecture and project memory already attached.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card animate-in animate-in-delay-2" style={{ textAlign: "center", padding: "3rem 2rem" }}>
              <div style={{ marginBottom: "1rem", opacity: 0.3 }}>
                <Link2 size={48} strokeWidth={1} />
              </div>
              <h3 style={{ marginBottom: "0.5rem" }}>Connect to REMO</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: 420, margin: "0 auto" }}>
                Enter your API key, optionally seed a search term, and load contexts into the
                workspace. Your key stays in local browser storage.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function getBadgeClass(type: string): string {
  switch (type.toLowerCase()) {
    case "architecture":
    case "system":
      return "badge-purple";
    case "code":
    case "snippet":
      return "badge-green";
    case "requirement":
    case "spec":
      return "badge-blue";
    case "note":
    case "memory":
      return "badge-orange";
    default:
      return "badge-default";
  }
}
