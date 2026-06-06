"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type LeaderboardRow = {
  name: string;
  points: number;
  exact_scores: number;
};

const REFRESH_MS = 60_000;

const updatedFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export default function LeaderboardTable() {
  // null = first fetch not finished yet (loading state).
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    async function load() {
      if (inFlight || cancelled) return;
      inFlight = true;
      try {
        const { data, error } = await supabaseBrowser
          .from("leaderboard")
          .select("*")
          .order("points", { ascending: false })
          .order("exact_scores", { ascending: false })
          .order("name")
          .returns<LeaderboardRow[]>();
        if (cancelled) return;
        if (error) {
          setFailed(true);
          return;
        }
        setRows(data);
        setUpdatedAt(new Date());
        setFailed(false);
      } finally {
        inFlight = false;
      }
    }

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  if (rows === null) {
    return (
      <p className="mt-8 text-center text-gray-500">
        {failed
          ? "Couldn't load the leaderboard — retrying shortly."
          : "Loading the leaderboard…"}
      </p>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between text-sm text-gray-500">
        <span>
          {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </span>
        <span>
          {failed
            ? "Refresh failed — showing last results"
            : updatedAt && `Updated ${updatedFormatter.format(updatedAt)}`}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-md border border-gray-200 p-6 text-center text-gray-500">
          No entries on the board yet.
        </p>
      ) : (
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-2 font-semibold">#</th>
              <th className="py-2 pr-2 font-semibold">Name</th>
              <th className="py-2 pr-2 text-right font-semibold">Points</th>
              <th className="py-2 text-right font-semibold">Exact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-gray-200 ${
                  i < 3 ? "bg-amber-50 font-medium" : ""
                }`}
              >
                <td className="py-2 pr-2 tabular-nums text-gray-500">
                  {i + 1}
                </td>
                <td className="py-2 pr-2">{row.name}</td>
                <td className="py-2 pr-2 text-right tabular-nums font-semibold">
                  {row.points}
                </td>
                <td className="py-2 text-right tabular-nums text-gray-500">
                  {row.exact_scores}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
