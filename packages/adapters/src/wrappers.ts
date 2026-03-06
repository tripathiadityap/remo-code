export interface WrapperCommand {
  command: string;
  args: string[];
  printable: string;
}

function shellEscape(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function toPrintable(command: string, args: string[]): string {
  const joined = [command, ...args.map(shellEscape)].join(" ");
  return joined;
}

export function buildCodexWrapper(task: string, contextPack: string): WrapperCommand {
  const combined = `${task.trim()}\n\n${contextPack}`.trim();
  const args = [combined];
  return {
    command: "codex",
    args,
    printable: toPrintable("codex", args),
  };
}

export function buildClaudeWrapper(task: string, contextPack: string): WrapperCommand {
  const combined = `${task.trim()}\n\n${contextPack}`.trim();
  const args = [combined];
  return {
    command: "claude",
    args,
    printable: toPrintable("claude", args),
  };
}
