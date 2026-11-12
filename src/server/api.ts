// The one response shape for /api/v1: { data } on success, { error: { code, message } } on failure.
export const ok = <T>(data: T) => Response.json({ data });
export const fail = (status: number, code: string, message: string) => Response.json({ error: { code, message } }, { status });
