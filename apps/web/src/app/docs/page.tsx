import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  Terminal,
  Layers,
  Package,
  Sparkles,
  Shield,
  ExternalLink,
  Github,
} from "lucide-react";
import { RemoLogo } from "../../components/icons/remo-logo";

export default function DocsPage() {
  return (
    <div className="landing">
      {/* ── Nav ── */}
      <nav className="landing-nav">
        <Link href="/" className="landing-nav-logo">
          <RemoLogo size={26} />
          REMO Code
        </Link>
        <div className="landing-nav-links">
          <Link href="/" className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Home
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

      {/* ── Content ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 2rem 4rem" }}>
        <div className="flex items-center gap-sm mb-lg">
          <BookOpen size={24} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
          <h1 style={{ fontSize: "2rem" }}>Documentation</h1>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
          REMO Code is an open-source context bridge for AI coding agents.
          It connects to <a href="https://remo.rocks" target="_blank" rel="noreferrer">remo.rocks</a> to
          give Codex and Claude persistent memory about your codebase, architecture, and goals.
        </p>

        {/* ── Overview ── */}
        <Section
          icon={<Layers size={20} strokeWidth={1.5} />}
          title="Overview"
        >
          <p>
            AI coding agents like OpenAI Codex and Claude Code have no persistent memory between sessions.
            Every time you start a new session, you re-explain your project structure, coding conventions,
            and goals. REMO Code solves this by acting as a middleware that fetches your stored contexts
            from the REMO API and injects them into your agent sessions automatically.
          </p>
        </Section>

        {/* ── Architecture ── */}
        <Section
          icon={<Code size={20} strokeWidth={1.5} />}
          title="Architecture"
        >
          <p>REMO Code is a pnpm monorepo with four packages:</p>
          <div className="terminal mt-md" style={{ marginBottom: "1rem" }}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">Project Structure</span>
              <span />
            </div>
            <div className="terminal-body">
              <pre>{`remo-code/
  packages/
    sdk/        @remo-code/sdk       Core TypeScript SDK
    adapters/   @remo-code/adapters  Codex/Claude formatters
    cli/        @remo-code/cli       Command-line interface
  apps/
    web/        @remo-code/web       Next.js web workspace`}</pre>
            </div>
          </div>
          <p>
            <strong>Dependency graph:</strong> cli &rarr; adapters &rarr; sdk, web &rarr; adapters &rarr; sdk
          </p>
        </Section>

        {/* ── Getting Started ── */}
        <Section
          icon={<Terminal size={20} strokeWidth={1.5} />}
          title="Getting Started"
        >
          <p>Prerequisites: Node.js 22+, pnpm 10+ (via corepack).</p>
          <div className="terminal mt-md" style={{ marginBottom: "1rem" }}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">Installation</span>
              <span />
            </div>
            <div className="terminal-body">
              <pre>
                <span className="cmd-comment"># Clone and install</span>{"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">git clone https://github.com/tripathiadityap/remo-code.git</span>{"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">cd remo-code</span>{"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">corepack pnpm install</span>{"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">corepack pnpm build</span>{"\n\n"}
                <span className="cmd-comment"># Configure your REMO API key</span>{"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">remo-code auth set-key remo_your_key</span>{"\n"}
                <span className="cmd-output">&#10003; API key saved to ~/.remo-code/config.json</span>{"\n\n"}
                <span className="cmd-comment"># Verify connection</span>{"\n"}
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">remo-code auth doctor</span>{"\n"}
                <span className="cmd-output">&#10003; API key valid, connected to remo.rocks</span>
              </pre>
            </div>
          </div>
          <p>
            Get your API key from <a href="https://remo.rocks" target="_blank" rel="noreferrer">remo.rocks</a>.
            Sign up for a free account and generate a key from your dashboard.
          </p>
        </Section>

        {/* ── SDK ── */}
        <Section
          icon={<Code size={20} strokeWidth={1.5} />}
          title="SDK (@remo-code/sdk)"
        >
          <p>The core TypeScript SDK provides a typed client for the REMO API.</p>
          <div className="terminal mt-md" style={{ marginBottom: "1rem" }}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">SDK Usage</span>
              <span />
            </div>
            <div className="terminal-body">
              <pre>{`import { RemoClient } from "@remo-code/sdk";

const client = new RemoClient({
  apiKey: "remo_your_key",
  baseUrl: "https://remo.rocks",  // default
});

// List all contexts
const contexts = await client.listContexts();

// Search contexts
const results = await client.searchContexts({ q: "auth" });

// Get all contexts with full content
const full = await client.getAllContexts();

// Generate a system prompt
const prompt = await client.generatePrompt({ mode: "full" });

// Build a context pack
const pack = await client.buildContextPack({
  sourceType: "codex",
  maxChars: 12000,
});`}</pre>
            </div>
          </div>
          <p>
            Key features: typed errors (<code>RemoApiError</code>), rate-limit parsing,
            context pack builder with multiple output styles (codex, claude, generic).
          </p>
        </Section>

        {/* ── CLI ── */}
        <Section
          icon={<Terminal size={20} strokeWidth={1.5} />}
          title="CLI Commands"
        >
          <div className="terminal mt-md" style={{ marginBottom: "1rem" }}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">CLI Reference</span>
              <span />
            </div>
            <div className="terminal-body">
              <pre>{`# Authentication
remo-code auth set-key <apiKey> [--base-url <url>]
remo-code auth get-key [--full]
remo-code auth doctor

# Context Management
remo-code contexts list [--type] [--active] [--collection] [--output text|json|md]
remo-code contexts get <id> [--output]
remo-code contexts search <query> [--output]
remo-code contexts create --title --content [--type] [--collection]

# Prompt Generation
remo-code prompt generate [--mode full|compact] [--output]

# Pack Building
remo-code pack build [--for codex|claude|generic] [--max-chars 12000]

# Run Agents with Context
remo-code run codex "<task>" [--max-chars] [--print-only]
remo-code run claude "<task>" [--max-chars] [--print-only]`}</pre>
            </div>
          </div>
        </Section>

        {/* ── Adapters ── */}
        <Section
          icon={<Package size={20} strokeWidth={1.5} />}
          title="Adapters (@remo-code/adapters)"
        >
          <p>
            Thin wrappers over the SDK that format context packs for specific agents.
          </p>
          <div className="terminal mt-md" style={{ marginBottom: "1rem" }}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">Adapter Usage</span>
              <span />
            </div>
            <div className="terminal-body">
              <pre>{`import { formatForCodex, formatForClaude } from "@remo-code/adapters";

// Format for Codex (## [type] title + fenced code)
const codexPack = formatForCodex(contexts, 12000);

// Format for Claude (## title (type) + prose)
const claudePack = formatForClaude(contexts, 12000);

// Build wrapper commands
import { buildCodexWrapper, buildClaudeWrapper } from "@remo-code/adapters";

const cmd = buildCodexWrapper("Refactor auth", codexPack);
// cmd.command = "codex"
// cmd.args = ["<combined prompt>"]`}</pre>
            </div>
          </div>
        </Section>

        {/* ── Web Workspace ── */}
        <Section
          icon={<Sparkles size={20} strokeWidth={1.5} />}
          title="Web Workspace"
        >
          <p>
            The web workspace provides a visual interface for managing your REMO contexts.
            It runs on Next.js and connects directly to the REMO API from your browser.
          </p>
          <div className="terminal mt-md" style={{ marginBottom: "1rem" }}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">Run locally</span>
              <span />
            </div>
            <div className="terminal-body">
              <pre>
                <span className="cmd-prefix">$ </span>
                <span className="cmd-text">corepack pnpm --filter @remo-code/web dev</span>{"\n"}
                <span className="cmd-output">&#10003; Ready on http://localhost:3000</span>
              </pre>
            </div>
          </div>
          <p>Features:</p>
          <ul style={{ color: "var(--text-secondary)", paddingLeft: "1.5rem", lineHeight: 2 }}>
            <li>Browse and search all your REMO contexts</li>
            <li>Generate system prompts from your context library</li>
            <li>Build and preview context packs (Codex, Claude, Raw JSON)</li>
            <li>Copy or download packs for use in your workflow</li>
            <li>API key stored locally in your browser (never sent to third parties)</li>
          </ul>
        </Section>

        {/* ── Security ── */}
        <Section
          icon={<Shield size={20} strokeWidth={1.5} />}
          title="Security"
        >
          <ul style={{ color: "var(--text-secondary)", paddingLeft: "1.5rem", lineHeight: 2 }}>
            <li>API keys are stored locally (<code>~/.remo-code/config.json</code> for CLI, <code>localStorage</code> for web)</li>
            <li>Keys are never sent to any third-party service, only to the REMO API</li>
            <li>The SDK includes typed error handling and rate-limit awareness</li>
            <li>Zero external runtime dependencies in the SDK package</li>
            <li>All packages are fully typed with strict TypeScript</li>
          </ul>
        </Section>

        {/* ── Links ── */}
        <div className="card mt-xl" style={{ textAlign: "center", padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Resources</h3>
          <div className="flex items-center gap-md" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://remo.rocks"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
              remo.rocks
            </a>
            <a
              href="https://github.com/tripathiadityap/remo-code"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <Github size={16} strokeWidth={1.5} />
              GitHub
            </a>
            <Link href="/workspace" className="btn btn-primary">
              Open Workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

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

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2
        className="flex items-center gap-sm"
        style={{
          fontSize: "1.25rem",
          marginBottom: "0.75rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        {title}
      </h2>
      <div style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );
}
