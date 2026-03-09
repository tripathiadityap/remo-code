"use client";

import { useMemo, useState } from "react";
import { Copy, Download, LayoutDashboard, Package } from "lucide-react";
import { formatForClaude, formatForCodex } from "@remo-code/adapters";
import { useWorkspace } from "../layout";

type TabKey = "codex" | "claude" | "raw";

const tabMeta: Record<TabKey, { label: string; filename: string; description: string }> = {
  codex: {
    label: "Codex",
    filename: "remo-pack-codex.md",
    description: "Markdown pack tuned for Codex consumption and task execution.",
  },
  claude: {
    label: "Claude",
    filename: "remo-pack-claude.md",
    description: "Readable prompt pack with Claude-friendly structure and prose.",
  },
  raw: {
    label: "Raw JSON",
    filename: "remo-pack-raw.json",
    description: "Full serialized context payload for custom tooling or debugging.",
  },
};

export default function PacksPage() {
  const ws = useWorkspace();
  const [activeTab, setActiveTab] = useState<TabKey>("codex");

  const codexPack = useMemo(
    () => formatForCodex(ws.fullContexts, 12000).text,
    [ws.fullContexts],
  );
  const claudePack = useMemo(
    () => formatForClaude(ws.fullContexts, 12000).text,
    [ws.fullContexts],
  );
  const rawJson = useMemo(
    () => JSON.stringify(ws.fullContexts, null, 2),
    [ws.fullContexts],
  );

  const tabContent = activeTab === "codex" ? codexPack : activeTab === "claude" ? claudePack : rawJson;
  const activeMeta = tabMeta[activeTab];

  const typeCount = useMemo(
    () => new Set(ws.fullContexts.map((context) => context.type)).size,
    [ws.fullContexts],
  );

  const copyContent = () => {
    if (!tabContent) return;
    navigator.clipboard.writeText(tabContent);
    ws.showToast("Copied to clipboard");
  };

  const downloadContent = () => {
    if (!tabContent) return;
    const ext = activeTab === "raw" ? "json" : "md";
    const blob = new Blob([tabContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `remo-pack-${activeTab}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    ws.showToast(`Downloaded remo-pack-${activeTab}.${ext}`);
  };

  return (
    <>
      <div className="content-header">
        <div className="content-header-title">
          <div className="breadcrumb">
            <LayoutDashboard size={14} strokeWidth={1.5} />
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: "var(--text-primary)" }}>Pack Builder</span>
          </div>
        </div>
        <div className="content-header-actions">
          <button className="btn btn-ghost btn-sm" onClick={copyContent} disabled={!tabContent}>
            <Copy size={14} strokeWidth={1.5} />
            Copy
          </button>
          <button className="btn btn-primary btn-sm" onClick={downloadContent} disabled={!tabContent}>
            <Download size={14} strokeWidth={1.5} />
            Download
          </button>
        </div>
      </div>

      <div className="content-body">
        {ws.fullContexts.length === 0 ? (
          <div className="card animate-in" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ marginBottom: "1rem", opacity: 0.3 }}>
              <Package size={48} strokeWidth={1} />
            </div>
            <h3 style={{ marginBottom: "0.5rem" }}>No contexts loaded</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Load contexts from the Workspace tab to build packs.
            </p>
          </div>
        ) : (
          <div className="workspace-stack animate-in">
            <div className="metric-strip">
              <div className="metric-chip">
                <strong>{ws.fullContexts.length}</strong>
                <span>contexts</span>
              </div>
              <div className="metric-chip">
                <strong>{typeCount}</strong>
                <span>types</span>
              </div>
              <div className="metric-chip">
                <strong>{tabContent.length.toLocaleString()}</strong>
                <span>characters</span>
              </div>
            </div>

            <div className="pack-layout">
              <div className="card pack-side-panel">
                <div className="card-header">
                  <span className="card-title">
                    <span className="card-icon">
                      <Package size={16} strokeWidth={1.5} />
                    </span>
                    Output Format
                  </span>
                </div>

                <div className="tab-bar">
                  {Object.entries(tabMeta).map(([key, meta]) => (
                    <button
                      key={key}
                      className={`tab-item ${activeTab === key ? "active" : ""}`}
                      onClick={() => setActiveTab(key as TabKey)}
                    >
                      {meta.label}
                    </button>
                  ))}
                </div>

                <div className="callout-card mt-md">
                  <strong>{activeMeta.filename}</strong>
                  <p>{activeMeta.description}</p>
                </div>

                <div className="workspace-list mt-md">
                  {ws.fullContexts.slice(0, 6).map((context) => (
                    <div key={context.id} className="context-card">
                      <div className="flex items-center justify-between">
                        <span className="context-card-title">{context.title}</span>
                        <span className="badge badge-default">{context.type}</span>
                      </div>
                      <div className="context-card-meta">
                        <span>{context.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="terminal">
                <div className="terminal-header">
                  <div className="terminal-dots">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                  </div>
                  <span className="terminal-title">{activeMeta.filename}</span>
                  <div className="terminal-actions">
                    <button className="btn btn-ghost btn-sm" onClick={copyContent}>
                      Copy
                    </button>
                  </div>
                </div>
                <div className="terminal-body" style={{ maxHeight: 720 }}>
                  <pre>{tabContent || "Empty pack."}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
