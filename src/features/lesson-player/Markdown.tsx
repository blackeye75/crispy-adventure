import { Fragment, type ReactNode } from "react";

// shortcut: handles only what lesson text uses (paragraphs, "- " lists, **bold**, *italic*).
// Swap for a markdown library if lessons ever need headings, links or tables.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("**") ? <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    : part.startsWith("*") ? <em key={i}>{part.slice(1, -1)}</em>
    : <Fragment key={i}>{part}</Fragment>,
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="flex flex-col gap-4 text-lg leading-relaxed text-foreground/85">
      {children.trim().split(/\n\s*\n/).map((para, i) => {
        const lines = para.split("\n").map((l) => l.trim());
        return lines.every((l) => l.startsWith("- "))
          ? <ul key={i} className="flex list-disc flex-col gap-2 pl-6">{lines.map((l, k) => <li key={k}>{inline(l.slice(2))}</li>)}</ul>
          : <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </div>
  );
}
