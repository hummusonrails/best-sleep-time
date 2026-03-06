"use client";

import { useEffect } from "react";

export function syncScheduleToSW() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  const raw = localStorage.getItem("bslt-nap-schedule");
  if (!raw) return;

  try {
    const schedule = JSON.parse(raw);
    schedule.region = localStorage.getItem("bslt-region") || "all";
    schedule.city = localStorage.getItem("bslt-city") || null;

    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: "SYNC_SCHEDULE",
        schedule,
      });
    });
  } catch {
    // Invalid JSON in localStorage — ignore
  }
}

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          syncScheduleToSW();
        })
        .catch((err) => {
          console.error("SW registration failed:", err);
        });
    }
  }, []);

  return null;
}
