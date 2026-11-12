"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/analytics";

export default function ErrorScreen({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => reportError(error), [error]);
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 px-4 py-16">
      <p className="text-sm font-medium tracking-widest text-destructive uppercase">Something went wrong</p>
      <h1 className="text-4xl">That did not load.</h1>
      <p className="text-lg text-muted-foreground">Your progress is safe. Try again; if it keeps happening, come back in a few minutes.</p>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>Try again</Button>
        {/* a full page load on purpose: after a crash, start from a clean slate */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <Button size="lg" variant="ghost" asChild><a href="/">Go to the start</a></Button>
      </div>
    </main>
  );
}
