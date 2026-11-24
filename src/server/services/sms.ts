// Mobile-number sign-in codes through Twilio Verify: Twilio creates, sends and checks the code, so none is stored here.
export const smsEnabled = () => Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID);

async function verify(path: "Verifications" | "VerificationCheck", form: Record<string, string>) {
  if (!smsEnabled()) throw new Error("SMS is not set up: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID are needed");
  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
  return fetch(`${process.env.TWILIO_VERIFY_URL ?? "https://verify.twilio.com"}/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/${path}`, {
    method: "POST",
    headers: { authorization: `Basic ${auth}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(form),
    signal: AbortSignal.timeout(15_000),
  });
}

export async function startPhoneVerification(phoneNumber: string) {
  const res = await verify("Verifications", { To: phoneNumber, Channel: "sms" });
  if (!res.ok) {
    console.error("Twilio error", res.status, await res.text().catch(() => ""));
    throw new Error("The code could not be sent");
  }
}

/** True only if Twilio approves this code for this number. An expired or unknown verification is a 404: not approved. */
export async function checkPhoneVerification(phoneNumber: string, code: string): Promise<boolean> {
  const res = await verify("VerificationCheck", { To: phoneNumber, Code: code });
  if (res.status === 404) return false;
  if (!res.ok) {
    console.error("Twilio error", res.status, await res.text().catch(() => ""));
    throw new Error("The code could not be checked");
  }
  return ((await res.json()) as { status?: string }).status === "approved";
}
