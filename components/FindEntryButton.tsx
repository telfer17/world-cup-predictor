"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { DEADLINE } from "@/lib/constants";

// Re-check every minute; the snapshot is a boolean so renders only happen
// when the lock state actually flips. Server snapshot is "not locked" —
// after the deadline the client corrects itself right after hydration.
function subscribe(onStoreChange: () => void) {
  const timer = setInterval(onStoreChange, 60_000);
  return () => clearInterval(timer);
}

function useLocked() {
  return useSyncExternalStore(
    subscribe,
    () => Date.now() >= DEADLINE.getTime(),
    () => false
  );
}

export default function FindEntryButton() {
  const locked = useLocked();
  return (
    <Link
      href="/find"
      className="rounded-md border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50"
    >
      {locked ? "View my entry" : "Edit my entry"}
    </Link>
  );
}
