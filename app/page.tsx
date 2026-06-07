import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import FindEntryButton from "@/components/FindEntryButton";

const scoring = [
  { pts: 5, rule: "Exact score" },
  {
    pts: 3,
    rule: "Correct result plus winning team's goals (ie. you predict 3-0, but game finishes 3-1)",
  },
  { pts: 2, rule: "Correct result only" },
  { pts: 0, rule: "Anything else" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4">
      {/* Hero */}
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
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Predict all 72 World Cup group-stage scores. £10 to enter — half the
          prize pot, half to the club.
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
      </section>

      {/* Countdown */}
      <section className="pb-16">
        <Countdown />
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-t border-gray-200 py-16"
      >
        <h2 className="text-2xl font-bold">How it works</h2>

        <h3 className="mt-6 text-lg font-semibold">Two ways to enter</h3>
        <div className="mt-3 grid gap-6 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold">Enter online</h3>
            <p className="mt-2 text-sm text-gray-600">
              Hit Enter, add your details, and fill in your score predictions
              for all 72 group games before the first kick-off.
            </p>
            <Link
              href="/enter"
              className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Enter now
            </Link>
          </div>

          <div className="rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold">Enter on paper</h3>
            <p className="mt-2 text-sm text-gray-600">
              Download the prediction sheet, fill it in on your phone or
              computer, or print it and write on it by hand. Then send a photo
              of your completed sheet to your club contact, who&apos;ll pass it
              on to be added to the leaderboard for you.
            </p>
            <a
              href="/prediction-sheet.pdf"
              target="_blank"
              download
              className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Download the prediction sheet (PDF)
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold">£10 entry</h3>
            <p className="mt-2 text-sm text-gray-600">
              £5 goes into the prize pot, £5 goes to the club.
            </p>
            <h4 className="mt-4 font-semibold">Prizes (top 3)</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="w-10 shrink-0 font-semibold text-gray-900">
                  1st
                </span>
                60% of the prize pot
              </li>
              <li className="flex gap-2">
                <span className="w-10 shrink-0 font-semibold text-gray-900">
                  2nd
                </span>
                30% of the prize pot
              </li>
              <li className="flex gap-2">
                <span className="w-10 shrink-0 font-semibold text-gray-900">
                  3rd
                </span>
                10% of the prize pot
              </li>
            </ul>
            <p className="mt-2 text-sm text-gray-500">
              Final prize amounts confirmed once all entries are in.
            </p>
          </div>

          <div className="rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold">Predict every game</h3>
            <p className="mt-2 text-sm text-gray-600">
              Predict the exact score of all 72 group games before the first
              kick-off at 20:00 UK time on 11 June.
            </p>
          </div>

          <div className="rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold">Scoring</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {scoring.map((s) => (
                <li key={s.pts} className="flex gap-2">
                  <span className="w-10 shrink-0 font-semibold text-gray-900">
                    {s.pts} pts
                  </span>
                  {s.rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold">Edit until kick-off</h3>
            <p className="mt-2 text-sm text-gray-600">
              Change your predictions as often as you like until the first
              kick-off on 11 June — then everything locks.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-gray-200 p-5">
          <h3 className="font-semibold">How to pay</h3>
          <p className="mt-2 text-sm text-gray-600">
            £10 per entry. Pay by bank transfer, or hand cash to the club member
            you entered through.
          </p>
          <dl className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 font-semibold text-gray-900">
                Account name
              </dt>
              <dd>Glasgow Wellington Football Club Limited</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 font-semibold text-gray-900">
                Bank
              </dt>
              <dd>Co-operative Bank</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 font-semibold text-gray-900">
                Sort code
              </dt>
              <dd>08-92-50</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 font-semibold text-gray-900">
                Account number
              </dt>
              <dd>63295276</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 font-semibold text-gray-900">
                Reference
              </dt>
              <dd>use your entry name, so we can match your payment.</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
