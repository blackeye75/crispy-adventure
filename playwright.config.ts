import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  projects: [
    { name: "desktop", use: devices["Desktop Chrome"] },
    { name: "phone-360", use: { ...devices["Pixel 5"], viewport: { width: 360, height: 740 } } },
  ],
  // Needs a local MongoDB: docker run -d -p 27017:27017 mongo:7
  webServer: {
    command: "npm run seed && npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      MONGODB_URI: process.env.MONGODB_E2E_URI ?? "mongodb://127.0.0.1:27017/fretkey_e2e",
      BETTER_AUTH_SECRET: "e2e-only-secret-not-used-anywhere-else",
      BETTER_AUTH_URL: "http://localhost:3000",
    },
  },
});
