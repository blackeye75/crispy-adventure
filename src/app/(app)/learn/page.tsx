import type { Metadata } from "next";
import { Suspense } from "react";
import { PathView } from "@/features/lesson-player/PathView";
import { getPath } from "@/server/services/content";

export const metadata: Metadata = { title: "Your path · Fretkey" };

async function PathMap() {
  return <PathView path={await getPath()} />;
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
