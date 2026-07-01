"use client";

import type { GlobalTotals } from "@/lib/types";
import { SKILLS } from "@/lib/skills";
import { getLocalUsage } from "@/lib/session";
import { useEffect, useState } from "react";

export function GlobalStatsBar() {
  const [localUsed, setLocalUsed] = useState(0);
  const [totals, setTotals] = useState<GlobalTotals | null>(null);

  useEffect(() => {
    const usage = getLocalUsage();
    setLocalUsed(
      Object.values(usage).reduce((sum, n) => sum + n, 0),
    );

    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: { totals: GlobalTotals | null }) => {
        if (data.totals) setTotals(data.totals);
      })
      .catch(() => {});
  }, []);

  const likePct =
    totals && totals.likes + totals.dislikes > 0
      ? Math.round(
          (totals.likes / (totals.likes + totals.dislikes)) * 100,
        )
      : null;

  return (
    <div className="stats-bar" aria-live="polite">
      <span>
        <strong>{SKILLS.length}</strong> skills
      </span>
      {totals && totals.copies > 0 && (
        <span>
          <strong>{totals.copies.toLocaleString()}</strong> copies
        </span>
      )}
      {totals && totals.github_clicks > 0 && (
        <span>
          <strong>{totals.github_clicks.toLocaleString()}</strong> GitHub
        </span>
      )}
      {totals && totals.installs_yes > 0 && (
        <span>
          <strong>{totals.installs_yes.toLocaleString()}</strong> installed
        </span>
      )}
      {likePct !== null && (
        <span>
          <strong>{likePct}%</strong> liked
        </span>
      )}
      {localUsed > 0 && (
        <span>
          <strong>{localUsed}</strong> your copies
        </span>
      )}
    </div>
  );
}
