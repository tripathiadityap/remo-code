"use client";

import { Copy, LayoutDashboard, RefreshCw, Sparkles } from "lucide-react";
import { useWorkspace } from "../layout";

export default function PromptPage() {
  const ws = useWorkspace();

  const copyPrompt = () => {
    if (!ws.prompt) return;
    navigator.clipboard.writeText(ws.prompt);
    ws.showToast("Prompt copied");
  };

  const lineCount = ws.prompt ? ws.prompt.split("\n").length : 0;

  return (
    <>
      <div className="content-header">
        <div className="content-header-title">
          <div className="breadcrumb">
            <LayoutDashboard size={14} strokeWidth={1.5} />
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: "var(--text-primary)" }}>Prompt Generator</span>
          </div>
        </div>
        <div className="content-header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => ws.generatePrompt()}
            disabled={ws.loading || !ws.apiKey.trim()}
          >
            {ws.loading ? (
              <>
                <span className="spinner" /> Generating...
              </>
            ) : (
              <>
                <RefreshCw size={14} strokeWidth={1.5} />
                Regenerate
              </>
            )}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={copyPrompt}
            disabled={!ws.prompt}
          >
            <Copy size={14} strokeWidth={1.5} />
            Copy Prompt
          </button>
        </div>
      </div>

      <div className="content-body">
        {!ws.prompt ? (
          <div className="card animate-in" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ marginBottom: "1rem", opacity: 0.3 }}>
              <Sparkles size={48} strokeWidth={1} />
            </div>
            <h3 style={{ marginBottom: "0.5rem" }}>No prompt generated yet</h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                maxWidth: 420,
                margin: "0 auto 1.5rem",
              }}
            >
              Generate a system prompt from your REMO contexts to inject into Codex or Claude
              sessions.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => ws.generatePrompt()}
              disabled={ws.loading || !ws.apiKey.trim()}
            >
              {ws.loading ? (
                <>
                  <span className="spinner" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} strokeWidth={1.5} />
                  Generate Prompt
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="workspace-split animate-in">
            <div className="card pack-side-panel">
              <div className="card-header">
                <span className="card-title">
                  <span className="card-icon">
                    <Sparkles size={16} strokeWidth={1.5} />
                  </span>
                  Prompt Brief
                </span>
              </div>

              <div className="metric-strip">
                <div className="metric-chip">
                  <strong>{ws.prompt.length.toLocaleString()}</strong>
                  <span>characters</span>
                </div>
                <div className="metric-chip">
                  <strong>{lineCount}</strong>
                  <span>lines</span>
                </div>
              </div>

              <div className="callout-card mt-md">
                <strong>Use this as your session bootstrap.</strong>
                <p>
                  Paste it into Codex or Claude before implementation work so the agent starts with
                  product goals, architecture, and memory instead of reconstructing them from scratch.
                </p>
              </div>

              <div className="workspace-list mt-md">
                <div className="context-card">
                  <div className="context-card-title">Suggested usage</div>
                  <div className="context-card-meta">
                    <span>1. Generate prompt</span>
                    <span>2. Attach pack</span>
                    <span>3. Start task</span>
                  </div>
                </div>
                <div className="context-card">
                  <div className="context-card-title">Source</div>
                  <div className="context-card-meta">
                    <span>{ws.contexts.length} loaded contexts</span>
                    <span>{ws.connected ? "REMO connected" : "offline"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                </div>
                <span className="terminal-title">system-prompt.md</span>
                <div className="terminal-actions">
                  <button className="btn btn-ghost btn-sm" onClick={copyPrompt}>
                    <Copy size={14} strokeWidth={1.5} />
                    Copy
                  </button>
                </div>
              </div>
              <div className="terminal-body" style={{ maxHeight: 720 }}>
                <pre>{ws.prompt}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
