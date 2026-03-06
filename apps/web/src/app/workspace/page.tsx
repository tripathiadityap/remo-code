"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Layers,
  Sparkles,
  Link2,
} from "lucide-react";
import { useWorkspace } from "./layout";

export default function WorkspaceDashboard() {
  const ws = useWorkspace();
  const [query, setQuery] = useState("");

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
          {ws.connected && (
            <span className="badge badge-green">Connected</span>
          )}
        </div>
      </div>

      <div className="content-body">
        <div className="config-panel animate-in">
          <div className="card-header">
            <span className="card-title">
              <span className="card-icon">
                <Settings size={16} strokeWidth={1.5} />
              </span>
              REMO Configuration
            </span>
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

          <div className="flex items-center gap-sm">
            <div className="input-group" style={{ flex: 1 }}>
              <input
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search contexts (optional)..."
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

          {ws.error && (
            <div
              className="mt-sm"
              style={{
                padding: "0.5rem 0.75rem",
                background: "var(--red-dim)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "var(--radius-md)",
                color: "var(--red)",
                fontSize: "0.82rem",
              }}
            >
              {ws.error}
            </div>
          )}
        </div>

        {ws.connected && (
          <div className="grid grid-4 mt-lg animate-in animate-in-delay-1">
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--accent)" }}>
                {ws.contexts.length}
              </div>
              <div className="stat-label">Contexts</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--green)" }}>
                {ws.contexts.filter((c) => c.isActive).length}
              </div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--blue)" }}>
                {new Set(ws.contexts.map((c) => c.type)).size}
              </div>
              <div className="stat-label">Types</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--orange)" }}>
                {new Set(ws.contexts.map((c) => c.collection).filter(Boolean)).size}
              </div>
              <div className="stat-label">Collections</div>
            </div>
          </div>
        )}

        {ws.connected && (
          <div className="grid grid-2 mt-lg animate-in animate-in-delay-2">
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="card-icon">
                    <Layers size={16} strokeWidth={1.5} />
                  </span>
                  Contexts
                  <span className="badge badge-default">{ws.contexts.length}</span>
                </span>
              </div>

              {ws.contexts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Layers size={32} strokeWidth={1} />
                  </div>
                  <p className="empty-state-text">No contexts found</p>
                  <p className="empty-state-hint">
                    Create contexts in your REMO account
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-sm" style={{ maxHeight: 400, overflowY: "auto" }}>
                  {ws.contexts.map((ctx) => (
                    <div key={ctx.id} className="context-card">
                      <div className="flex items-center justify-between">
                        <span className="context-card-title">{ctx.title}</span>
                        <span className={`badge ${getBadgeClass(ctx.type)}`}>
                          {ctx.type}
                        </span>
                      </div>
                      <div className="context-card-meta">
                        <span>{ctx.id}</span>
                        {ctx.collection && (
                          <>
                            <span style={{ color: "var(--text-dim)" }}>/</span>
                            <span>{ctx.collection}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="card-icon">
                    <Sparkles size={16} strokeWidth={1.5} />
                  </span>
                  Generated Prompt
                </span>
              </div>

              {ws.prompt ? (
                <div className="prompt-block">{ws.prompt}</div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Sparkles size={32} strokeWidth={1} />
                  </div>
                  <p className="empty-state-text">No prompt generated</p>
                  <p className="empty-state-hint">
                    Click &quot;Generate Prompt&quot; to create one
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!ws.connected && !ws.loading && (
          <div className="mt-xl animate-in animate-in-delay-1">
            <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
              <div style={{ marginBottom: "1rem", opacity: 0.3 }}>
                <Link2 size={48} strokeWidth={1} />
              </div>
              <h3 style={{ marginBottom: "0.5rem" }}>Connect to REMO</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: 420, margin: "0 auto" }}>
                Enter your API key above and click Load Contexts to get
                started. Your key is stored locally in your browser.
              </p>
            </div>
          </div>
        )}
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
