"use client";

import { useEffect } from "react";

/** Registers the offline shell. Production only: in development a service worker serves stale files. */
export function ServiceWorker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "1"; // lets automated tests know the page now responds to clicks
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
