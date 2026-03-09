"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  LayoutDashboard,
  Layers,
  Search,
} from "lucide-react";
import { useWorkspace } from "../layout";

export default function ContextsPage() {
  const ws = useWorkspace();
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const types = useMemo(
    () => Array.from(new Set(ws.contexts.map((context) => context.type))).sort(),
    [ws.contexts],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ws.contexts.filter((context) => {
      const matchesType = !filterType || context.type === filterType;
      const matchesQuery =
        !query ||
        context.title.toLowerCase().includes(query) ||
        context.id.toLowerCase().includes(query) ||
        (context.collection ?? "").toLowerCase().includes(query);
      return matchesType && matchesQuery;
    });
  }, [filterType, search, ws.contexts]);

  const resolvedSelectedId = useMemo(() => {
    if (selectedId && filtered.some((context) => context.id === selectedId)) {
      return selectedId;
    }
    return filtered[0]?.id ?? null;
  }, [filtered, selectedId]);

  const selectedContext = useMemo(
    () => ws.fullContexts.find((context) => context.id === resolvedSelectedId) ?? null,
    [resolvedSelectedId, ws.fullContexts],
  );

  const copySelectedContent = () => {
    if (!selectedContext?.content) return;
    navigator.clipboard.writeText(selectedContext.content);
    ws.showToast("Content copied");
  };

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
            {filtered.length} shown
          </span>
          <span className="badge badge-default">
            {ws.contexts.length} total
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
          <div className="workspace-stack">
            <div className="card animate-in">
              <div className="card-header">
                <span className="card-title">
                  <span className="card-icon">
                    <Search size={16} strokeWidth={1.5} />
                  </span>
                  Filter Contexts
                </span>
              </div>

              <div className="workspace-filter-bar">
                <div className="input-group workspace-search">
                  <label className="input-label">Search</label>
                  <input
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, id, or collection"
                  />
                </div>

                <div className="workspace-chip-row">
                  <button
                    className={`btn btn-sm ${!filterType ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setFilterType("")}
                  >
                    All
                  </button>
                  {types.map((type) => (
                    <button
                      key={type}
                      className={`btn btn-sm ${filterType === type ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setFilterType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="workspace-split animate-in animate-in-delay-1">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    <span className="card-icon">
                      <Layers size={16} strokeWidth={1.5} />
                    </span>
                    Context Index
                  </span>
                </div>

                <div className="workspace-list workspace-scroll">
                  {filtered.map((context) => (
                    <button
                      key={context.id}
                      className={`context-list-item ${resolvedSelectedId === context.id ? "active" : ""}`}
                      onClick={() => setSelectedId(context.id)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-sm">
                        <span className="context-card-title">{context.title}</span>
                        <span className={`badge ${getBadgeClass(context.type)}`}>{context.type}</span>
                      </div>
                      <div className="context-card-meta">
                        <span>{context.id}</span>
                        {context.collection ? <span>{context.collection}</span> : null}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card inspector-panel">
                {selectedContext ? (
                  <>
                    <div className="card-header">
                      <span className="card-title">
                        <span className="card-icon">
                          <Layers size={16} strokeWidth={1.5} />
                        </span>
                        {selectedContext.title}
                      </span>
                      <button className="btn btn-ghost btn-sm" onClick={copySelectedContent}>
                        <Copy size={14} strokeWidth={1.5} />
                        Copy
                      </button>
                    </div>

                    <div className="inspector-meta">
                      <span className={`badge ${getBadgeClass(selectedContext.type)}`}>
                        {selectedContext.type}
                      </span>
                      {selectedContext.collection ? (
                        <span className="badge badge-default">{selectedContext.collection}</span>
                      ) : null}
                      {selectedContext.isActive ? (
                        <span className="badge badge-green">active</span>
                      ) : (
                        <span className="badge badge-default">inactive</span>
                      )}
                    </div>

                    <div className="terminal">
                      <div className="terminal-header">
                        <div className="terminal-dots">
                          <span className="terminal-dot red" />
                          <span className="terminal-dot yellow" />
                          <span className="terminal-dot green" />
                        </div>
                        <span className="terminal-title">{selectedContext.id}</span>
                        <span className="badge badge-default">
                          {(selectedContext.content ?? "").length.toLocaleString()} chars
                        </span>
                      </div>
                      <div className="terminal-body" style={{ maxHeight: 720 }}>
                        <pre>{selectedContext.content || "No content available."}</pre>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Layers size={32} strokeWidth={1} />
                    </div>
                    <p className="empty-state-text">No matching context</p>
                    <p className="empty-state-hint">Adjust your filters or clear the search query.</p>
                  </div>
                )}
              </div>
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
