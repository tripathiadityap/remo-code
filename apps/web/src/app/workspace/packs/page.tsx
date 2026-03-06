"use client";

import { useMemo, useState } from "react";
import { LayoutDashboard, Package, Copy, Download } from "lucide-react";
import { formatForClaude, formatForCodex } from "@remo-code/adapters";
import { useWorkspace } from "../layout";

type TabKey = "codex" | "claude" | "raw";

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

  const tabs: { key: TabKey; label: string }[] = [
    { key: "codex", label: "Codex" },
    { key: "claude", label: "Claude" },
    { key: "raw", label: "Raw JSON" },
  ];

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
          <div className="animate-in">
            {/* ── Tab bar ── */}
            <div className="flex items-center justify-between mb-lg">
              <div className="tab-bar">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-sm">
                <span className="badge badge-default">
                  {tabContent.length.toLocaleString()} chars
                </span>
                <span className="badge badge-default">
                  {ws.fullContexts.length} contexts
                </span>
              </div>
            </div>

            {/* ── Terminal output ── */}
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                </div>
                <span className="terminal-title">
                  remo-pack-{activeTab}.{activeTab === "raw" ? "json" : "md"}
                </span>
                <div className="terminal-actions">
                  <button className="btn btn-ghost btn-sm" onClick={copyContent}>
                    Copy
                  </button>
                </div>
              </div>
              <div className="terminal-body" style={{ maxHeight: 600 }}>
                <pre>{tabContent || "Empty pack."}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
