// Typed client for the FastAPI app-store endpoints. Server-only.
import "server-only";

const BASE = (process.env.FASTAPI_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const TIMEOUT_MS = 15_000;

export class BackendError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "BackendError";
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/api/v1/appstore${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new BackendError(`Backend ${method} ${path} failed: ${res.status} ${text}`.trim(), res.status);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const backend = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
