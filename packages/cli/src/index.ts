#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { Command } from "commander";
import { buildClaudeWrapper, buildCodexWrapper, formatForClaude, formatForCodex, formatGeneric } from "@remo-code/adapters";
import { RemoApiError, RemoClient } from "@remo-code/sdk";
import { maskApiKey, readConfig, resolveApiConfig, writeConfig } from "./config.js";
import { parseOutput, printOutput } from "./output.js";

function parseBoolean(value?: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

async function getClient(): Promise<RemoClient> {
  const stored = await readConfig();
  const resolved = resolveApiConfig(stored);

  return new RemoClient({
    apiKey: resolved.apiKey,
    baseUrl: resolved.baseUrl,
  });
}

function withErrorHandling(handler: (...args: any[]) => Promise<void>) {
  return async (...args: any[]) => {
    try {
      await handler(...args);
    } catch (error) {
      if (error instanceof RemoApiError) {
        console.error(`REMO API Error [${error.status} ${error.code ?? "UNKNOWN"}]: ${error.message}`);
        if (error.rateLimit?.retryAfterSec) {
          console.error(`Retry after: ${error.rateLimit.retryAfterSec}s`);
        }
        process.exitCode = 1;
        return;
      }

      console.error((error as Error).message);
      process.exitCode = 1;
    }
  };
}

const program = new Command();
program
  .name("remo-code")
  .description("REMO context bridge for Codex and Claude")
  .version("0.1.0");

const auth = program.command("auth").description("Manage REMO API configuration");
auth
  .command("set-key")
  .argument("<apiKey>")
  .option("--base-url <url>", "Override REMO base URL")
  .action(withErrorHandling(async (apiKey: string, opts: { baseUrl?: string }) => {
    await writeConfig({ apiKey, baseUrl: opts.baseUrl });
    console.log("Saved REMO API key.");
  }));

auth
  .command("get-key")
  .option("--full", "Print full key")
  .action(withErrorHandling(async (opts: { full?: boolean }) => {
    const stored = await readConfig();
    const resolved = resolveApiConfig(stored);

    if (!resolved.apiKey) {
      console.log("No API key configured.");
      return;
    }

    console.log(opts.full ? resolved.apiKey : maskApiKey(resolved.apiKey));
  }));

auth
  .command("doctor")
  .action(withErrorHandling(async () => {
    const client = await getClient();
    const credits = await client.getCredits();
    console.log(`Connection OK. Credits: ${credits.credits}`);
  }));

const contexts = program.command("contexts").description("Context management commands");
contexts
  .command("list")
  .option("--type <type>")
  .option("--active <bool>", "true or false")
  .option("--collection <name>")
  .option("--output <format>", "text|json|md", "text")
  .action(withErrorHandling(async (opts: { type?: string; active?: string; collection?: string; output?: string }) => {
    const client = await getClient();
    const data = await client.listContexts({
      type: opts.type,
      active: parseBoolean(opts.active),
      collection: opts.collection,
    });

    printOutput(data, parseOutput(opts.output));
  }));

contexts
  .command("get")
  .argument("<id>")
  .option("--output <format>", "text|json|md", "json")
  .action(withErrorHandling(async (id: string, opts: { output?: string }) => {
    const client = await getClient();
    const data = await client.getContextById({ id });
    printOutput(data, parseOutput(opts.output));
  }));

contexts
  .command("search")
  .argument("<query>")
  .option("--output <format>", "text|json|md", "text")
  .action(withErrorHandling(async (query: string, opts: { output?: string }) => {
    const client = await getClient();
    const data = await client.searchContexts({ q: query });
    printOutput(data, parseOutput(opts.output));
  }));

contexts
  .command("create")
  .requiredOption("--title <title>")
  .requiredOption("--content <content>")
  .option("--type <type>", "Context type", "custom")
  .option("--collection <name>")
  .option("--output <format>", "text|json|md", "json")
  .action(withErrorHandling(async (opts: { title: string; content: string; type?: string; collection?: string; output?: string }) => {
    const client = await getClient();
    const data = await client.createContext({
      title: opts.title,
      content: opts.content,
      type: opts.type,
      collection: opts.collection,
    });
    printOutput(data, parseOutput(opts.output));
  }));

program
  .command("prompt")
  .description("Prompt generation")
  .command("generate")
  .option("--mode <mode>", "full|compact", "full")
  .option("--output <format>", "text|json|md", "text")
  .action(withErrorHandling(async (opts: { mode?: "full" | "compact"; output?: string }) => {
    const client = await getClient();
    const prompt = await client.generatePrompt({ mode: opts.mode });
    printOutput(prompt, parseOutput(opts.output));
  }));

program
  .command("pack")
  .description("Build context packs")
  .command("build")
  .option("--for <style>", "codex|claude|generic", "generic")
  .option("--max-chars <n>", "max output characters", "12000")
  .option("--output <format>", "text|json|md", "text")
  .action(withErrorHandling(async (opts: { for?: "codex" | "claude" | "generic"; maxChars?: string; output?: string }) => {
    const client = await getClient();
    const contexts = await client.getAllContexts();

    const maxChars = Number(opts.maxChars ?? "12000");
    const pack = opts.for === "codex"
      ? formatForCodex(contexts, maxChars)
      : opts.for === "claude"
        ? formatForClaude(contexts, maxChars)
        : formatGeneric(contexts, maxChars);

    if (parseOutput(opts.output) === "text") {
      console.log(pack.text);
      return;
    }

    printOutput(pack, parseOutput(opts.output));
  }));

const run = program.command("run").description("Run wrapped Codex/Claude commands");

run
  .command("codex")
  .argument("<task...>")
  .option("--max-chars <n>", "max context characters", "12000")
  .option("--print-only", "Print generated command but do not execute")
  .action(withErrorHandling(async (taskParts: string[], opts: { maxChars?: string; printOnly?: boolean }) => {
    const task = taskParts.join(" ").trim();
    const client = await getClient();
    const contexts = await client.getAllContexts();
    const pack = formatForCodex(contexts, Number(opts.maxChars ?? "12000"));
    const wrapper = buildCodexWrapper(task, pack.text);

    if (opts.printOnly) {
      console.log(wrapper.printable);
      return;
    }

    const result = spawnSync(wrapper.command, wrapper.args, { stdio: "inherit" });

    if (result.error) {
      console.error(`Failed to execute '${wrapper.command}'. Is it installed?`);
      process.exitCode = 1;
      return;
    }

    process.exitCode = result.status ?? 0;
  }));

run
  .command("claude")
  .argument("<task...>")
  .option("--max-chars <n>", "max context characters", "12000")
  .option("--print-only", "Print generated command but do not execute")
  .action(withErrorHandling(async (taskParts: string[], opts: { maxChars?: string; printOnly?: boolean }) => {
    const task = taskParts.join(" ").trim();
    const client = await getClient();
    const contexts = await client.getAllContexts();
    const pack = formatForClaude(contexts, Number(opts.maxChars ?? "12000"));
    const wrapper = buildClaudeWrapper(task, pack.text);

    if (opts.printOnly) {
      console.log(wrapper.printable);
      return;
    }

    const result = spawnSync(wrapper.command, wrapper.args, { stdio: "inherit" });

    if (result.error) {
      console.error(`Failed to execute '${wrapper.command}'. Is it installed?`);
      process.exitCode = 1;
      return;
    }

    process.exitCode = result.status ?? 0;
  }));

program.parseAsync(process.argv);
