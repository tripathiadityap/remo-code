import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Remo Code</h1>
      <p>
        Open-source context bridge for <code>codex</code> and <code>claude</code>, powered by REMO at{" "}
        <a href="https://remo.rocks" target="_blank" rel="noreferrer">https://remo.rocks</a>.
      </p>

      <div className="grid cols-2" style={{ marginTop: "1rem" }}>
        <section className="card">
          <h2>Quickstart</h2>
          <ol>
            <li>Generate a REMO API key in your REMO account.</li>
            <li>Set environment variables from <code>.env.example</code>.</li>
            <li>Install and run CLI: <code>pnpm --filter @remo-code/cli build</code>.</li>
            <li>Open the workspace and test context retrieval.</li>
          </ol>
          <p>
            <Link href="/workspace">Open Workspace</Link>
          </p>
        </section>

        <section className="card">
          <h2>API Usage</h2>
          <pre>{`# List contexts
remo-code contexts list --output json

# Build codex pack
remo-code pack build --for codex

# Run codex with context
remo-code run codex "Refactor auth flow"`}</pre>
        </section>
      </div>

      <section className="card" style={{ marginTop: "1rem" }}>
        <h2>CLI Install Docs</h2>
        <pre>{`pnpm install
pnpm build

# configure key
remo-code auth set-key remo_your_key

# verify
remo-code auth doctor`}</pre>
      </section>
    </main>
  );
}
