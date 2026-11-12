import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingFlow } from "@/features/account/OnboardingFlow";
import { getViewer } from "@/server/auth/session";
import { getProfile } from "@/server/services/profile";

export const metadata: Metadata = { title: "Set up · Fretkey" };

async function Onboarding() {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in?next=/onboarding");
  const profile = await getProfile(viewer.userId); // revisiting edits the same choices
  return <OnboardingFlow initial={{ instrument: profile?.instrument ?? "guitar", level: profile?.level ?? "beginner", dailyGoalMinutes: profile?.dailyGoalMinutes ?? 10 }} />;
}

export default function OnboardingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense>
        <Onboarding />
      </Suspense>
    </main>
  );
}
