import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Boxes,
  ExternalLink,
  Github,
  LayoutDashboard,
  Shield,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";
import { RemoLogo } from "../components/icons/remo-logo";

const productStats = [
  { value: "CLI + SDK", label: "typed bridge across terminal, web, and adapters" },
  { value: "Codex + Claude", label: "build packs for the agents your team already uses" },
  { value: "Live REMO API", label: "persistent context instead of session-by-session resets" },
];

const featureCards: Array<{
  title: string;
  copy: string;
  icon: LucideIcon;
  tone: string;
}> = [
  {
    title: "Sharper Workspace Shell",
    copy: "T3-inspired density, quieter chrome, and product-grade surface treatment for the REMO dashboard.",
    icon: LayoutDashboard,
    tone: "blue",
  },
  {
    title: "Fast Pack Building",
    copy: "Generate Codex and Claude-ready context packs from the same stored knowledge base without extra glue code.",
    icon: Boxes,
    tone: "green",
  },
  {
    title: "Prompt Generation",
    copy: "Turn stored contexts into reusable system prompts for new sessions and repeatable workflows.",
    icon: Sparkles,
    tone: "purple",
  },
  {
    title: "Terminal-Native Flow",
    copy: "Keep the product grounded in the CLI path that developers actually use, not just a marketing UI.",
    icon: Terminal,
    tone: "orange",
  },
  {
    title: "Protected By Design",
    copy: "Local key storage, typed API boundaries, and a calmer interface that keeps the important state obvious.",
    icon: Shield,
    tone: "green",
  },
  {
    title: "Workflow Memory",
    copy: "Feed architecture, specs, notes, and code snippets back into the exact execution layer doing the work.",
    icon: Brain,
    tone: "blue",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Connect your REMO account",
    copy: "Store the API key once, point the app at `remo.rocks`, and pull down the project contexts you care about.",
  },
  {
    step: "02",
    title: "Build agent-specific context",
    copy: "Filter, inspect, and package the same context corpus for Codex, Claude, or raw JSON handoff.",
  },
  {
    step: "03",
    title: "Launch higher-context sessions",
    copy: "Use prompt generation and pack export to start sessions from architecture, goals, and prior decisions.",
  },
];

const previewTypes = ["architecture", "spec", "note", "snippet"];
const previewNav = ["Workspace", "Contexts", "Pack Builder", "Prompt Gen"];

export default function HomePage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link href="/" className="landing-nav-logo">
          <RemoLogo size={26} />
          REMO Code
        </Link>

        <div className="landing-nav-links">
          <Link href="/docs" className="btn btn-ghost btn-sm">
            <BookOpen size={14} strokeWidth={1.5} />
            Docs
          </Link>
          <a
            href="https://github.com/tripathiadityap/remo-code"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
          >
            <Github size={14} strokeWidth={1.5} />
            GitHub
          </a>
          <Link href="/workspace" className="btn btn-primary btn-sm">
            Open Workspace
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-badge animate-in">
            <Workflow size={14} strokeWidth={1.6} />
            Open-source memory layer for coding agents
          </div>

          <h1 className="hero-title animate-in animate-in-delay-1">
            Persistent context for
            {" "}
            <span className="gradient-text">faster AI coding workflows</span>
          </h1>

          <p className="hero-subtitle animate-in animate-in-delay-2">
            REMO Code keeps the product surface and CLI grounded in the same context source, then
            packages that memory for Codex, Claude, and repeatable agent runs.
          </p>

          <div className="hero-actions animate-in animate-in-delay-2">
            <Link href="/workspace" className="btn btn-primary">
              Launch Workspace
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://remo.rocks"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Get API Key
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="hero-stat-row animate-in animate-in-delay-3">
            {productStats.map((stat) => (
              <div key={stat.value} className="hero-stat">
                <span className="hero-stat-value">{stat.value}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-preview animate-in animate-in-delay-3">
            <div className="preview-window">
              <div className="preview-toolbar">
                <div className="terminal-dots">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                </div>
                <span className="preview-toolbar-title">workspace.remo-code</span>
                <span className="preview-toolbar-badge">Codex pack ready</span>
              </div>

              <div className="preview-layout">
                <aside className="preview-rail">
                  <div className="preview-brand">
                    <RemoLogo size={22} />
                    <div>
                      <strong>REMO Code</strong>
                      <span>persistent memory shell</span>
                    </div>
                  </div>

                  <div className="preview-rail-card">
                    <span className="preview-rail-label">Connection</span>
                    <strong>remo.rocks / live</strong>
                    <span className="preview-rail-meta">12 cached contexts, 4 collections</span>
                  </div>

                  <div className="preview-nav-list">
                    {previewNav.map((item, index) => (
                      <div
                        key={item}
                        className={`preview-nav-item ${index === 0 ? "active" : ""}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="preview-main">
                  <div className="preview-command">
                    <span className="cmd-prefix">$</span>
                    <span className="cmd-text">
                      remo-code pack build --for codex --max-chars 12000
                    </span>
                  </div>

                  <div className="preview-grid">
                    <article className="preview-panel">
                      <div className="preview-panel-header">
                        <span>Context Sources</span>
                        <span>8 loaded</span>
                      </div>

                      <div className="preview-chip-list">
                        {previewTypes.map((type) => (
                          <span key={type} className="preview-chip">
                            {type}
                          </span>
                        ))}
                      </div>

                      <div className="preview-list">
                        <div className="preview-list-row">
                          <strong>Auth architecture</strong>
                          <span>active</span>
                        </div>
                        <div className="preview-list-row">
                          <strong>Workspace conventions</strong>
                          <span>updated 2h ago</span>
                        </div>
                        <div className="preview-list-row">
                          <strong>Prompt snippets</strong>
                          <span>3 reusable blocks</span>
                        </div>
                      </div>
                    </article>

                    <article className="preview-panel">
                      <div className="preview-panel-header">
                        <span>Prompt Output</span>
                        <span>live</span>
                      </div>
                      <pre className="preview-code">{`You are working inside a typed monorepo.
Use stored architecture notes before changing auth,
workspace, or context-pack generation flows.`}</pre>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="section-heading">
            <span className="section-kicker">Integrated Direction</span>
            <h2>Sharper product surfaces without changing the REMO core</h2>
            <p>
              The app now leans into the cleaner T3 Code visual language while keeping the actual
              product centered on REMO context retrieval, prompt generation, and pack export.
            </p>
          </div>

          <div className="grid grid-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="feature-card">
                  <div className={`feature-icon ${feature.tone}`}>
                    <Icon size={20} strokeWidth={1.7} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-section">
          <div className="section-heading">
            <span className="section-kicker">Workflow</span>
            <h2>Use the same memory source across UI and terminal</h2>
            <p>
              This stays practical: connect REMO, inspect context, export packs, then launch the
              agent flow you already use.
            </p>
          </div>

          <div className="grid grid-3">
            {workflowSteps.map((item) => (
              <article key={item.step} className="workflow-card">
                <span className="workflow-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta-inner">
            <Brain size={36} strokeWidth={1.5} />
            <h2>Give your agents a memory layer, not another blank session</h2>
            <p>
              Open the workspace, connect your key, and start generating packs and prompts from the
              contexts you already keep in REMO.
            </p>
            <div className="hero-actions">
              <Link href="/workspace" className="btn btn-primary">
                Open Workspace
                <ArrowRight size={16} />
              </Link>
              <Link href="/docs" className="btn btn-secondary">
                Read Docs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span>REMO Code • open source context bridge</span>
        <div className="landing-footer-links">
          <a href="https://remo.rocks" target="_blank" rel="noreferrer">
            REMO
          </a>
          <a href="https://github.com/pingdotgg/t3code" target="_blank" rel="noreferrer">
            T3 Code reference
          </a>
          <a href="https://github.com/tripathiadityap/remo-code" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
