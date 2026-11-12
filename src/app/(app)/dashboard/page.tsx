import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeView } from "@/features/lesson-player/PathView";
import { requireLearner } from "@/server/auth/session";
import { getPath } from "@/server/services/content";
import { getMe } from "@/server/services/profile";

export const metadata: Metadata = { title: "Home · Fretkey" };

async function Home() {
  const { viewer, profile } = await requireLearner("/dashboard");
  const [path, me] = await Promise.all([getPath(viewer), getMe(viewer)]);
  return <HomeView path={path} me={{ ...me, profile, today: me.today! }} />;
}

export default function DashboardPage() {
  return (
    <main className="flex-1">
      <Suspense fallback={<div className="mx-auto mt-16 h-64 w-full max-w-3xl animate-pulse rounded-2xl bg-muted" aria-hidden />}>
        <Home />
      </Suspense>
    </main>
  );
}
