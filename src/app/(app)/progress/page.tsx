import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { requireLearner } from "@/server/auth/session";
import { getStats } from "@/server/services/stats";

export const metadata: Metadata = { title: "Progress · Fretkey" };

const percent = (value: number | null) => (value === null ? "–" : `${Math.round(value * 100)}%`);
const day = (date: string) => new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const card = "flex flex-col gap-4 rounded-2xl border bg-card p-6";

async function Progress() {
  const { viewer } = await requireLearner("/progress");
  const stats = await getStats(viewer);
  const tiles = [
    [stats.streak.current, `day streak · best ${stats.streak.longest}`],
    [stats.totals.minutes, `minutes over ${stats.totals.daysPractised} ${stats.totals.daysPractised === 1 ? "day" : "days"}`],
    [stats.totals.lessonsCompleted, "lessons finished"],
    [percent(stats.totals.accuracy), "drills right first time"],
  ] as const;

  return (
    <>
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map(([value, label]) => (
          <div key={label} className="flex flex-col-reverse gap-1 rounded-2xl border bg-card p-5">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-4xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <section className={card} aria-labelledby="topics">
        <h2 id="topics" className="text-2xl">By topic</h2>
        <ul className="flex flex-col gap-4">
          {stats.topics.map((topic) => (
            <li key={topic.title} className="flex flex-col gap-1.5">
              <div className="flex justify-between gap-4"><span>{topic.title}</span><span className="text-sm text-muted-foreground tabular-nums">{topic.done} of {topic.total}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={topic.title} aria-valuemin={0} aria-valuemax={topic.total} aria-valuenow={topic.done}>
                <div className="h-full origin-left rounded-full bg-primary" style={{ transform: `scaleX(${topic.done / topic.total})` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={card} aria-labelledby="memory">
        <h2 id="memory" className="text-2xl">In your memory</h2>
        {stats.review.concepts === 0 ? (
          <p className="text-muted-foreground">Each lesson you finish adds its idea here, and review keeps it from fading.</p>
        ) : (
          <p className="text-lg">
            <strong>{stats.review.strong}</strong> of {stats.review.concepts} ideas are holding strong. <span className="text-muted-foreground">{stats.review.due} due for review now.</span>
          </p>
        )}
      </section>

      <section className={card} aria-labelledby="history">
        <h2 id="history" className="text-2xl">Recent practice</h2>
        {stats.history.length === 0 ? (
          <>
            <p className="text-muted-foreground">Nothing yet. Finish a lesson and your practice days appear here.</p>
            <div><Button asChild><Link href="/dashboard">Go to your next lesson</Link></Button></div>
          </>
        ) : (
          <table className="w-full text-left">
            <thead className="text-sm text-muted-foreground">
              <tr><th scope="col" className="pb-2 font-normal">Day</th><th scope="col" className="pb-2 text-right font-normal">Minutes</th><th scope="col" className="pb-2 text-right font-normal">Right first time</th></tr>
            </thead>
            <tbody className="tabular-nums">
              {stats.history.map((h) => (
                <tr key={h.date} className="border-t"><td className="py-2">{day(h.date)}</td><td className="py-2 text-right">{h.minutes}</td><td className="py-2 text-right">{percent(h.accuracy)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default function ProgressPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 lg:py-16">
      <h1 className="text-4xl">Progress</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" aria-hidden />}>
        <Progress />
      </Suspense>
    </main>
  );
}
