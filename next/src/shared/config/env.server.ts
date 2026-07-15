import "server-only";

// Server-only environment. Never imported into client bundles (server-only throws if it is).
// Typed + validated at first read; no secrets are exposed to the client.
export interface ServerEnv {
  nodeEnv: "development" | "production" | "test";
  port: number;
}

function readServerEnv(): ServerEnv {
  const nodeEnv = (process.env.NODE_ENV ?? "development") as ServerEnv["nodeEnv"];
  const rawPort = process.env.PORT ?? "3000";
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT env: "${rawPort}" must be an integer in 1..65535`);
  }
  return { nodeEnv, port };
}

// Exported factory so tests can assert validation without process-global coupling.
export { readServerEnv };

export const serverEnv: ServerEnv = readServerEnv();
