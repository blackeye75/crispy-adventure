import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeView } from "@/features/lesson-player/PathView";
import { getPath } from "@/server/services/content";

export const metadata: Metadata = { title: "Home · Fretkey" };

async function Home() {
  return <HomeView path={await getPath()} />;
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
