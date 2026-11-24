"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { inputClass } from "./AuthForm";

/** False until the form is interactive: a plain browser submit before then would lose the input, or post a password. */
const useReady = () => useSyncExternalStore(() => () => {}, () => true, () => false);

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
    <Link href="/" className="font-display text-xl">Fretkey</Link>
    {children}
  </div>
);

/** Ask for a reset link. The answer is the same whether or not the address has an account, so it reveals nothing. */
export function ForgotPassword() {
  const ready = useReady();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const result = await authClient.requestPasswordReset({ email: String(new FormData(event.currentTarget).get("email")), redirectTo: "/reset-password" });
    setBusy(false);
    if (result.error) return setError(result.error.message ?? "That did not work. Try again in a minute.");
    setSent(true);
  };

  if (sent) {
    return (
      <Shell>
        <h1 className="text-4xl">Check your email</h1>
        <p className="text-lg text-muted-foreground" role="status">If that address has a Fretkey account, a link to choose a new password is on its way. It works for one hour.</p>
        <Link href="/sign-in" className="text-sm underline underline-offset-4">Back to sign in</Link>
      </Shell>
    );
  }
  return (
    <Shell>
      <h1 className="text-4xl">Forgot your password?</h1>
      <p className="text-muted-foreground">Enter your email and we will send you a link to choose a new one.</p>
      <form method="post" onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">Email
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <p role="alert" className="min-h-6 text-destructive">{error}</p>
        <Button size="lg" type="submit" disabled={busy || !ready}>Send reset link</Button>
      </form>
      <Link href="/sign-in" className="text-sm text-muted-foreground underline underline-offset-4">Back to sign in</Link>
    </Shell>
  );
}

/** Choose a new password, from the link in the email. */
export function ResetPassword({ token, invalid }: { token?: string; invalid: boolean }) {
  const ready = useReady();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("password"));
    if (newPassword !== String(form.get("confirm"))) return setError("The two passwords are not the same.");
    setBusy(true);
    setError(undefined);
    const result = await authClient.resetPassword({ newPassword, token: token! });
    setBusy(false);
    if (result.error) return setError(result.error.message ?? "That link has expired. Ask for a new one.");
    setDone(true);
  };

  if (invalid || !token) {
    return (
      <Shell>
        <h1 className="text-4xl">This link has expired</h1>
        <p className="text-lg text-muted-foreground">Reset links work once, for one hour. Ask for a new one and use the latest email.</p>
        <div><Button asChild size="lg"><Link href="/forgot-password">Send a new link</Link></Button></div>
      </Shell>
    );
  }
  if (done) {
    return (
      <Shell>
        <h1 className="text-4xl">Password changed</h1>
        <p className="text-lg text-muted-foreground" role="status">You can sign in with your new password. Any other devices have been signed out.</p>
        <div><Button asChild size="lg"><Link href="/sign-in">Sign in</Link></Button></div>
      </Shell>
    );
  }
  return (
    <Shell>
      <h1 className="text-4xl">Choose a new password</h1>
      <form method="post" onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">New password
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          <span className="text-muted-foreground">At least 8 characters.</span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">Type it again
          <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </label>
        <p role="alert" className="min-h-6 text-destructive">{error}</p>
        <Button size="lg" type="submit" disabled={busy || !ready}>Save new password</Button>
      </form>
    </Shell>
  );
}
