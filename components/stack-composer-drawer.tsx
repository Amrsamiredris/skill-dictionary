"use client";

import { useState, useCallback } from "react";
import type { Skill } from "@/lib/skills";

export function StackComposerDrawer({
  stackSkills,
  onRemoveSkill,
  onClearStack,
}: {
  stackSkills: Skill[];
  onRemoveSkill: (id: string) => void;
  onClearStack: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCombinedPrompt = useCallback(() => {
    if (stackSkills.length === 0) return "";
    let prompt = "Follow this combined multi-skill directive for this task:\n\n";
    prompt += "### Active Skills & Frameworks:\n";
    stackSkills.forEach((s, idx) => {
      prompt += (idx + 1) + ". **" + s.name + "** (" + s.cat + "): " + (s.oneliner || "Standard practice") + "\n";
      if (s.when) prompt += "   - Primary trigger: " + s.when + "\n";
    });
    prompt += "\n### Execution Instructions:\n";
    prompt += "Apply all the design, architecture, quality, and domain principles from these skills synergistically.\n\n";
    prompt += "Task details: [describe your task here]";
    return prompt;
  }, [stackSkills]);

  const copyCombinedPrompt = useCallback(async () => {
    const text = generateCombinedPrompt();
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateCombinedPrompt]);

  const downloadRulesFile = useCallback(() => {
    const text = "# AI Skill Stack Configuration\n\n" + generateCombinedPrompt();
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AGENTSKILL.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateCombinedPrompt]);

  if (stackSkills.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Dock */}
      <div className="stack-floating-dock">
        <div className="stack-dock-content">
          <div className="stack-dock-info">
            <span className="stack-dock-badge">{stackSkills.length}</span>
            <div className="stack-dock-text">
              <strong>Active Skill Stack</strong>
              <span>{stackSkills.map((s) => s.name).slice(0, 3).join(", ")}{stackSkills.length > 3 ? " + " + (stackSkills.length - 3) + " more" : ""}</span>
            </div>
          </div>
          <div className="stack-dock-actions">
            <button
              type="button"
              className="btn btn-stack-copy"
              onClick={copyCombinedPrompt}
            >
              {copied ? "✓ Copied Stack Prompt" : "⚡ Copy Stack"}
            </button>
            <button
              type="button"
              className="btn btn-stack-open"
              onClick={() => setIsOpen(true)}
            >
              Compose & Export ↗
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Stack Composer Modal */}
      {isOpen && (
        <div
          className="modal-overlay is-open"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="detail-modal stack-modal">
            <div className="detail-modal-header">
              <div>
                <h2 className="detail-modal-title">Skill Stack Composer</h2>
                <p className="detail-modal-desc">
                  Combine {stackSkills.length} modular skills into a unified AI prompt or configuration file.
                </p>
              </div>
              <button
                type="button"
                className="detail-modal-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* List of included skills */}
            <div className="stack-items-list">
              {stackSkills.map((skill) => (
                <div key={skill.id} className="stack-item-row">
                  <div>
                    <strong>{skill.name}</strong>
                    <span className="stack-item-cat">({skill.cat})</span>
                    <p className="stack-item-desc">{skill.oneliner}</p>
                  </div>
                  <button
                    type="button"
                    className="stack-item-remove"
                    onClick={() => onRemoveSkill(skill.id)}
                    title="Remove from stack"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Combined Output Preview */}
            <div className="detail-section">
              <div className="detail-section-header">
                <h3 className="detail-section-label">Generated Combined Directive</h3>
                <span className="stack-token-estimate">Ready for Claude / ChatGPT / Codex</span>
              </div>
              <pre className="detail-code-block stack-code">
                <code>{generateCombinedPrompt()}</code>
              </pre>
            </div>

            {/* Footer actions */}
            <div className="stack-modal-footer">
              <button
                type="button"
                className="btn btn-clear-stack"
                onClick={onClearStack}
              >
                Clear Stack
              </button>
              <div className="stack-modal-primary-actions">
                <button
                  type="button"
                  className="btn btn-download-rules"
                  onClick={downloadRulesFile}
                >
                  Download AGENTSKILL.md
                </button>
                <button
                  type="button"
                  className={"btn btn-copy " + (copied ? "copied" : "")}
                  onClick={copyCombinedPrompt}
                >
                  {copied ? "✓ Copied!" : "📋 Copy Combined Prompt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
