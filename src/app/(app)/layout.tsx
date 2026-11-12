import Link from "next/link";

const LINKS = [["/dashboard", "Home"], ["/learn", "Path"], ["/practice", "Practice"]] as const;

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b">
        <nav aria-label="Main" className="mx-auto flex w-full max-w-[1400px] items-center gap-1 px-4 lg:px-8">
          <Link href="/dashboard" className="mr-auto py-3 font-display text-xl">Fretkey</Link>
          {LINKS.map(([href, name]) => (
            <Link key={href} href={href} className="flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50">
              {name}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </>
  );
}
