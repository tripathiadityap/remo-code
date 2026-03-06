# Remo Code

Remo Code is an open-source context layer for agentic coding.

`Codex`, `Claude Code`, and similar tools are strong at reasoning, editing, and execution. Their weak point is persistent memory. They forget your product, your architecture, your preferences, your research, and your prior decisions unless you keep re-injecting that context every time.

`REMO` fixes that.

Remo Code connects to live REMO at [remo.rocks](https://remo.rocks) and turns your stored context into usable runtime memory for coding agents. Instead of starting every session from zero, you can route your work through REMO and give your tools a stable context backbone.

## Why This Exists

Most coding agents still operate like this:

1. You open a tool.
2. You paste a task.
3. You re-explain the codebase, architecture, goals, constraints, and history.
4. The tool does good local work but loses the bigger picture again next session.

That is the memory problem.

Remo Code is the practical fix:

- `REMO` stores and serves context.
- `remo-code` fetches and formats that context.
- `Codex` and `Claude Code` consume it as a grounded runtime pack.

The result is better continuity, less repeated prompting, and fewer context-loss errors.

## What Remo Code Does

- Connects to REMO with an API key
- Pulls stored context from `https://remo.rocks`
- Builds agent-ready context packs for `Codex`, `Claude`, or generic LLM workflows
- Provides a CLI for search, retrieval, prompt generation, and wrapped runs
- Provides a web workspace for browsing context and previewing packs
- Exposes a reusable TypeScript SDK for building more integrations

## Positioning

Remo Code is not trying to replace the best coding models.

It is the memory and context system that makes them more useful.

If `Codex` or `Claude Code` is the execution engine, `REMO` is the long-term memory layer.

## Repo Structure

- `packages/sdk`
  Typed `RemoClient`, typed errors, rate-limit metadata, and context-pack generation.
- `packages/adapters`
  Formatters and wrappers for `codex`, `claude`, and generic prompt injection.
- `packages/cli`
  The `remo-code` CLI for auth, contexts, prompt generation, packs, and wrapped runs.
- `apps/web`
  Next.js app with landing docs and a workspace for loading contexts from REMO.

## Core Workflows

### 1. Use REMO as memory for Codex

```bash
remo-code pack build --for codex
remo-code run codex "Refactor the auth middleware and preserve existing behavior"
```

### 2. Use REMO as memory for Claude Code

```bash
remo-code pack build --for claude
remo-code run claude "Add integration tests for the REMO client"
```

### 3. Use REMO directly as context infrastructure

```bash
remo-code contexts list --output json
remo-code contexts search "billing"
remo-code prompt generate --mode compact
```

## Installation

Requirements:

- `Node.js 22+`
- `corepack`

Install dependencies:

```bash
corepack pnpm install
```

## Environment

Create a local env file from `.env.example` or export the variables directly:

```bash
REMO_BASE_URL=https://remo.rocks
REMO_API_KEY=remo_your_api_key_here
```

## Development Commands

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm dev
```

## CLI Quickstart

Build the CLI:

```bash
corepack pnpm --filter @remo-code/cli build
```

Set your API key:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code auth set-key remo_your_api_key
```

Check connectivity:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code auth doctor
```

List contexts:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code contexts list --output json
```

Generate a Codex pack:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code pack build --for codex
```

Run Codex with REMO context:

```bash
corepack pnpm --filter @remo-code/cli exec remo-code run codex "Refactor the auth middleware"
```

## CLI Surface

- `remo-code auth set-key|get-key|doctor`
- `remo-code contexts list|get|search|create`
- `remo-code prompt generate`
- `remo-code pack build --for codex|claude|generic`
- `remo-code run codex "<task>"`
- `remo-code run claude "<task>"`

## SDK API

`@remo-code/sdk` exports:

- `RemoClient({ baseUrl, apiKey, timeoutMs })`
- `listContexts({ type?, active?, collection? })`
- `getContextById({ id })`
- `searchContexts({ q })`
- `createContext({ title, content, type?, collection? })`
- `getCredits()`
- `generatePrompt({ mode?: "full" | "compact" })`
- `buildContextPack({ sources, maxChars, style })`

## Web App

Run the web app:

```bash
corepack pnpm --filter @remo-code/web dev
```

Routes:

- `/`
  Project landing page, positioning, quickstart, and API usage
- `/workspace`
  API-key workspace for loading contexts, searching, generating prompts, and previewing `Codex`, `Claude`, and raw JSON packs

## CI

GitHub Actions runs:

1. `lint`
2. `typecheck`
3. `test`
4. `build`

## Why Teams Will Use This

- Fewer repeated prompts
- Better continuity across sessions
- Better grounding for code generation and refactors
- One context layer that can serve multiple agent runtimes
- A cleaner architecture than stuffing long prompt files into each tool manually

If you want coding agents with memory, use REMO as the memory system and Remo Code as the bridge.
