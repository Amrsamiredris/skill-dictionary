"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/track-client";
import {
  getLocalFeedback,
  saveLocalFeedback,
} from "@/lib/session";

export function SkillFeedback({
  skillId,
  initialLikes = 0,
  initialDislikes = 0,
}: {
  skillId: string;
  initialLikes?: number;
  initialDislikes?: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [vote, setVote] = useState<1 | -1 | null>(() => {
    const local = getLocalFeedback();
    return local[skillId] ?? null;
  });

  const handleVote = async (newVote: 1 | -1) => {
    const prev = vote;
    let nextLikes = likes;
    let nextDislikes = dislikes;

    if (prev === newVote) return;

    if (prev === 1) nextLikes -= 1;
    if (prev === -1) nextDislikes -= 1;
    if (newVote === 1) nextLikes += 1;
    if (newVote === -1) nextDislikes += 1;

    setVote(newVote);
    setLikes(nextLikes);
    setDislikes(nextDislikes);
    saveLocalFeedback(skillId, newVote);

    const ok = await submitFeedback(skillId, newVote);
    if (!ok) {
      setVote(prev);
      setLikes(likes);
      setDislikes(dislikes);
    }
  };

  const total = likes + dislikes;
  const pct = total > 0 ? Math.round((likes / total) * 100) : null;

  return (
    <div className="skill-feedback">
      <button
        type="button"
        className={`feedback-btn${vote === 1 ? " active-like" : ""}`}
        onClick={() => handleVote(1)}
        aria-label="Like this skill"
        aria-pressed={vote === 1}
      >
        👍 {likes > 0 ? likes : ""}
      </button>
      <button
        type="button"
        className={`feedback-btn${vote === -1 ? " active-dislike" : ""}`}
        onClick={() => handleVote(-1)}
        aria-label="Dislike this skill"
        aria-pressed={vote === -1}
      >
        👎 {dislikes > 0 ? dislikes : ""}
      </button>
      {pct !== null && total >= 3 && (
        <span className="feedback-pct">{pct}% liked</span>
      )}
    </div>
  );
}
