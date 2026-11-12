"use client";

import { useEffect } from "react";

/** Registers the offline shell. Production only: in development a service worker serves stale files. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
