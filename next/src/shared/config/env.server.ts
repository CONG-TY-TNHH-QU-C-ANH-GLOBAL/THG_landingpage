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

function parseNodeEnv(raw: string | undefined): NodeEnv {
  const value = raw ?? "development"; // development default
  if (!isNodeEnv(value)) {
    throw new Error(`Invalid NODE_ENV: "${value}" must be one of ${NODE_ENVS.join(", ")}`);
  }
  return value; // narrowed by the guard — no cast
}

function parsePort(raw: string | undefined): number {
  const value = raw ?? "3000";
  const port = Number(value);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT env: "${value}" must be an integer in 1..65535`);
  }
  return port;
}

function readServerEnv(): ServerEnv {
  return { nodeEnv: parseNodeEnv(process.env.NODE_ENV), port: parsePort(process.env.PORT) };
}

// Exported factory so tests can assert validation without process-global coupling.
export { readServerEnv };

export const serverEnv: ServerEnv = readServerEnv();
