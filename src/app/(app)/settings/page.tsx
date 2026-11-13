import type { Metadata } from "next";
import { Suspense } from "react";
import { PreferencesForm, ThemeSwitch } from "@/features/account/Preferences";
import { BillingSettings } from "@/features/billing/billing";
import { requireLearner } from "@/server/auth/session";
import { getMe } from "@/server/services/profile";

export const metadata: Metadata = { title: "Settings · Fretkey" };

async function Settings() {
  const { viewer, profile } = await requireLearner("/settings");
  const { subscription } = await getMe(viewer);
  return (
    <>
      <PreferencesForm initial={{ instrument: profile.instrument, dailyGoalMinutes: profile.dailyGoalMinutes, leftHanded: profile.leftHanded }} />
      <ThemeSwitch />
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
