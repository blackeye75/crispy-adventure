import type { Metadata } from "next";
import Link from "next/link";
import { EarTrainer } from "@/features/drills/EarTrainer";

export const metadata: Metadata = { title: "Ear trainer · Fretkey" };

export default function EarPage() {
  return (
    <main className="flex-1">
      <p className="mx-auto w-full max-w-2xl px-4 pt-6 text-sm"><Link href="/practice" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">Back to the Theory Canvas</Link></p>
      <EarTrainer />
    </main>
  );
}
