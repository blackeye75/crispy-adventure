"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { hardNavigate } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export const inputClass = "h-12 rounded-md border bg-card px-4 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

type Props = { mode: "sign-in" | "sign-up"; next: string; google: boolean };

export function AuthForm({ mode, next, google }: Props) {
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const signUp = mode === "sign-up";

  // onSubmit, not a form action: an action would clear the fields after a failed attempt.
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(undefined);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const result = signUp
      ? await authClient.signUp.email({ name: String(form.get("name")).trim(), email, password })
      : await authClient.signIn.email({ email, password });
    if (result.error) {
      setError(result.error.message ?? "That did not work. Check your details and try again.");
      setBusy(false);
      return;
    }
    hardNavigate(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <Link href="/" className="font-display text-xl">Fretkey</Link>
      <h1 className="text-4xl">{signUp ? "Create your account" : "Welcome back"}</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
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
        <p role="alert" className="min-h-6 text-destructive">{error}</p>
        <Button size="lg" type="submit" disabled={busy}>{signUp ? "Create account" : "Sign in"}</Button>
      </form>
      {google && (
        <Button size="lg" variant="outline" disabled={busy} onClick={() => authClient.signIn.social({ provider: "google", callbackURL: next })}>
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
