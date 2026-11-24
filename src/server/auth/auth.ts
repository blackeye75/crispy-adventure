import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { isPhoneNumber } from "@/core/schemas/api";
import { emailEnabled, linkEmail } from "../services/mail";
import { checkPhoneVerification, smsEnabled, startPhoneVerification } from "../services/sms";

export { emailEnabled, smsEnabled };
export const googleEnabled = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

function create() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  return betterAuth({
    // Better Auth owns the user, session, account and verification collections.
    database: mongodbAdapter(new MongoClient(uri).db()),
    // With email set up, an address must be verified before it can sign in, and passwords can be reset by email.
    // Without it (local development), both are off, since no email could be delivered.
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: emailEnabled(),
      revokeSessionsOnPasswordReset: true, // a reset signs out every other device
      sendResetPassword: async ({ user, url }) => {
        await linkEmail(user.email, "Reset your Fretkey password", "Someone asked to reset the password for your Fretkey account. If that was you, choose a new one.", "Choose a new password", url, "The link works for one hour. If you did not ask for this, ignore this email; your password stays the same.");
      },
    },
    emailVerification: {
      sendOnSignUp: emailEnabled(),
      sendOnSignIn: emailEnabled(), // an unverified address trying to sign in gets a fresh link
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await linkEmail(user.email, "Confirm your email for Fretkey", `Welcome to Fretkey, ${user.name}. Confirm this is your email address to start learning.`, "Confirm my email", url, "The link works for one hour. If you did not create an account, ignore this email.");
      },
    },
    socialProviders: googleEnabled()
      ? { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! } }
      : undefined,
    plugins: [
      // Sign in (or sign up) with a mobile number and a code by SMS. Twilio Verify sends and checks the code.
      phoneNumber({
        phoneNumberValidator: isPhoneNumber,
        sendOTP: ({ phoneNumber }) => startPhoneVerification(phoneNumber),
        verifyOTP: ({ phoneNumber, code }) => checkPhoneVerification(phoneNumber, code),
        // A new number creates an account. Better Auth needs an email for every user: this placeholder can never receive mail.
        signUpOnVerification: { getTempEmail: (phone) => `${phone.slice(1)}@phone.fretkey.invalid`, getTempName: () => "Fretkey learner" },
      }),
      nextCookies(), // keep last: lets server code set the session cookie
    ],
  });
}

// Built on first use (not at import) so `next build` works without a database, and cached on
// globalThis so dev hot-reload keeps one client.
const cache = globalThis as { _auth?: ReturnType<typeof create> };
export const getAuth = () => (cache._auth ??= create());
