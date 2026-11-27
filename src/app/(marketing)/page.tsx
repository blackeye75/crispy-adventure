import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { content } from "../../../content";
import { modules, tracks } from "../../../content/modules";
import { HeroVideo } from "@/features/marketing/HeroVideo";
import { LandingDemo } from "@/features/marketing/LandingDemo";
import { LEVEL_NAMES } from "@/features/lesson-player/PathView";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/site";
import { getAllPlans } from "@/server/services/billing";

const STEPS = [
  ["Understand", "A short, plain explanation. One idea at a time."],
  ["Listen", "Hear the idea before you read anything about it."],
  ["Learn", "See it on the fretboard or the keyboard, and tap it."],
  ["Practice", "Quick drills on screen, then play along on your instrument."],
];

const section = "mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16";

// The reels on Instagram, each with the full lesson behind it. Signed-out visitors are sent to sign in first.
const FROM_THE_REELS: [topic: string, lesson: string][] = [
  ["Why one note turns happy into sad", "major-and-minor-triads"],
  ["Why thousands of songs share four chords", "four-chord-songs"],
  ["Why the last chord feels like home", "the-tritone-in-the-dominant-seventh"],
  ["The bittersweet borrowed chord", "modal-interchange"],
  ["Why rock sounds heavy, and why sus chords hang", "sus-and-power-chords"],
  ["One shape, twelve chords", "barre-chords"],
  ["The box behind countless solos", "the-minor-pentatonic-scale"],
  ["Why the 12th fret starts again", "the-twelfth-fret"],
];
const lessonTitle = (slug: string) => content.lessons.find((l) => l.slug === slug)!.title;
const playing = tracks.filter((t) => t.slug !== "theory");
const stagesOf = (track: string) => modules.filter((m) => m.trackSlug === track).sort((a, b) => a.order - b.order).map((m) => m.title).join(" · ");

async function Prices() {
  await connection(); // live prices: fetched per request, not frozen into the build
  const plans = await getAllPlans();
  // One card per plan: the international price first, the Indian price under it.
  return (["monthly", "yearly"] as const).flatMap((plan) => {
    const [main, india] = [plans.find((p) => p.plan === plan && p.provider === "paddle"), plans.find((p) => p.plan === plan && p.provider === "razorpay")];
    const first = main ?? india;
    if (!first) return [];
    return (
      <div key={plan} className="flex flex-col gap-2 rounded-2xl border bg-card p-6">
        <h3 className="font-sans text-lg font-medium tracking-normal">{plan === "monthly" ? "Monthly" : "Yearly"}</h3>
        <p><span className="text-4xl font-semibold">{formatPrice(first.amount, first.currency)}</span> <span className="text-muted-foreground">per {plan === "monthly" ? "month" : "year"}</span></p>
        {main && india && <p className="text-sm text-muted-foreground">In India: {formatPrice(india.amount, india.currency)} with UPI Autopay</p>}
        <p className="text-muted-foreground">Every level, plus daily review. Cancel any time.</p>
      </div>
    );
  });
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
        <HeroVideo />
      </section>

      <section className={section} aria-labelledby="inside">
        <div className="flex flex-col gap-2">
          <h2 id="inside" className="text-3xl">What is inside</h2>
          <p className="text-muted-foreground">One idea per lesson, 5 to 8 minutes each, on guitar or piano.</p>
        </div>
        <dl className="grid grid-cols-3 gap-4">
          {[[content.lessons.length, "lessons"], [LEVEL_NAMES.length, "levels of theory"], [playing.length, "playing tracks"]].map(([n, what]) => (
            <div key={String(what)} className="flex flex-col gap-1 rounded-2xl border bg-card p-5">
              <dt className="order-2 text-sm text-muted-foreground">{what}</dt>
              <dd className="order-1 font-display text-4xl text-primary tabular-nums sm:text-5xl">{n}</dd>
            </div>
          ))}
        </dl>
        <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {playing.map((t) => (
            <li key={t.slug} className="flex flex-col gap-1">
              <h3 className="font-sans text-lg font-medium tracking-normal">{t.title}</h3>
              <p className="text-muted-foreground">{t.description} <span className="text-foreground/70">{stagesOf(t.slug)}.</span></p>
            </li>
          ))}
        </ul>
      </section>

      <section className={section} aria-labelledby="reels">
        <div className="flex flex-col gap-2">
          <h2 id="reels" className="text-3xl">Saw a reel? Here is the full lesson.</h2>
          <p className="text-muted-foreground">Every reel on <a href="https://www.instagram.com/fret.key/" className="text-foreground underline underline-offset-4">@fret.key</a> is one idea from the path. Each lesson goes further: you hear it, see it on your instrument, and play it.</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {FROM_THE_REELS.map(([topic, slug]) => (
            <li key={slug}>
              <Link href={`/learn/${slug}`} className="flex min-h-16 flex-col justify-center rounded-xl border bg-card px-5 py-4 outline-none transition-colors duration-150 hover:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <span className="font-medium">{topic}</span>
                <span className="text-sm text-muted-foreground">Lesson: {lessonTitle(slug)} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={section} aria-labelledby="try">
        <h2 id="try" className="text-3xl">Try it right here</h2>
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
