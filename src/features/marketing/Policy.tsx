import { Markdown } from "@/features/lesson-player/Markdown";
import { SITE } from "@/lib/site";

/** A policy page: plain sections, the date it was last changed, and how to reach us. */
export function Policy({ title, updated, sections }: { title: string; updated: string; sections: [heading: string, body: string][] }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl">{title}</h1>
        <p className="text-sm text-muted-foreground">Last updated {updated}</p>
        {/* Remove once the owner (and ideally a lawyer) has reviewed this page. */}
        <p role="note" className="rounded-lg border border-primary/50 p-4 text-sm">Draft: this page is still being reviewed and may change before launch.</p>
      </div>
      {sections.map(([heading, body]) => (
        <section key={heading} className="flex flex-col gap-3">
          <h2 className="text-2xl">{heading}</h2>
          <Markdown>{body}</Markdown>
        </section>
      ))}
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl">Contact</h2>
        <p className="text-lg text-foreground/85">
          {SITE.supportEmail ? <>Questions about this page: <a className="underline underline-offset-4" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></> : "A contact address will be published here before launch."}
        </p>
      </section>
    </main>
  );
}
