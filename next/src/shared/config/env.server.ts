import "server-only";

// Server-only environment. Never imported into client bundles (server-only throws if it is).
// Typed + validated at first read; no secrets are exposed to the client.
const NODE_ENVS = ["development", "production", "test"] as const;
type NodeEnv = (typeof NODE_ENVS)[number];

export interface ServerEnv {
  nodeEnv: NodeEnv;
  port: number;
}

function isNodeEnv(value: string): value is NodeEnv {
  return (NODE_ENVS as readonly string[]).includes(value);
}

// Default parameters supply the fallbacks (no reassignment). A default applies only when the
// argument is `undefined`, so an empty string stays invalid.
function parseNodeEnv(raw: string = "development"): NodeEnv {
  if (!isNodeEnv(raw)) {
    throw new Error(`Invalid NODE_ENV: "${raw}" must be one of ${NODE_ENVS.join(", ")}`);
  }
  return raw; // narrowed by the guard — no cast
}

function parsePort(raw: string = "3000"): number {
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT env: "${raw}" must be an integer in 1..65535`);
  }
  return port;
}

function readServerEnv(): ServerEnv {
  return { nodeEnv: parseNodeEnv(process.env.NODE_ENV), port: parsePort(process.env.PORT) };
}

// Exported factory so tests can assert validation without process-global coupling.
export { readServerEnv };

export const serverEnv: ServerEnv = readServerEnv();
