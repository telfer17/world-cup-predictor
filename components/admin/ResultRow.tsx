"use client";

import { useRef, useState, useTransition } from "react";
import { setResult } from "@/app/admin/results/actions";
import { validateResult } from "@/lib/admin-results";

type Props = {
  matchId: number;
  grp: string;
  home: string;
  away: string;
  time: string;
  initialHome: string;
  initialAway: string;
};

export default function ResultRow({
  matchId,
  grp,
  home,
  away,
  time,
  initialHome,
  initialAway,
}: Props) {
  const [homeVal, setHomeVal] = useState(initialHome);
  const [awayVal, setAwayVal] = useState(initialAway);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pending, startTransition] = useTransition();
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compare against props: after a save revalidates the page, fresh props
  // make the row read as unchanged again.
  const changed = homeVal !== initialHome || awayVal !== initialAway;
  const hasResult = initialHome !== "" && initialAway !== "";

  function setScore(side: "home" | "away", value: string) {
    if (!/^\d{0,2}$/.test(value)) return;
    (side === "home" ? setHomeVal : setAwayVal)(value);
    setStatus("idle");
  }

  function save(homeRaw: string, awayRaw: string) {
    const validation = validateResult(homeRaw, awayRaw);
    if (!validation.ok) {
      setErrorMsg(validation.error);
      setStatus("error");
      return;
    }
    startTransition(async () => {
      try {
        await setResult(matchId, homeRaw, awayRaw);
        setStatus("saved");
        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setStatus("idle"), 2_500);
      } catch {
        setErrorMsg("Save failed — try again.");
        setStatus("error");
      }
    });
  }

  return (
    <div className={hasResult ? "border-l-2 border-green-500 bg-green-50/40" : ""}>
      <div className="grid grid-cols-[auto_auto_1fr_auto_auto_auto_1fr_auto_auto] items-center gap-2 p-3">
        <span className="text-sm tabular-nums text-gray-500">{time}</span>
        <span className="w-16 text-xs text-gray-400">Group {grp}</span>
        <span className="text-right text-sm font-medium">{home}</span>
        <input
          type="text"
          inputMode="numeric"
          value={homeVal}
          disabled={pending}
          onChange={(e) => setScore("home", e.target.value)}
          aria-label={`${home} score`}
          className="w-12 rounded border border-gray-300 p-1 text-center disabled:bg-gray-100"
        />
        <span className="text-gray-400">–</span>
        <input
          type="text"
          inputMode="numeric"
          value={awayVal}
          disabled={pending}
          onChange={(e) => setScore("away", e.target.value)}
          aria-label={`${away} score`}
          className="w-12 rounded border border-gray-300 p-1 text-center disabled:bg-gray-100"
        />
        <span className="text-sm font-medium">{away}</span>
        <button
          type="button"
          disabled={!changed || pending}
          onClick={() => save(homeVal, awayVal)}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          Save
        </button>
        <button
          type="button"
          disabled={pending || (homeVal === "" && awayVal === "")}
          onClick={() => {
            setHomeVal("");
            setAwayVal("");
            save("", "");
          }}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          Clear
        </button>
      </div>
      {status === "saved" && (
        <p className="px-3 pb-2 text-xs font-medium text-green-700">Saved ✓</p>
      )}
      {status === "error" && (
        <p className="px-3 pb-2 text-xs text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}
