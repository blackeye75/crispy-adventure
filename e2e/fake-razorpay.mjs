// A stand-in for api.razorpay.com during end-to-end tests: just the three calls the app makes.
import { createServer } from "node:http";

const PRICES = { plan_e2e_monthly: 5000, plan_e2e_yearly: 50000 };
let n = 0;

createServer((req, res) => {
  const send = (status, body) => res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(body));
  const plan = /^\/plans\/(\w+)$/.exec(req.url);
  if (req.url === "/health") return send(200, {});
  if (plan && PRICES[plan[1]]) return send(200, { id: plan[1], period: plan[1].includes("year") ? "yearly" : "monthly", interval: 1, item: { amount: PRICES[plan[1]], currency: "INR" } });
  if (req.method === "POST" && req.url === "/subscriptions") return send(200, { id: `sub_e2e_${Date.now()}_${n++}`, status: "created" });
  const cancel = /^\/subscriptions\/(\w+)\/cancel$/.exec(req.url);
  if (req.method === "POST" && cancel) return send(200, { id: cancel[1], status: "active" });
  send(404, { error: { description: "not found" } });
}).listen(4010);
