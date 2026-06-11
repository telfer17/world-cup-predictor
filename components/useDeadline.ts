"use client";

import { useSyncExternalStore } from "react";
import { DEADLINE } from "@/lib/constants";

// One shared 1-second clock so the countdown display, the deadline flip, the
// hero and the navbar all tick together off the single DEADLINE source of
// truth — and switch live at kick-off without a redeploy.
let nowSnapshot = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (timer === null) {
    timer = setInterval(() => {
      nowSnapshot = Date.now();
      listeners.forEach((l) => l());
    }, 1_000);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Current time in ms, or null during SSR/first paint (avoids hydration mismatch). */
export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => nowSnapshot,
    () => null
  );
}

/**
 * Whether the entry deadline (first kick-off) has passed. The snapshot is a
 * boolean, so consumers only re-render when it actually flips — not every tick.
 * Server snapshot is false so SSR/static HTML renders the pre-deadline view and
 * the client corrects itself after hydration.
 */
export function useAfterDeadline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => nowSnapshot >= DEADLINE.getTime(),
    () => false
  );
}
