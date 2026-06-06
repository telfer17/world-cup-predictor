import LeaderboardTable from "@/components/LeaderboardTable";

export const metadata = {
  title: "Leaderboard · Glasgow Wellington World Cup 2026 Predictor",
};

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Top three win a share of the prize pot. Updates automatically during
        matches.
      </p>
      <LeaderboardTable />
    </main>
  );
}
