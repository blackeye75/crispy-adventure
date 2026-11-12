import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <p className="text-sm font-medium tracking-widest text-primary uppercase">Fretkey</p>
      <h1 className="text-5xl leading-tight sm:text-6xl">Music theory, on your instrument.</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Understand it, hear it, see it on the fretboard or keyboard, then play it.
      </p>
      <div>
        <Button size="lg" asChild>
          <Link href="/practice">Open the Theory Canvas</Link>
        </Button>
      </div>
    </main>
  );
}
