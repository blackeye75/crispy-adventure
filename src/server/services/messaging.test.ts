import { afterEach, expect, test, vi } from "vitest";
import { linkEmail } from "./mail";
import { checkPhoneVerification, startPhoneVerification } from "./sms";

Object.assign(process.env, { RESEND_API_KEY: "re_test", EMAIL_FROM: "Fretkey <hello@example.com>", TWILIO_ACCOUNT_SID: "AC1", TWILIO_AUTH_TOKEN: "tok", TWILIO_VERIFY_SERVICE_SID: "VA1" });
afterEach(() => vi.unstubAllGlobals());

const record = (reply: () => Response) => {
  const calls: { url: string; init: RequestInit }[] = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => (calls.push({ url, init }), reply()));
  return calls;
};

test("account emails go to Resend with the link in both text and HTML, safely escaped", async () => {
  const calls = record(() => Response.json({ id: "e1" }));
  await linkEmail("asha@example.com", "Reset", "Intro <b>", "Choose", "https://fretkey.app/r?token=a&b=c", "Outro");
  expect(calls[0].url).toBe("https://api.resend.com/emails");
  expect(calls[0].init.headers).toMatchObject({ authorization: "Bearer re_test" });
  const body = JSON.parse(String(calls[0].init.body));
  expect(body).toMatchObject({ from: "Fretkey <hello@example.com>", to: ["asha@example.com"], subject: "Reset" });
  expect(body.text).toContain("https://fretkey.app/r?token=a&b=c");
  expect(body.html).toContain('href="https://fretkey.app/r?token=a&amp;b=c"');
  expect(body.html).toContain("Intro &lt;b&gt;");
});

test("a failed email send is an error, not a silent success", async () => {
  record(() => new Response("bad", { status: 422 }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  await expect(linkEmail("a@example.com", "s", "i", "b", "https://x", "o")).rejects.toThrow("could not be sent");
});

test("SMS codes: Twilio Verify starts and checks them; only 'approved' signs in; an expired one is a no", async () => {
  const calls = record(() => Response.json({ status: "pending" }, { status: 201 }));
  await startPhoneVerification("+919876543210");
  expect(calls[0].url).toBe("https://verify.twilio.com/v2/Services/VA1/Verifications");
  expect(calls[0].init.headers).toMatchObject({ authorization: `Basic ${Buffer.from("AC1:tok").toString("base64")}` });
  expect(Object.fromEntries(new URLSearchParams(String(calls[0].init.body)))).toEqual({ To: "+919876543210", Channel: "sms" });

  const check = record(() => Response.json({ status: "approved" }));
  expect(await checkPhoneVerification("+919876543210", "123456")).toBe(true);
  expect(check[0].url).toBe("https://verify.twilio.com/v2/Services/VA1/VerificationCheck");
  expect(Object.fromEntries(new URLSearchParams(String(check[0].init.body)))).toEqual({ To: "+919876543210", Code: "123456" });
  record(() => Response.json({ status: "pending" }));
  expect(await checkPhoneVerification("+919876543210", "000000")).toBe(false);
  record(() => new Response("", { status: 404 }));
  expect(await checkPhoneVerification("+919876543210", "123456")).toBe(false);
});
