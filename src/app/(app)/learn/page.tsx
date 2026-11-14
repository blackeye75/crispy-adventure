import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { PathView } from "@/features/lesson-player/PathView";
import { getViewer } from "@/server/auth/session";
import { ANONYMOUS, getPath } from "@/server/services/content";

export const metadata: Metadata = { title: "Your path · Fretkey" };

async function PathMap() {
  await connection(); // per request: without this the catch below swallows the prerender bail-out and the database is read at build time
  // The map is public; signed-in learners also see their progress.
  const viewer = await getViewer().catch(() => null);
  return <PathView path={await getPath(viewer ?? ANONYMOUS)} />;
}

export default function LearnPage() {
  return (
    <main className="flex-1">
      <Suspense fallback={<div className="mx-auto mt-16 h-96 w-full max-w-3xl animate-pulse rounded-2xl bg-muted" aria-hidden />}>
        <PathMap />
      </Suspense>
    </main>
  );
}
