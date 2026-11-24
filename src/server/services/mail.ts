// Sends the account emails (verify your address, reset your password) through Resend's HTTP API.
const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

export async function sendEmail(to: string, subject: string, text: string, html: string) {
  if (!emailEnabled()) throw new Error("Email is not set up: RESEND_API_KEY and EMAIL_FROM are needed");
  const res = await fetch(`${process.env.RESEND_API_URL ?? "https://api.resend.com"}/emails`, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, text, html }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text().catch(() => ""));
    throw new Error("The email could not be sent");
  }
}

/** A short email with one button, in plain text and HTML. */
export function linkEmail(to: string, subject: string, intro: string, button: string, url: string, outro: string) {
  const text = `${intro}\n\n${button}: ${url}\n\n${outro}\n\nFretkey`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px;color:#1c1b17">
<p style="font-size:20px;font-weight:600">Fretkey</p>
<p>${escape(intro)}</p>
<p><a href="${escape(url)}" style="display:inline-block;background:#ecb23f;color:#12110e;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">${escape(button)}</a></p>
<p style="color:#6b6455;font-size:14px">${escape(outro)}</p>
<p style="color:#6b6455;font-size:12px">If the button does not work, copy this link into your browser:<br>${escape(url)}</p>
</div>`;
  return sendEmail(to, subject, text, html);
}
