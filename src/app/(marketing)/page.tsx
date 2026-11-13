import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { modules } from "../../../content/modules";
import { LandingDemo } from "@/features/marketing/LandingDemo";
import { LEVEL_NAMES } from "@/features/lesson-player/PathView";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/site";
import { getPlans } from "@/server/services/razorpay";

const STEPS = [
  ["Understand", "A short, plain explanation. One idea at a time."],
  ["Listen", "Hear the idea before you read anything about it."],
  ["Learn", "See it on the fretboard or the keyboard, and tap it."],
  ["Practice", "Quick drills on screen, then play along on your instrument."],
];

const section = "mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16";

async function Prices() {
  await connection(); // live prices: fetched per request, not frozen into the build
  const plans = await getPlans().catch(() => []);
  return plans.map((p) => (
    <div key={p.plan} className="flex flex-col gap-2 rounded-2xl border bg-card p-6">
      <h3 className="font-sans text-lg font-medium tracking-normal">{p.plan === "monthly" ? "Monthly" : "Yearly"}</h3>
      <p><span className="text-4xl font-semibold">{formatPrice(p.amount, p.currency)}</span> <span className="text-muted-foreground">per {p.plan === "monthly" ? "month" : "year"}</span></p>
      <p className="text-muted-foreground">Every level, plus daily review. Cancel any time.</p>
    </div>
  ));
}

export default function Home() {
  return (
    <main className="flex-1">
      <section className={`${section} pt-20`}>
        <div className="flex max-w-3xl flex-col gap-6">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">Fretkey</p>
          <h1 className="text-5xl leading-tight sm:text-6xl">Music theory, on your instrument.</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            You know the shapes and the songs. Fretkey shows you why they work: every idea heard, seen on the fretboard or keyboard, and played.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild><Link href="/sign-up">Start free</Link></Button>
            <Button size="lg" variant="ghost" asChild><Link href="/practice">Open the practice room</Link></Button>
          </div>
        </div>
        <LandingDemo />
      </section>

      <section className={section} aria-labelledby="how">
        <h2 id="how" className="text-3xl">Every lesson, the same four steps</h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([name, detail], i) => (
            <li key={name} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-primary tabular-nums">{i + 1}</span>
              <h3 className="font-sans text-lg font-medium tracking-normal">{name}</h3>
              <p className="text-muted-foreground">{detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={section} aria-labelledby="path">
        <h2 id="path" className="text-3xl">One path, from your first note to jazz harmony</h2>
        <ol className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {LEVEL_NAMES.map((name, i) => (
            <li key={name} className="flex flex-col gap-1">
              <h3 className="font-sans text-lg font-medium tracking-normal"><span className="text-primary">Level {i + 1}</span> · {name}</h3>
              <p className="text-muted-foreground">{modules.filter((m) => m.level === i + 1).map((m) => m.title).join(" · ")}</p>
            </li>
          ))}
        </ol>
        <p className="text-muted-foreground">Guitarists and pianists follow the same path. New modules are released as they are written.</p>
      </section>

      <section className={section} aria-labelledby="pricing">
        <h2 id="pricing" className="text-3xl">Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-2xl border bg-card p-6">
            <h3 className="font-sans text-lg font-medium tracking-normal">Free</h3>
            <p className="text-4xl font-semibold">Level 1</p>
            <p className="text-muted-foreground">Every Foundations lesson as it is released, and the practice room. No card needed.</p>
          </div>
          <Suspense><Prices /></Suspense>
        </div>
        <div><Button size="lg" asChild><Link href="/sign-up">Create your free account</Link></Button></div>
      </section>
    </main>
  );
}
