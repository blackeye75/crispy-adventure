/** Call /api/v1 and unwrap `{ data }`. Throws an Error whose message is safe to show the user. */
export async function api<T>(path: string, init: { method?: "GET" | "POST" | "PATCH"; body?: unknown } = {}): Promise<T> {
  const offline = "Could not reach Fretkey. Check your connection and try again.";
  const res = await fetch(`/api/v1${path}`, {
    method: init.method ?? "GET",
    headers: init.body === undefined ? undefined : { "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  }).catch(() => {
    throw new Error(offline);
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) throw new Error(json?.error?.message ?? offline);
  return json.data as T;
}

/**
 * Full page load. Used whenever the session or profile has just changed: the client router may
 * hold prefetched pages from before (for example a redirect to sign-in) and would replay them.
 */
export function hardNavigate(path: string) {
  window.location.assign(path);
}
