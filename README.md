# REMO Code

Persistent memory for AI coding agents.

`Codex`, `Claude Code`, and similar tools are good at execution. Their weak point is context continuity. Every new session starts with memory loss unless you manually paste project history, architecture, conventions, product goals, and prior decisions back into the prompt.

`REMO Code` fixes that by using [REMO](https://remo.rocks) as the memory layer.

This repo is an open-source bridge between the live REMO API and coding agents. It lets you fetch stored context, turn it into agent-ready packs, generate prompts, and run workflows that stay grounded in the same long-term knowledge instead of starting from zero each time.

## What It Is

REMO Code gives you:

- A typed SDK for talking to REMO
- Agent adapters for `codex`, `claude`, and generic LLM flows
- A CLI for auth, context retrieval, prompt generation, and wrapped runs
- A Next.js web app with landing page, docs, and a visual workspace

The model is simple:

- `REMO` stores and serves context
- `remo-code` fetches, shapes, and injects that context
- `Codex` and `Claude Code` become execution layers on top of persistent memory

## Why Use It

Without a context layer, coding agents are stateless. That leads to:

- repeated prompting
- inconsistent architecture decisions
- weaker long-running sessions
- more hallucinated assumptions about your codebase
- higher friction when switching between tools

With REMO Code, your agents can work from the same memory source:

- project architecture
- requirements and specs
- code snippets
- technical notes
- team conventions
- reusable prompts and context packs

## Current Product Surface

### Web App

The web app includes:

- `/`
  branded landing page for REMO Code
- `/docs`
  product documentation and CLI/SDK usage
- `/workspace`
  REMO connection dashboard
- `/workspace/contexts`
  browsable context viewer
- `/workspace/packs`
  Codex, Claude, and raw JSON pack builder
- `/workspace/prompt`
  prompt generator from REMO context

### CLI

The CLI includes:

- `remo-code auth set-key|get-key|doctor`
- `remo-code contexts list|get|search|create`
- `remo-code prompt generate`
- `remo-code pack build --for codex|claude|generic`
- `remo-code run codex "<task>"`
- `remo-code run claude "<task>"`

### SDK

`@remo-code/sdk` exports:

- `RemoClient({ baseUrl, apiKey, timeoutMs })`
- `listContexts({ type?, active?, collection? })`
- `getContextById({ id })`
- `searchContexts({ q })`
- `createContext({ title, content, type?, collection? })`
- `getCredits()`
- `generatePrompt({ mode?: "full" | "compact" })`
- `buildContextPack({ sources, maxChars, style })`

### Adapters

`@remo-code/adapters` provides:

- `formatForCodex(...)`
- `formatForClaude(...)`
- `formatGeneric(...)`
- `buildCodexWrapper(...)`
- `buildClaudeWrapper(...)`

## Monorepo Layout

```text
remo-code/
  packages/
    sdk/        Core REMO client and context pack builder
    adapters/   Codex and Claude formatting/wrapper helpers
    cli/        Command-line interface
  apps/
    web/        Next.js app
```

Dependency flow:

- `cli -> adapters -> sdk`
- `web -> adapters -> sdk`

## Quick Start

Requirements:

- `Node.js 22+`
- `corepack`

Install:

```bash
corepack pnpm install
corepack pnpm build
```

Set environment variables:

```bash
REMO_BASE_URL=https://remo.rocks
REMO_API_KEY=remo_your_api_key_here
```

## CLI Examples

Authenticate:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code auth set-key remo_your_key
corepack pnpm --filter @remo-code/cli exec remo-code auth doctor
```

List and search contexts:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code contexts list --output json
corepack pnpm --filter @remo-code/cli exec remo-code contexts search "auth"
```

Generate a prompt:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code prompt generate --mode compact
```

Build context packs:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code pack build --for codex
corepack pnpm --filter @remo-code/cli exec remo-code pack build --for claude
```

Run agents with REMO context:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code run codex "Refactor the auth flow"
corepack pnpm --filter @remo-code/cli exec remo-code run claude "Write tests for the REMO client"
```

## Web App Usage

Run locally:

```bash
corepack pnpm --filter @remo-code/web dev
```

Then open:

- `http://localhost:3000`
- `http://localhost:3000/docs`
- `http://localhost:3000/workspace`

Inside the workspace you can:

- connect with a REMO API key
- load contexts from `remo.rocks`
- browse context cards and full content
- generate a system prompt
- build Codex and Claude packs
- copy or download packs for reuse

## Development

Run the standard checks:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## Security Model

- CLI keys are stored in `~/.remo-code/config.json`
- Web keys are stored locally in the browser
- Keys are used only against the REMO API
- The SDK exposes typed API errors and rate-limit metadata

## Why This Repo Matters

Most teams do not need another prompt template. They need a durable context system.

REMO Code is useful when you want:

- one memory layer for multiple coding agents
- less re-explaining across sessions
- better prompt quality from stored project knowledge
- a cleaner workflow than manually pasting long context blocks

If you want `Codex` or `Claude Code` to work with memory instead of amnesia, REMO is the memory system and REMO Code is the bridge.
