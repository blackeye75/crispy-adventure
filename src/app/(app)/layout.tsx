import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { AccountLink } from "@/features/account/AccountLink";

const LINKS = [["/dashboard", "Home"], ["/learn", "Path"], ["/review", "Review"], ["/progress", "Progress"], ["/practice", "Practice"], ["/settings", "Settings"]] as const;
const link = "flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b">
        <nav aria-label="Main" className="mx-auto flex w-full max-w-[1400px] items-center gap-1 overflow-x-auto px-4 lg:px-8">
          <Link href="/dashboard" className="mr-auto flex items-center gap-2 py-3 font-display text-xl"><Logo />Fretkey</Link>
          {LINKS.map(([href, name]) => (
            <Link key={href} href={href} className={link}>
              {name}
            </Link>
          ))}
          <AccountLink className={link} />
        </nav>
      </header>
      {children}
    </>
  );
}
