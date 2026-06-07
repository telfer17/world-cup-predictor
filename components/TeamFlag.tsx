import { flagCode } from "@/lib/flags";

/**
 * Decorative flag beside a team name (the name itself is always shown as
 * text, hence aria-hidden). Renders nothing for unknown teams — never a
 * broken icon.
 */
export default function TeamFlag({ team }: { team: string }) {
  const code = flagCode(team);
  if (!code) return null;
  return <span className={`fi fi-${code} mx-1`} aria-hidden="true" />;
}
