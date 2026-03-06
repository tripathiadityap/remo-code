"use client";

import {
  LayoutDashboard,
  Sparkles,
  RefreshCw,
  Copy,
} from "lucide-react";
import { useWorkspace } from "../layout";

export default function PromptPage() {
  const ws = useWorkspace();

  const copyPrompt = () => {
    if (!ws.prompt) return;
    navigator.clipboard.writeText(ws.prompt);
    ws.showToast("Prompt copied");
  };

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
              Generate a system prompt from your REMO contexts to inject into
              Codex or Claude sessions.
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
          <div className="animate-in">
            <div className="flex items-center justify-between mb-md">
              <span className="badge badge-default">
                {ws.prompt.length.toLocaleString()} characters
              </span>
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
              <div className="terminal-body" style={{ maxHeight: 700 }}>
                <pre>{ws.prompt}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
