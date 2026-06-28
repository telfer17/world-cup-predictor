"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  computePodium,
  formatPrize,
  MEDAL_TINTS,
  type PodiumEntry,
  type StandingRow,
} from "@/lib/standings";
import PrizeRules from "@/components/PrizeRules";

const PLACE_LABEL: Record<number, string> = {
  1: "1st — Gold",
  2: "2nd — Silver",
  3: "3rd — Bronze",
};

export default function WinnersPodium() {
  // The competition is over, so the standings are final — fetch once.
  const [rows, setRows] = useState<StandingRow[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabaseBrowser
        .from("leaderboard")
        .select("*")
        .order("points", { ascending: false })
        .order("exact_scores", { ascending: false })
        .order("name")
        .returns<StandingRow[]>();
      if (cancelled) return;
      if (error) setFailed(true);
      else setRows(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const podium = rows ? computePodium(rows) : [];
  const byPlace = new Map<number, PodiumEntry[]>();
  for (const entry of podium) {
    const list = byPlace.get(entry.place) ?? [];
    list.push(entry);
    byPlace.set(entry.place, list);
  }
  const places = [...byPlace.keys()].sort((a, b) => a - b);

  return (
    <section className="mx-auto max-w-2xl py-10">
      <div className="text-center">
        <Image
          src="/wellington.jpg"
          alt="Glasgow Wellington logo"
          width={96}
          height={96}
          priority
          className="mx-auto rounded-full"
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Glasgow Wellington · World Cup 2026 Predictor
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-gray-600">
          That&apos;s a wrap — the group stage is done and the prizes are
          settled. Congratulations to our winners!
        </p>
      </div>

      <h2 className="mt-8 text-2xl font-bold tracking-tight">
        Final standings — Winners
      </h2>

      {rows === null ? (
        <p className="mt-6 text-center text-gray-500">
          {failed ? "Couldn’t load the results." : "Loading the results…"}
        </p>
      ) : podium.length === 0 ? (
        <p className="mt-6 rounded-md border border-gray-200 p-6 text-center text-gray-500">
          No winners to show yet.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {places.map((place) => (
            <div
              key={place}
              className={`rounded-lg border border-black/10 p-5 ${MEDAL_TINTS[place]}`}
            >
              <div className="text-sm font-bold uppercase tracking-wide text-gray-900">
                {PLACE_LABEL[place]}
              </div>
              <ul className="mt-2 space-y-2">
                {byPlace.get(place)!.map((entry) => (
                  <li
                    key={entry.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-gray-900"
                  >
                    <span className="text-lg font-bold">{entry.name}</span>
                    <span className="text-sm tabular-nums">
                      {entry.points} pts · {entry.exact_scores} exact
                    </span>
                    <span className="w-full text-right text-lg font-bold tabular-nums sm:w-auto">
                      {formatPrize(entry.prize)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/leaderboard"
          className="rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Full leaderboard
        </Link>
        <Link
          href="/grid"
          className="rounded-md border-2 border-blue-600 px-5 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
        >
          All picks
        </Link>
      </div>

      <PrizeRules />
    </section>
  );
}
