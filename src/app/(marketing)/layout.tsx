import Link from "next/link";

const link = "underline-offset-4 hover:text-foreground hover:underline";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <footer className="border-t">
        <nav aria-label="Footer" className="mx-auto flex w-full max-w-5xl flex-wrap gap-x-6 gap-y-2 px-6 py-8 text-sm text-muted-foreground">
          <span className="mr-auto font-display text-base text-foreground">Fretkey</span>
          <Link href="/practice" className={link}>Practice room</Link>
          <Link href="/learn" className={link}>The path</Link>
          <Link href="/privacy" className={link}>Privacy</Link>
          <Link href="/terms" className={link}>Terms</Link>
          <Link href="/refunds" className={link}>Refunds</Link>
        </nav>
      </footer>
    </>
  );
}
