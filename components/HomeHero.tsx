"use client";

import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import FindEntryButton from "@/components/FindEntryButton";
import LeaderboardTable from "@/components/LeaderboardTable";
import {
  useAfterDeadline,
  useAfterFinalPhase,
  usePreviewFinal,
} from "@/components/useDeadline";

export default function HomeHero() {
  const closed = useAfterDeadline();
  const previewFinal = usePreviewFinal();
  const finalPhase = useAfterFinalPhase() || previewFinal;

  // Closing stretch: lead with the live standings.
  if (finalPhase) {
    return (
      <section className="py-10">
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
          <p className="mx-auto mt-2 max-w-2xl text-gray-600">
            The run-in — live standings. Group games run until 3am UK on Sunday
            28 June.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight">Standings</h2>
          <LeaderboardTable limit={15} forceExact />
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={previewFinal ? "/leaderboard?preview=final" : "/leaderboard"}
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
        </div>

        <div className="mt-8 rounded-md border border-gray-200 p-5">
          <h2 className="text-lg font-semibold">How the prizes are decided</h2>
          <p className="mt-3 text-sm font-medium text-gray-900">Points:</p>
          <ul className="mt-1 space-y-0.5 text-sm text-gray-600">
            <li>5 for an exact score</li>
            <li>
              3 for the right result with the winning team&apos;s goals correct
            </li>
            <li>2 for the right result</li>
          </ul>
          <p className="mt-3 text-sm font-medium text-gray-900">
            Top three take the money:
          </p>
          <p className="mt-1 text-sm text-gray-600">1st £160, 2nd £80, 3rd £25</p>
          <p className="mt-3 text-sm text-gray-600">
            Level on points? The Exact column is the tie-breaker — person with
            the most exact scores predicted will win.
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Identical on points and exact scores? Those tied players share the
            combined prize money for the places they&apos;re tied across, split
            evenly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 text-center">
        <Image
          src="/wellington.jpg"
          alt="Glasgow Wellington logo"
          width={160}
          height={160}
          priority
          className="mx-auto rounded-full"
        />
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Glasgow Wellington · World Cup 2026 Predictor
        </h1>

        {closed ? (
          <>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Entries are closed — the tournament&apos;s underway. Follow the
              leaderboard to see who&apos;s on top.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/leaderboard"
                className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
              >
                View leaderboard
              </Link>
              <FindEntryButton />
              <Link
                href="/grid"
                className="rounded-md border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50"
              >
                View all picks
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Already entered? Pull up your predictions with your phone number
              to follow your scores.
            </p>
          </>
        ) : (
          <>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Predict all 72 World Cup group-stage scores. £10 to enter — half to
              the prize pot, half to the club.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/enter"
                className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
              >
                Enter now
              </Link>
              <FindEntryButton />
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Already entered? Use your phone number to get back to your
              predictions.
            </p>
          </>
        )}
      </section>

      {!closed && (
        <section className="pb-16">
          <Countdown />
        </section>
      )}
    </>
  );
}
