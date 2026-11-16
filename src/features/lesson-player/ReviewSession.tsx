"use client";

import Link from "next/link";
import { useState } from "react";
import type { Instrument } from "@/core/schemas/api";
import { stopAudio } from "@/features/audio/engine";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { ReviewDrill } from "@/server/services/review";
import type { NoteNaming } from "@/core/theory/syllables";
import { LeftHanded, Naming } from "./InstrumentView";
import { BlockView } from "./LessonPlayer";

/** A quick mixed session of the drills that are due. Each answer reschedules its concept. */
export function ReviewSession({ drills, instrument, leftHanded, noteNaming = "letters" }: { drills: ReviewDrill[]; instrument: Instrument; leftHanded: boolean; noteNaming?: NoteNaming }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [error, setError] = useState<string>();
  const [shownAt, setShownAt] = useState(() => Date.now());
  const shell = "mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 lg:py-16";

  if (index >= drills.length) {
    const right = results.filter(Boolean).length;
    return (
      <div className={`${shell} step-in max-w-2xl justify-center`}>
        <p className="text-sm font-medium tracking-widest text-primary uppercase">{drills.length ? "Review done" : "Nothing due"}</p>
        <h1 className="text-4xl">{drills.length ? `${right} of ${drills.length} right first time.` : "Nothing to review right now."}</h1>
        <p className="text-lg text-muted-foreground">
          {drills.length ? "What you knew will come back later; what you missed will come back tomorrow." : "Ideas from finished lessons return here just before you would forget them."}
        </p>
        <div><Button asChild size="lg"><Link href="/dashboard">Back to home</Link></Button></div>
      </div>
    );
  }

  const drill = drills[index];
  const answered = results.length > index;
  const record = (correct: boolean) => {
    setResults((r) => [...r, correct]);
    setError(undefined);
    api("/review/answer", { method: "POST", body: { conceptId: drill.conceptId, correct, seconds: Math.min(600, Math.round((Date.now() - shownAt) / 1000)) } }).catch((err: Error) => setError(`${err.message} This answer was not saved; the drill will come back.`));
  };

  return (
    <div className={shell}>
      <p className="text-sm text-muted-foreground" aria-live="polite">Review {index + 1} of {drills.length} · from “{drill.lessonTitle}”</p>
      <div key={index} className="step-in flex flex-col gap-8">
        <LeftHanded value={leftHanded}><Naming value={noteNaming}><BlockView block={drill.block} instrument={instrument} onSolved={record} /></Naming></LeftHanded>
      </div>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button size="lg" disabled={!answered} onClick={() => { stopAudio(); setIndex(index + 1); setShownAt(Date.now()); }} className="max-sm:w-full">
          {index === drills.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
