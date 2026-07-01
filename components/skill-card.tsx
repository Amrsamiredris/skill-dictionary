"use client";

import { useCallback, useEffect, useState } from "react";
import type { Skill } from "@/lib/skills";
import { CAT_VAR } from "@/lib/skills";
import { trackEvent } from "@/lib/track-client";
import {
  getLocalUsage,
  saveLocalUsage,
} from "@/lib/session";
import { InstallPrompt, shouldShowInstallPrompt } from "@/components/install-prompt";
import { SkillFeedback } from "@/components/skill-feedback";
import type { FeedbackAgg, SkillStats } from "@/lib/types";
import {
  MOTION,
  staggerDelay,
  usePrefersReducedMotion,
  useReveal,
} from "@/lib/motion";

function getCatColor(cat: string): string {
  const v = CAT_VAR[cat];
  if (!v) return "var(--accent)";
  return `var(${v})`;
}

export function SkillCard({
  skill,
  index,
  isHiding = false,
  animateIn = false,
  staggerMode = "initial",
  stats,
  feedback,
}: {
  skill: Skill;
  index: number;
  isHiding?: boolean;
  animateIn?: boolean;
  staggerMode?: "initial" | "filter";
  stats?: SkillStats;
  feedback?: FeedbackAgg;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animateIn && !reducedMotion && !isHiding;
  const revealed = useReveal(shouldAnimate, [skill.id, shouldAnimate]);
  const [localCount, setLocalCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const usage = getLocalUsage();
    setLocalCount(usage[skill.id] ?? 0);
  }, [skill.id]);

  const onCopySuccess = useCallback(() => {
    const usage = getLocalUsage();
    usage[skill.id] = (usage[skill.id] ?? 0) + 1;
    saveLocalUsage(usage);
    setLocalCount(usage[skill.id]);
    setCopied(true);
    trackEvent(skill.id, "copy");
    if (shouldShowInstallPrompt(skill.id)) {
      setShowInstall(true);
    }
    setTimeout(() => setCopied(false), 2000);
  }, [skill.id]);

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(skill.prompt);
      onCopySuccess();
    } catch {
      const ta = document.createElement("textarea");
      ta.value = skill.prompt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        onCopySuccess();
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
  }, [skill.prompt, onCopySuccess]);

  const onGithubClick = () => {
    trackEvent(skill.id, "github_click");
  };

  const delay = shouldAnimate && !revealed
    ? staggerDelay(
        index,
        staggerMode === "filter" ? MOTION.filterStagger : MOTION.enterStagger,
        staggerMode === "filter"
          ? MOTION.filterStaggerMax
          : MOTION.enterStaggerMax,
      )
    : 0;
  const catColor = getCatColor(skill.cat);
  const cardClass = isHiding
    ? "skill-card is-hiding"
    : revealed
      ? "skill-card is-visible"
      : "skill-card is-entering";

  const globalMeta: string[] = [];
  if (stats && stats.copies > 0) globalMeta.push(`${stats.copies} copies`);
  if (stats && stats.github_clicks > 0)
    globalMeta.push(`${stats.github_clicks} GitHub`);

  return (
    <article
      className={cardClass}
      role="listitem"
      data-id={skill.id}
      style={
        {
          "--cat-color": catColor,
          transitionDelay: delay ? `${delay}ms` : undefined,
        } as React.CSSProperties
      }
    >
      <div className="card-top">
        <div className="skill-name-row">
          <span className="cat-dot" aria-hidden="true" />
          <h2 className="skill-name">{skill.name}</h2>
        </div>
        {localCount > 0 && (
          <span className="usage-badge">used {localCount}x</span>
        )}
      </div>
      <p className="skill-oneliner">{skill.oneliner}</p>
      <div className="skill-when">
        <strong>Use when</strong>
        {skill.when}
      </div>
      <div className="tags">
        {skill.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      {globalMeta.length > 0 && (
        <p className="global-meta">{globalMeta.join(" · ")}</p>
      )}
      <SkillFeedback
        skillId={skill.id}
        initialLikes={feedback?.likes ?? 0}
        initialDislikes={feedback?.dislikes ?? 0}
      />
      <div className="card-actions">
        <button
          type="button"
          className={`btn btn-copy${copied ? " copied" : ""}`}
          onClick={copyPrompt}
          aria-label={`Copy prompt for ${skill.name}`}
        >
          <span className="btn-label">Copy Prompt</span>
          <svg
            className="btn-check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path className="btn-check-path" d="M20 6L9 17l-5-5" />
          </svg>
        </button>
        <a
          className="btn btn-gh"
          href={skill.gh}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${skill.name} on GitHub`}
          onClick={onGithubClick}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
      {showInstall && (
        <InstallPrompt
          skillId={skill.id}
          skillName={skill.name}
          onDismiss={() => setShowInstall(false)}
        />
      )}
    </article>
  );
}
