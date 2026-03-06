import Link from "next/link";
import {
  ArrowRight,
  Code,
  Zap,
  Terminal,
  LayoutDashboard,
  Shield,
  GitBranch,
  Brain,
  Github,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { RemoLogo } from "../components/icons/remo-logo";

export default function HomePage() {
  return (
    <div className="landing">
      {/* ── Nav ── */}
      <nav className="landing-nav">
        <Link href="/" className="landing-nav-logo">
          <RemoLogo size={26} />
          REMO Code
        </Link>
        <div className="landing-nav-links">
          <a
            href="https://remo.rocks"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            remo.rocks
          </a>
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

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="hero-badge animate-in">
          <Zap size={14} />
          Open Source Context Bridge
        </div>

        <h1 className="hero-title animate-in animate-in-delay-1">
          Persistent memory for{" "}
          <span className="gradient-text">AI coding agents</span>
        </h1>

        <p className="hero-subtitle animate-in animate-in-delay-2">
          Give Codex and Claude long-term context about your codebase,
          architecture, and goals. Stop re-explaining everything every session.
        </p>

        <div className="hero-actions animate-in animate-in-delay-3">
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

        {/* ── Hero terminal ── */}
        <div className="hero-terminal animate-in animate-in-delay-3">
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">Terminal</span>
              <span />
            </div>
            <div className="terminal-body">
              <pre>
                <span className="cmd-comment"># Install remo-code CLI</span>
                {"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">pnpm install &amp;&amp; pnpm build</span>
                {"\n\n"}
                <span className="cmd-comment"># Authenticate with REMO</span>
                {"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">remo-code auth set-key remo_your_key</span>
                {"\n"}
                <span className="cmd-output">&#10003; API key saved to ~/.remo-code/config.json</span>
                {"\n\n"}
                <span className="cmd-comment"># Build context pack for Codex</span>
                {"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">remo-code pack build --for codex</span>
                {"\n"}
                <span className="cmd-output">&#10003; Packed 8 contexts (4,212 chars) &mdash; codex style</span>
                {"\n\n"}
                <span className="cmd-comment"># Run Codex with full context</span>
                {"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">
                  remo-code run codex &quot;Refactor the auth flow&quot;
                </span>
                {"\n"}
                <span className="cmd-output">
                  &gt; Launching codex with REMO context...
                </span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <h2 className="features-title">Built for developer workflows</h2>
        <p className="features-subtitle">
          Everything you need to give AI agents persistent, structured context.
        </p>

        <div className="grid grid-3" style={{ gap: "1.25rem" }}>
          <div className="feature-card">
            <div className="feature-icon purple">
              <Code size={22} strokeWidth={1.5} />
            </div>
            <h3>Context SDK</h3>
            <p>
              TypeScript SDK with typed errors, rate-limit handling, and
              full CRUD for your REMO contexts.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">
              <Zap size={22} strokeWidth={1.5} />
            </div>
            <h3>Agent Adapters</h3>
            <p>
              Format context packs optimized for Codex, Claude, or any
              generic LLM with a single function call.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <Terminal size={22} strokeWidth={1.5} />
            </div>
            <h3>Powerful CLI</h3>
            <p>
              Full command-line interface for auth, context management,
              prompt generation, and wrapped agent execution.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">
              <LayoutDashboard size={22} strokeWidth={1.5} />
            </div>
            <h3>Web Workspace</h3>
            <p>
              Visual dashboard to browse contexts, generate prompts, and
              preview context packs in real time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <Shield size={22} strokeWidth={1.5} />
            </div>
            <h3>Secure by Default</h3>
            <p>
              API keys stored locally, rate-limit aware, with typed errors
              and zero dependencies in the SDK.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">
              <GitBranch size={22} strokeWidth={1.5} />
            </div>
            <h3>Open Source</h3>
            <p>
              MIT licensed, monorepo architecture, fully typed TypeScript
              from CLI to web. Built to extend.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <div style={{ marginBottom: "1.25rem" }}>
          <Brain size={40} strokeWidth={1.5} style={{ color: "var(--accent)", opacity: 0.7 }} />
        </div>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.5rem" }}>
          Ready to give your agents memory?
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          Get started in under two minutes with a free REMO API key.
        </p>
        <div className="flex items-center" style={{ justifyContent: "center", gap: "0.75rem" }}>
          <Link href="/workspace" className="btn btn-primary">
            Open Workspace
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://remo.rocks"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            Create Account
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        REMO Code &middot; Open Source &middot; Powered by{" "}
        <a href="https://remo.rocks" target="_blank" rel="noreferrer">
          REMO
        </a>{" "}
        &middot;{" "}
        <a
          href="https://github.com/tripathiadityap/remo-code"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
