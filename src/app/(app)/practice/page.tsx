import type { Metadata } from "next";
import { Suspense } from "react";
import { canvasFromQuery } from "@/core/schemas/canvas";
import { TheoryCanvas } from "@/features/canvas/TheoryCanvas";

export const metadata: Metadata = { title: "Practice room · Fretkey" };

type Query = PageProps<"/practice">["searchParams"];

async function Canvas({ searchParams }: { searchParams: Query }) {
  return <TheoryCanvas initial={canvasFromQuery(await searchParams)} />;
}

function Skeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] animate-pulse flex-col gap-4 p-4 lg:gap-6 lg:p-8" aria-hidden>
      <div className="h-11 rounded-md bg-muted" />
      <div className="h-72 rounded-xl bg-muted" />
      <div className="h-40 rounded-xl bg-muted" />
    </div>
  );
}

export default function PracticePage({ searchParams }: { searchParams: Query }) {
  return (
    <main className="flex-1">
      <h1 className="sr-only">Theory Canvas</h1>
      <Suspense fallback={<Skeleton />}>
        <Canvas searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
