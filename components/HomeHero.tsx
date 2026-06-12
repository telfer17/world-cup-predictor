"use client";

import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import FindEntryButton from "@/components/FindEntryButton";
import { useAfterDeadline } from "@/components/useDeadline";

export default function HomeHero() {
  const closed = useAfterDeadline();

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
