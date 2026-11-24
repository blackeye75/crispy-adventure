import { defineConfig, devices } from "@playwright/test";

export const MONGODB_URI = process.env.MONGODB_E2E_URI ?? "mongodb://127.0.0.1:27017/fretkey_e2e";
export const WEBHOOK_SECRET = "e2e-webhook-secret";
export const PADDLE_WEBHOOK_SECRET = "e2e-paddle-webhook-secret";

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 }, // the dev server compiles each page on first visit
  use: { baseURL: "http://localhost:3000" },
  projects: [
    { name: "desktop", use: devices["Desktop Chrome"] },
    { name: "phone-360", use: { ...devices["Pixel 5"], viewport: { width: 360, height: 740 } } },
  ],
  // Needs a local MongoDB: docker run -d -p 27017:27017 mongo:7
  webServer: [
    { command: "node e2e/fake-razorpay.mjs", url: "http://localhost:4010/health", reuseExistingServer: !process.env.CI },
    {
      command: "npm run seed && npm run dev",
      timeout: 180_000, // a cold first compile can be slow
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      env: {
        MONGODB_URI,
        BETTER_AUTH_SECRET: "e2e-only-secret-not-used-anywhere-else",
        BETTER_AUTH_URL: "http://localhost:3000",
        RAZORPAY_API_URL: "http://localhost:4010", // never the real Razorpay
        RAZORPAY_KEY_ID: "rzp_test_e2e",
        RAZORPAY_KEY_SECRET: "e2e-key-secret",
        RAZORPAY_WEBHOOK_SECRET: WEBHOOK_SECRET,
        RAZORPAY_PLAN_MONTHLY: "plan_e2e_monthly",
        RAZORPAY_PLAN_YEARLY: "plan_e2e_yearly",
        RESEND_API_URL: "http://localhost:4010", // emails land in the fake server's outbox
        RESEND_API_KEY: "re_e2e",
        EMAIL_FROM: "Fretkey <hello@example.com>",
        TWILIO_VERIFY_URL: "http://localhost:4010",
        TWILIO_ACCOUNT_SID: "AC_e2e",
        TWILIO_AUTH_TOKEN: "e2e-token",
        TWILIO_VERIFY_SERVICE_SID: "VA_e2e",
        PADDLE_ENV: "sandbox",
        PADDLE_API_URL: "http://localhost:4010", // never the real Paddle
        PADDLE_API_KEY: "pdl_e2e_key",
        PADDLE_CLIENT_TOKEN: "test_e2e_client_token",
        PADDLE_WEBHOOK_SECRET,
        PADDLE_PRICE_MONTHLY: "pri_e2e_monthly",
        PADDLE_PRICE_YEARLY: "pri_e2e_yearly",
      },
    },
  ],
});
