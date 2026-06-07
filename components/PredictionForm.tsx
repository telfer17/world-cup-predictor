"use client";

import { useMemo, useState } from "react";
import { TeamLabel } from "@/components/TeamFlag";

export type Participant = {
  id: string;
  name: string;
  paid: boolean;
};

export type Match = {
  id: number;
  grp: string;
  home: string;
  away: string;
  kickoff: string;
  home_score: number | null;
  away_score: number | null;
};

export type Prediction = {
  match_id: number;
  home_pred: number;
  away_pred: number;
};

type SaveState = "idle" | "saving" | "saved" | "error" | "empty";

// All kickoff times are displayed in UK time.
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

type Props = {
  participant: Participant;
  matches: Match[];
  existing: Prediction[];
  locked: boolean;
  /** Where Save POSTs. Defaults to the public route. */
  endpoint?: string;
  /** Admin paper-entry: keep the form editable regardless of the deadline. */
  forceEditable?: boolean;
};

export default function PredictionForm({
  participant,
  matches,
  existing,
  locked: lockedProp,
  endpoint = "/api/predictions",
  forceEditable = false,
}: Props) {
  const locked = forceEditable ? false : lockedProp;
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>(
    () => {
      const initial: Record<number, { home: string; away: string }> = {};
      for (const p of existing) {
        initial[p.match_id] = {
          home: String(p.home_pred),
          away: String(p.away_pred),
        };
      }
      return initial;
    }
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Count saved at the moment of a successful save, so the confirmation
  // doesn't drift if the user keeps typing afterwards.
  const [savedCount, setSavedCount] = useState(0);

  const completed = useMemo(
    () =>
      Object.values(scores).filter((s) => s.home !== "" && s.away !== "")
        .length,
    [scores]
  );
  const total = matches.length;

  const days = useMemo(() => {
    const sorted = [...matches].sort(
      (a, b) =>
        new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime() ||
        a.id - b.id
    );
    // Group under date headers; insertion order is chronological.
    const byDate = new Map<string, Match[]>();
    for (const match of sorted) {
      const date = dateFormatter.format(new Date(match.kickoff));
      const list = byDate.get(date) ?? [];
      list.push(match);
      byDate.set(date, list);
    }
    return [...byDate.entries()];
  }, [matches]);

  function setScore(matchId: number, side: "home" | "away", value: string) {
    // Allow only empty or 1-2 digit numbers.
    if (!/^\d{0,2}$/.test(value)) return;
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        home: prev[matchId]?.home ?? "",
        away: prev[matchId]?.away ?? "",
        [side]: value,
      },
    }));
    setSaveState("idle");
  }

  async function save() {
    const predictions = Object.entries(scores)
      .filter(([, s]) => s.home !== "" && s.away !== "")
      .map(([matchId, s]) => ({
        match_id: Number(matchId),
        home_pred: Number(s.home),
        away_pred: Number(s.away),
      }));

    if (predictions.length === 0) {
      setSaveState("empty");
      return;
    }

    setSaveState("saving");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: participant.id, predictions }),
      });
      if (res.ok) {
        setSavedCount(predictions.length);
        setSaveState("saved");
      } else {
        setSaveState("error");
      }
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-8">
      <h1 className="text-2xl font-bold">{participant.name}&apos;s predictions</h1>
      <p className="mt-1 text-sm text-gray-500">
        Group stage — predict every match before the deadline.
      </p>

      {locked && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          The deadline has passed. Predictions are now read-only.
        </div>
      )}

      {days.map(([date, dayMatches]) => (
        <section key={date} className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">{date}</h2>
          <div className="divide-y divide-gray-200 rounded-md border border-gray-200">
            {dayMatches.map((match) => (
              <div key={match.id} className="w-full p-3">
                <div className="text-xs text-gray-400">
                  <span className="tabular-nums">
                    {timeFormatter.format(new Date(match.kickoff))}
                  </span>{" "}
                  · Group {match.grp}
                </div>
                <div className="mt-1 flex w-full items-center gap-2">
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere] text-right text-sm font-medium">
                    <TeamLabel team={match.home} flagSide="right" />
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={locked}
                    value={scores[match.id]?.home ?? ""}
                    onChange={(e) => setScore(match.id, "home", e.target.value)}
                    aria-label={`${match.home} score`}
                    className="w-12 shrink-0 rounded border border-gray-300 p-1 text-center disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <span className="shrink-0 text-gray-400">–</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={locked}
                    value={scores[match.id]?.away ?? ""}
                    onChange={(e) => setScore(match.id, "away", e.target.value)}
                    aria-label={`${match.away} score`}
                    className="w-12 shrink-0 rounded border border-gray-300 p-1 text-center disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere] text-sm font-medium">
                    <TeamLabel team={match.away} flagSide="left" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {!locked && (
        <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 p-3 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <span className="text-sm text-gray-500">
              {saveState === "saving" && "Saving…"}
              {saveState === "saved" && (
                <span className="font-medium text-green-700">
                  Saved — {savedCount} of {total} predicted. Blank matches
                  score 0.
                </span>
              )}
              {saveState === "error" && (
                <span className="text-red-600">Save failed — try again.</span>
              )}
              {saveState === "empty" && (
                <span className="text-amber-700">
                  Enter at least one score before saving.
                </span>
              )}
            </span>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm tabular-nums text-gray-500">
                {completed} of {total} predicted
              </span>
              <button
                onClick={save}
                disabled={saveState === "saving"}
                className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Save predictions
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
