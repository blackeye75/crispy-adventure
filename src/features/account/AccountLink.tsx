"use client";

import Link from "next/link";
import { hardNavigate } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

/** "Sign in" or "Sign out", depending on the session. */
export function AccountLink({ className }: { className: string }) {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <span className={className} aria-hidden />;
  if (!data) return <Link href="/sign-in" className={className}>Sign in</Link>;
  return (
    <button type="button" className={className} onClick={async () => { await authClient.signOut(); hardNavigate("/"); }}>
      Sign out
    </button>
  );
}
