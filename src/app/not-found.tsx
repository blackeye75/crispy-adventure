import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 px-4 py-16">
      <p className="text-sm font-medium tracking-widest text-primary uppercase">Not found</p>
      <h1 className="text-4xl">There is nothing at this address.</h1>
      <p className="text-lg text-muted-foreground">The lesson may have moved. The path has everything that exists.</p>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" asChild><Link href="/learn">See the path</Link></Button>
        <Button size="lg" variant="ghost" asChild><Link href="/">Go to the start</Link></Button>
      </div>
    </main>
  );
}
