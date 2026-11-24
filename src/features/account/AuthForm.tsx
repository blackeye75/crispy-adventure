"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { isPhoneNumber, normalisePhoneNumber } from "@/core/schemas/api";
import { track } from "@/lib/analytics";
import { hardNavigate } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export const inputClass = "h-12 rounded-md border bg-card px-4 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** email: account emails can be sent (verification and reset are on). phone: sign-in by SMS code is set up. */
type Props = { mode: "sign-in" | "sign-up"; next: string; google: boolean; email?: boolean; phone?: boolean };

export function AuthForm({ mode, next, google, email: emailOn = false, phone = false }: Props) {
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [sentTo, setSentTo] = useState<string>(); // the address a confirmation link was just sent to
  const signUp = mode === "sign-up";
  // False on the server and until this form is interactive. Submitting before then would be a plain
  // browser submit, which must never happen with a password in the form.
  const ready = useSyncExternalStore(() => () => {}, () => true, () => false);

  // onSubmit, not a form action: an action would clear the fields after a failed attempt.
  // method="post" is a second guard: even a plain submit could not put the password in the URL.
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(undefined);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const result = signUp
      ? await authClient.signUp.email({ name: String(form.get("name")).trim(), email, password, callbackURL: next })
      : await authClient.signIn.email({ email, password, callbackURL: next });
    setBusy(false);
    if (result.error) {
      // Signing in with an unconfirmed address sends a fresh link instead of a session.
      if (result.error.code === "EMAIL_NOT_VERIFIED") return setSentTo(email);
      return setError(result.error.message ?? "That did not work. Check your details and try again.");
    }
    if (signUp) track("Sign up");
    if (signUp && !result.data?.token) return setSentTo(email); // confirmation required: no session until the link is opened
    hardNavigate(next);
  };

  const resend = async () => {
    setBusy(true);
    const result = await authClient.sendVerificationEmail({ email: sentTo!, callbackURL: next });
    setBusy(false);
    setError(result.error ? (result.error.message ?? "The email could not be sent. Try again in a minute.") : undefined);
  };

  if (sentTo) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12" role="status">
        <Link href="/" className="font-display text-xl">Fretkey</Link>
        <h1 className="text-4xl">Check your email</h1>
        <p className="text-lg text-muted-foreground">We sent a confirmation link to <span className="text-foreground">{sentTo}</span>. Open it on this device to start learning. It works for one hour.</p>
        <p className="text-sm text-muted-foreground">Nothing there after a minute? Look in spam, or send it again.</p>
        <p role="alert" className="min-h-6 text-destructive">{error}</p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" variant="outline" disabled={busy} onClick={() => void resend()}>Send the link again</Button>
          <Button size="lg" variant="ghost" onClick={() => { setSentTo(undefined); setError(undefined); }}>Use another email</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <Link href="/" className="font-display text-xl">Fretkey</Link>
      <h1 className="text-4xl">{signUp ? "Create your account" : "Welcome back"}</h1>
      {phone && <Segmented label="Sign in with" value={method} options={[["email", "Email"], ["phone", "Mobile number"]] as const} onChange={(m) => { setMethod(m); setError(undefined); }} />}
      {method === "phone" ? <PhoneForm next={next} signUp={signUp} ready={ready} /> : (
      <form method="post" onSubmit={submit} className="flex flex-col gap-4">
        {signUp && (
          <label className="flex flex-col gap-1.5 text-sm">Name
            <input name="name" required maxLength={60} autoComplete="name" className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm">Email
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">Password
          <input name="password" type="password" required minLength={8} autoComplete={signUp ? "new-password" : "current-password"} className={inputClass} />
          {signUp && <span className="text-muted-foreground">At least 8 characters.</span>}
        </label>
        {!signUp && emailOn && <Link href="/forgot-password" className="-mt-2 self-start text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Forgot password?</Link>}
        <p role="alert" className="min-h-6 text-destructive">{error}</p>
        <Button size="lg" type="submit" disabled={busy || !ready}>{signUp ? "Create account" : "Sign in"}</Button>
      </form>
      )}
      {google && (
        <Button size="lg" variant="outline" disabled={busy || !ready} onClick={() => authClient.signIn.social({ provider: "google", callbackURL: next })}>
          Continue with Google
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        {signUp ? "Already have an account? " : "New here? "}
        <Link href={`${signUp ? "/sign-in" : "/sign-up"}?next=${encodeURIComponent(next)}`} className="text-foreground underline underline-offset-4">
          {signUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}

/** Sign in, or sign up, with a mobile number: send a code by SMS, then type it in. */
function PhoneForm({ next, signUp, ready }: { next: string; signUp: boolean; ready: boolean }) {
  const [number, setNumber] = useState<string>(); // set once a code has been sent to it
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = normalisePhoneNumber(String(new FormData(event.currentTarget).get("phone")));
    if (!isPhoneNumber(typed)) return setError("Enter your number with its country code, for example +91 98765 43210 or +1 415 555 0100.");
    setBusy(true);
    setError(undefined);
    const result = await authClient.phoneNumber.sendOtp({ phoneNumber: typed });
    setBusy(false);
    if (result.error) return setError(result.error.message ?? "The code could not be sent. Check the number and try again.");
    setNumber(typed);
  };

  const check = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const result = await authClient.phoneNumber.verify({ phoneNumber: number!, code: String(new FormData(event.currentTarget).get("code")).trim() });
    if (result.error) {
      setBusy(false);
      return setError("That code is not right, or it has expired. Check it, or send a new one.");
    }
    if (signUp) track("Sign up", { method: "phone" });
    hardNavigate(next);
  };

  if (!number) {
    return (
      <form method="post" onSubmit={send} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">Mobile number
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" className={inputClass} />
          <span className="text-muted-foreground">With your country code. We text you a 6-digit code.</span>
        </label>
        <p role="alert" className="min-h-6 text-destructive">{error}</p>
        <Button size="lg" type="submit" disabled={busy || !ready}>Send code</Button>
      </form>
    );
  }
  return (
    <form method="post" onSubmit={check} className="flex flex-col gap-4">
      <p className="text-muted-foreground">We sent a code to <span className="text-foreground">{number}</span>.</p>
      <label className="flex flex-col gap-1.5 text-sm">Code
        <input name="code" required autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{4,8}" maxLength={8} className={`${inputClass} tracking-[0.3em]`} />
      </label>
      <p role="alert" className="min-h-6 text-destructive">{error}</p>
      <Button size="lg" type="submit" disabled={busy}>{signUp ? "Create account" : "Sign in"}</Button>
      <Button type="button" variant="ghost" disabled={busy} onClick={() => { setNumber(undefined); setError(undefined); }}>Use another number or resend</Button>
    </form>
  );
}
