import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline · Fretkey", robots: { index: false } };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 px-4 py-16">
      <p className="text-sm font-medium tracking-widest text-primary uppercase">Offline</p>
      <h1 className="text-4xl">You are not connected.</h1>
      <p className="text-lg text-muted-foreground">Lessons and review need a connection so your progress is saved. The practice room works offline once you have opened it.</p>
      {/* plain links: a full page load lets the service worker answer */}
      <div className="flex flex-wrap gap-4 text-lg">
        <a href="/practice" className="text-primary underline underline-offset-4">Open the practice room</a>
        <a href="/dashboard" className="underline underline-offset-4">Try again</a>
      </div>
    </main>
  );
}
