// A stand-in for Razorpay, Paddle, Resend and Twilio Verify during end-to-end tests: just the calls the app makes.
// Emails are kept in memory so a test can read its link (GET /outbox?to=…); the only SMS code that passes is 123456.
import { createServer } from "node:http";

const PRICES = { plan_e2e_monthly: 5000, plan_e2e_yearly: 50000 };
const PADDLE_PRICES = { pri_e2e_monthly: "900", pri_e2e_yearly: "9000" };
let n = 0;
const outbox = [];

createServer(async (req, res) => {
  const send = (status, body) => res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(body));
  let raw = "";
  for await (const chunk of req) raw += chunk;
  if (req.method === "POST" && req.url === "/emails") {
    const email = JSON.parse(raw);
    outbox.push({ to: email.to[0], subject: email.subject, text: email.text });
    return send(200, { id: `email_${outbox.length}` });
  }
  if (req.url.startsWith("/outbox?")) {
    const to = new URL(req.url, "http://x").searchParams.get("to");
    const mine = outbox.filter((e) => e.to === to);
    return mine.length ? send(200, mine[mine.length - 1]) : send(404, {});
  }
  if (req.method === "POST" && /^\/v2\/Services\/\w+\/Verifications$/.test(req.url)) return send(201, { status: "pending" });
  if (req.method === "POST" && /^\/v2\/Services\/\w+\/VerificationCheck$/.test(req.url)) return send(200, { status: new URLSearchParams(raw).get("Code") === "123456" ? "approved" : "pending" });
  const plan = /^\/plans\/(\w+)$/.exec(req.url);
  if (req.url === "/health") return send(200, {});
  const paddlePrice = /^\/prices\/(\w+)$/.exec(req.url);
  if (paddlePrice && PADDLE_PRICES[paddlePrice[1]]) return send(200, { data: { id: paddlePrice[1], unit_price: { amount: PADDLE_PRICES[paddlePrice[1]], currency_code: "USD" } } });
  if (plan && PRICES[plan[1]]) return send(200, { id: plan[1], period: plan[1].includes("year") ? "yearly" : "monthly", interval: 1, item: { amount: PRICES[plan[1]], currency: "INR" } });
  if (req.method === "POST" && req.url === "/subscriptions") return send(200, { id: `sub_e2e_${Date.now()}_${n++}`, status: "created" });
  const cancel = /^\/subscriptions\/(\w+)\/cancel$/.exec(req.url);
  if (req.method === "POST" && cancel) return send(200, { id: cancel[1], status: "active" });
  send(404, { error: { description: "not found" } });
}).listen(4010);
