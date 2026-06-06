"use client";

import { useSyncExternalStore } from "react";

const KICKOFF = new Date("2026-06-11T19:00:00Z");

// Tiny external "current time" store, ticking once a second. The server
// snapshot is null so SSR renders a placeholder and the real values fill
// in on the client without a hydration mismatch.
let nowSnapshot = Date.now();

function subscribe(onStoreChange: () => void) {
  nowSnapshot = Date.now();
  const timer = setInterval(() => {
    nowSnapshot = Date.now();
    onStoreChange();
  }, 1_000);
  return () => clearInterval(timer);
}

function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => nowSnapshot,
    () => null
  );
}

const kickoffFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function remainingParts(now: number) {
  const ms = Math.max(0, KICKOFF.getTime() - now);
  const minutes = Math.floor(ms / 60_000);
  return {
    days: Math.floor(minutes / (60 * 24)),
    hours: Math.floor(minutes / 60) % 24,
    minutes: minutes % 60,
  };
}

export default function Countdown() {
  const now = useNow();
  const parts = now === null ? null : remainingParts(now);

  const units: { label: string; value: number | null }[] = [
    { label: "days", value: parts?.days ?? null },
    { label: "hours", value: parts?.hours ?? null },
    { label: "minutes", value: parts?.minutes ?? null },
  ];

  return (
    <div className="text-center">
      <div className="flex justify-center gap-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="w-20 rounded-md border border-gray-200 bg-white p-3"
          >
            <div className="text-3xl font-bold tabular-nums">
              {unit.value ?? "–"}
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-500">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Entries lock at the first kick-off —{" "}
        {kickoffFormatter.format(KICKOFF)} UK time.
      </p>
    </div>
  );
}
