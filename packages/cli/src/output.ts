export type OutputFormat = "text" | "json" | "md";

export function parseOutput(value?: string): OutputFormat {
  if (value === "json" || value === "md") return value;
  return "text";
}

export function printOutput(data: unknown, format: OutputFormat): void {
  if (format === "json") {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (format === "md") {
    if (typeof data === "string") {
      console.log(data);
      return;
    }

    if (Array.isArray(data)) {
      for (const item of data) {
        console.log(`- ${JSON.stringify(item)}`);
      }
      return;
    }

    console.log(`\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``);
    return;
  }

  if (typeof data === "string") {
    console.log(data);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}
