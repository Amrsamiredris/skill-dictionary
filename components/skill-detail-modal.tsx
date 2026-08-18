"use client";

import { useEffect, useState, useCallback } from "react";
import type { Skill } from "@/lib/skills";

function getCatColor(cat: string): string {
  let hash = 0;
  for (let i = 0; i < cat.length; i++) {
    hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export function SkillDetailModal({
  skill,
  onClose,
  onToggleStack,
  isInStack,
}: {
  skill: Skill | null;
  onClose: () => void;
  onToggleStack: (skillId: string) => void;
  onSelectSkill?: (id: string) => void;
  isInStack: boolean;
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const copyText = useCallback(async (text: string, type: "prompt" | "cli") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (type === "prompt") {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  }, []);

  if (!skill) return null;

  const promptText = skill.prompt || "follow the " + skill.name + " skill for this: [describe your task]";
  const cliCommand = "npx antigravity add " + skill.id;
  const catColor = getCatColor(skill.cat);

  return (
    <div
      className="modal-overlay is-open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="detail-modal">
        {/* Modal Top Header */}
        <div className="detail-modal-header">
          <div className="detail-modal-badge-row">
            <span className="detail-cat-badge" style={{ "--cat-accent": catColor } as React.CSSProperties}>
              <span className="cat-dot" style={{ backgroundColor: catColor }} />
              {skill.cat}
            </span>
            {skill.source && (
              <span className="detail-source-badge">{skill.source}</span>
            )}
          </div>
          <button
            type="button"
            className="detail-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Title & One-liner */}
        <h2 className="detail-modal-title">{skill.name}</h2>
        <p className="detail-modal-desc">{skill.oneliner || "No description provided."}</p>

        {/* When to use */}
        {skill.when && (
          <div className="detail-section">
            <h3 className="detail-section-label">When to use</h3>
            <p className="detail-when-box">{skill.when}</p>
          </div>
        )}

        {/* Action: Copy Prompt */}
        <div className="detail-section">
          <div className="detail-section-header">
            <h3 className="detail-section-label">Prompt Directive</h3>
            <button
              type="button"
              className={"detail-copy-btn " + (copiedPrompt ? "is-copied" : "")}
              onClick={() => copyText(promptText, "prompt")}
            >
              {copiedPrompt ? "✓ Prompt Copied" : "📋 Copy Prompt"}
            </button>
          </div>
          <pre className="detail-code-block">
            <code>{promptText}</code>
          </pre>
        </div>

        {/* Action: CLI Install */}
        <div className="detail-section">
          <div className="detail-section-header">
            <h3 className="detail-section-label">Antigravity CLI Command</h3>
            <button
              type="button"
              className={"detail-copy-btn " + (copiedCli ? "is-copied" : "")}
              onClick={() => copyText(cliCommand, "cli")}
            >
              {copiedCli ? "✓ Command Copied" : "⚡ Copy CLI Command"}
            </button>
          </div>
          <pre className="detail-code-block cli">
            <code>{cliCommand}</code>
          </pre>
        </div>

        {/* Target Platforms */}
        <div className="detail-section">
          <h3 className="detail-section-label">Compatible Agent Frameworks</h3>
          <div className="detail-platform-pills">
            <span className="platform-pill active">Claude</span>
            <span className="platform-pill active">ChatGPT / GPT-4o</span>
            <span className="platform-pill active">Antigravity 2.0</span>
            <span className="platform-pill active">Codex / GitHub Copilot</span>
            <span className="platform-pill active">Cursor IDE</span>
          </div>
        </div>

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="detail-section">
            <h3 className="detail-section-label">Tags</h3>
            <div className="tags">
              {skill.tags.map((t) => (
                <span key={t} className="tag">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="detail-modal-footer">
          <button
            type="button"
            className={"btn-stack-toggle " + (isInStack ? "in-stack" : "")}
            onClick={() => onToggleStack(skill.id)}
          >
            {isInStack ? "★ In Your Stack (Click to Remove)" : "☆ Add to Stack Builder"}
          </button>
          {skill.gh && (
            <a
              href={skill.gh}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-github-link"
            >
              View on GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
