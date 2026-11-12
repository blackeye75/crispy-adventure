import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

export const googleEnabled = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

function create() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  return betterAuth({
    // Better Auth owns the user, session, account and verification collections.
    database: mongodbAdapter(new MongoClient(uri).db()),
    // shortcut: no email is sent yet, so there is no address verification and no password reset.
    // Add a mail provider and turn both on before public launch.
    emailAndPassword: { enabled: true },
    socialProviders: googleEnabled()
      ? { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! } }
      : undefined,
    plugins: [nextCookies()], // keep last: lets server code set the session cookie
  });
}

// Built on first use (not at import) so `next build` works without a database, and cached on
// globalThis so dev hot-reload keeps one client.
const cache = globalThis as { _auth?: ReturnType<typeof create> };
export const getAuth = () => (cache._auth ??= create());
