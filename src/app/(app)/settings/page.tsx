import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BillingSettings } from "@/features/billing/billing";
import { requireLearner } from "@/server/auth/session";
import { getMe } from "@/server/services/profile";

export const metadata: Metadata = { title: "Settings · Fretkey" };

async function Settings() {
  const { viewer, profile } = await requireLearner("/settings");
  const { subscription } = await getMe(viewer);
  return (
    <>
      <section aria-label="Preferences" className="flex flex-col gap-3 rounded-2xl border bg-card p-6">
        <h2 className="text-2xl">Preferences</h2>
        <p className="text-muted-foreground">
          {profile.instrument === "guitar" ? "Guitar" : "Piano"} · {profile.dailyGoalMinutes} minutes a day
        </p>
        <div><Link href="/onboarding" className="underline underline-offset-4 hover:text-primary">Change instrument, level or daily goal</Link></div>
      </section>
      <BillingSettings initial={subscription} />
    </>
  );
}

export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 lg:py-16">
      <h1 className="text-4xl">Settings</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" aria-hidden />}>
        <Settings />
      </Suspense>
    </main>
  );
}
