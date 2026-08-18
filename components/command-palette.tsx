"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type { Skill } from "@/lib/skills";

function getCatColor(cat: string): string {
  let hash = 0;
  for (let i = 0; i < cat.length; i++) {
    hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export function CommandPalette({
  isOpen,
  onClose,
  skills,
  onSelectSkill,
}: {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  onSelectSkill: (skill: Skill) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent("open-command-palette"));
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return skills.slice(0, 20);

    const matches: Skill[] = [];
    for (const s of skills) {
      if (
        s.name.toLowerCase().includes(q) ||
        (s.oneliner && s.oneliner.toLowerCase().includes(q)) ||
        s.cat.toLowerCase().includes(q) ||
        (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
      ) {
        matches.push(s);
        if (matches.length >= 30) break;
      }
    }
    return matches;
  }, [query, skills]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        onSelectSkill(filtered[selectedIndex]);
        onClose();
      }
    },
    [filtered, selectedIndex, onSelectSkill, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay is-open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cmd-palette-modal">
        <div className="cmd-palette-input-wrap">
          <span className="cmd-palette-search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input"
            placeholder="Search 2,150+ skills by name, framework, task, or domain..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="cmd-palette-esc-badge" onClick={onClose}>
            ESC
          </span>
        </div>

        <div className="cmd-palette-list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cmd-palette-empty">
              No matching skills found for &quot;{query}&quot;. Try searching a domain like &quot;frontend&quot;, &quot;security&quot;, &quot;agent&quot;, or &quot;design&quot;.
            </div>
          ) : (
            filtered.map((skill, idx) => {
              const isSelected = idx === selectedIndex;
              const catColor = getCatColor(skill.cat);

              return (
                <div
                  key={skill.id}
                  className={"cmd-palette-item " + (isSelected ? "is-selected" : "")}
                  onClick={() => {
                    onSelectSkill(skill);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="cmd-palette-item-main">
                    <span className="cat-dot" style={{ backgroundColor: catColor }} />
                    <span className="cmd-palette-item-name">{skill.name}</span>
                    <span className="cmd-palette-item-cat">({skill.cat})</span>
                  </div>
                  <span className="cmd-palette-item-desc">{skill.oneliner}</span>
                  <span className="cmd-palette-item-enter">↵ Select</span>
                </div>
              );
            })
          )}
        </div>

        <div className="cmd-palette-footer">
          <div className="cmd-palette-hints">
            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to inspect skill</span>
            <span><kbd>ESC</kbd> to close</span>
          </div>
          <span className="cmd-palette-count">{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
