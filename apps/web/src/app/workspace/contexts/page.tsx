"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  ChevronDown,
  ChevronRight,
  Copy,
} from "lucide-react";
import { useWorkspace } from "../layout";

export default function ContextsPage() {
  const ws = useWorkspace();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("");

  const types = Array.from(new Set(ws.contexts.map((c) => c.type)));
  const filtered = filterType
    ? ws.contexts.filter((c) => c.type === filterType)
    : ws.contexts;

  const getFullContent = (id: string) =>
    ws.fullContexts.find((c) => c.id === id)?.content ?? "";

  return (
    <>
      <div className="content-header">
        <div className="content-header-title">
          <div className="breadcrumb">
            <LayoutDashboard size={14} strokeWidth={1.5} />
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: "var(--text-primary)" }}>Contexts</span>
          </div>
        </div>
        <div className="content-header-actions">
          <span className="badge badge-default">
            {filtered.length} context{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="content-body">
        {ws.contexts.length === 0 ? (
          <div className="card animate-in" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ marginBottom: "1rem", opacity: 0.3 }}>
              <Layers size={48} strokeWidth={1} />
            </div>
            <h3 style={{ marginBottom: "0.5rem" }}>No contexts loaded</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Go to the Workspace tab and load contexts first.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-sm mb-lg animate-in">
              <button
                className={`btn btn-sm ${!filterType ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilterType("")}
              >
                All
              </button>
              {types.map((t) => (
                <button
                  key={t}
                  className={`btn btn-sm ${filterType === t ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setFilterType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-sm animate-in animate-in-delay-1">
              {filtered.map((ctx) => {
                const isExpanded = expandedId === ctx.id;
                return (
                  <div
                    key={ctx.id}
                    className="card"
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpandedId(isExpanded ? null : ctx.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-sm">
                        <span style={{ color: "var(--text-dim)" }}>
                          {isExpanded
                            ? <ChevronDown size={16} strokeWidth={1.5} />
                            : <ChevronRight size={16} strokeWidth={1.5} />}
                        </span>
                        <span style={{ fontWeight: 600 }}>{ctx.title}</span>
                      </div>
                      <div className="flex items-center gap-sm">
                        {ctx.collection && (
                          <span className="badge badge-default">{ctx.collection}</span>
                        )}
                        <span className={`badge ${getBadgeClass(ctx.type)}`}>
                          {ctx.type}
                        </span>
                      </div>
                    </div>

                    <div className="context-card-meta mt-sm">
                      <span>ID: {ctx.id}</span>
                      {ctx.createdAt && (
                        <>
                          <span style={{ color: "var(--text-dim)" }}>&middot;</span>
                          <span>{new Date(ctx.createdAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-md">
                        <div className="terminal">
                          <div className="terminal-header">
                            <div className="terminal-dots">
                              <span className="terminal-dot red" />
                              <span className="terminal-dot yellow" />
                              <span className="terminal-dot green" />
                            </div>
                            <span className="terminal-title">{ctx.title}</span>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(getFullContent(ctx.id));
                                ws.showToast("Content copied");
                              }}
                            >
                              <Copy size={14} strokeWidth={1.5} />
                              Copy
                            </button>
                          </div>
                          <div className="terminal-body">
                            <pre>{getFullContent(ctx.id) || "No content available."}</pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
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
