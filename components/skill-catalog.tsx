"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  SKILLS,
    CATEGORIES,
  type Skill,
} from "@/lib/skills";
import { SkillCard } from "@/components/skill-card";
import { SkillDetailModal } from "@/components/skill-detail-modal";
import { StackComposerDrawer } from "@/components/stack-composer-drawer";
import { CommandPalette } from "@/components/command-palette";
import type { FeedbackAgg, SkillStats } from "@/lib/types";
import { MOTION } from "@/lib/motion";

const SKILL_BY_ID = new Map(SKILLS.map((s) => [s.id, s]));

export function SkillCatalog({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRole, setActiveRole] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "popular" | "name">("default");
  
  const [statsMap, setStatsMap] = useState<Record<string, SkillStats>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackAgg>>({});
  const [visibleCount, setVisibleCount] = useState(60);

  // Modals & Stack state
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [stackIds, setStackIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("sd_active_stack");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const filterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialRender = useRef(true);
  const displayIdsRef = useRef<string[]>(SKILLS.slice(0, 60).map((s) => s.id));

  const [displayIds, setDisplayIds] = useState<string[]>(() =>
    SKILLS.slice(0, 60).map((s) => s.id)
  );
  const [hidingIds, setHidingIds] = useState<Set<string>>(() => new Set());
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(
    () => new Set(SKILLS.slice(0, 60).map((s) => s.id))
  );
  const [staggerMode, setStaggerMode] = useState<"initial" | "filter">("initial");
  const [emptyVisible, setEmptyVisible] = useState(false);

  // Sync stack with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sd_active_stack", JSON.stringify(stackIds));
    } catch {
      /* ignore */
    }
  }, [stackIds]);

  const toggleStack = useCallback((skillId: string) => {
    setStackIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  }, []);

  const removeStack = useCallback((skillId: string) => {
    setStackIds((prev) => prev.filter((id) => id !== skillId));
  }, []);

  const clearStack = useCallback(() => {
    setStackIds([]);
  }, []);

  // Listen for Cmd+K open event
  useEffect(() => {
    const handleOpenCmd = () => setIsCmdOpen(true);
    window.addEventListener("open-command-palette", handleOpenCmd);
    return () => window.removeEventListener("open-command-palette", handleOpenCmd);
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: { skillStats: SkillStats[]; feedback: FeedbackAgg[] }) => {
        const sm: Record<string, SkillStats> = {};
        for (const s of data.skillStats ?? []) sm[s.skill_id] = s;
        setStatsMap(sm);
        const fm: Record<string, FeedbackAgg> = {};
        for (const f of data.feedback ?? []) fm[f.skill_id] = f;
        setFeedbackMap(fm);
      })
      .catch(() => {});
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SKILLS.length };
    for (const s of SKILLS) {
      counts[s.cat] = (counts[s.cat] || 0) + 1;
    }
    return counts;
  }, []);

  const filterSkills = useCallback((): Skill[] => {
    const q = searchQuery.toLowerCase().trim();
    let result = SKILLS.filter((skill) => {
      if (activeCategory !== "all" && skill.cat !== activeCategory) return false;
      if (activeRole !== "all" && (!skill.roles || !skill.roles.includes(activeRole)))
        return false;
      if (!q) return true;
      const haystack = [
        skill.name,
        skill.oneliner,
        skill.when,
        (skill.tags || []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    if (sortBy === "popular") {
      result = [...result].sort((a, b) => {
        const aUsage = (statsMap[a.id]?.copies || 0) + (statsMap[a.id]?.github_clicks || 0);
        const bUsage = (statsMap[b.id]?.copies || 0) + (statsMap[b.id]?.github_clicks || 0);
        return bUsage - aUsage;
      });
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, activeRole, searchQuery, sortBy, statsMap]);

  const filtered = filterSkills();
  const filteredIds = filtered.slice(0, visibleCount).map((s) => s.id);

  useEffect(() => {
    setVisibleCount(60);
  }, [searchQuery, activeCategory, activeRole, sortBy]);

  useEffect(() => {
    const prevIds = displayIdsRef.current;
    const removing = prevIds.filter((id) => !filteredIds.includes(id));

    if (removing.length > 0 && !isInitialRender.current) {
      setHidingIds(new Set(removing));
      setAnimatingIds(new Set());
      if (filterTimer.current) clearTimeout(filterTimer.current);
      filterTimer.current = setTimeout(() => {
        const added = filteredIds.filter((id) => !prevIds.includes(id));
        setDisplayIds(filteredIds);
        displayIdsRef.current = filteredIds;
        setHidingIds(new Set());
        setStaggerMode("filter");
        setAnimatingIds(new Set(added));
      }, MOTION.hide);
    } else {
      if (filterTimer.current) clearTimeout(filterTimer.current);
      setHidingIds(new Set());

      const added = filteredIds.filter((id) => !prevIds.includes(id));
      if (isInitialRender.current) {
        setStaggerMode("initial");
        setAnimatingIds(new Set(filteredIds));
      } else if (added.length > 0) {
        setStaggerMode("filter");
        setAnimatingIds(new Set(added));
      } else {
        setAnimatingIds(new Set());
      }

      setDisplayIds(filteredIds);
      displayIdsRef.current = filteredIds;
      isInitialRender.current = false;
    }

    return () => {
      if (filterTimer.current) clearTimeout(filterTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeRole, searchQuery, visibleCount, sortBy]);

  const displaySkills = displayIds
    .map((id) => SKILL_BY_ID.get(id))
    .filter((s): s is Skill => s !== undefined);

  const stackSkills = useMemo(() => {
    return stackIds
      .map((id) => SKILL_BY_ID.get(id))
      .filter((s): s is Skill => s !== undefined);
  }, [stackIds]);

  useEffect(() => {
    if (displaySkills.length === 0) {
      setEmptyVisible(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEmptyVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    setEmptyVisible(false);
  }, [displaySkills.length, activeCategory, activeRole, searchQuery]);

  return (
    <>
      {/* Category Pills Scroller */}
      <div className="filter-section page-reveal" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
        <div className="category-scroll-container">
          <div className="category-chips-list">
            {CATEGORIES.slice(0, 24).map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={"cat-chip " + (isActive ? "is-active" : "")}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className="cat-chip-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Bar: View Switcher, Role, Sort, Count */}
      <div className="catalog-toolbar page-reveal" style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
        <div className="toolbar-left">
          <span className="toolbar-results-count">
            Showing <strong>{Math.min(filtered.length, visibleCount)}</strong> of <strong>{filtered.length.toLocaleString()}</strong> skills
          </span>
          {activeCategory !== "all" && (
            <button
              type="button"
              className="btn-clear-filter"
              onClick={() => setActiveCategory("all")}
            >
              Reset Category ✕
            </button>
          )}
        </div>

        <div className="toolbar-right">
          {/* Sort selector */}
          <div className="sort-wrap">
            <span className="sort-label">Sort:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "default" | "popular" | "name")}
            >
              <option value="default">Featured / Default</option>
              <option value="popular">Most Copied & Active</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={"view-btn " + (viewMode === "grid" ? "active" : "")}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              className={"view-btn " + (viewMode === "list" ? "active" : "")}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              ☰ List
            </button>
          </div>
        </div>
      </div>

      {/* Skill List / Grid */}
      <div className={viewMode === "grid" ? "skill-grid" : "skill-list-view"} role="list">
        {displaySkills.length === 0 ? (
          <div
            className={"empty-state " + (emptyVisible ? "is-visible" : "")}
            role="status"
          >
            <div className="empty-state-icon">🔍</div>
            <h3>No skills match your filters</h3>
            <p>Try searching for different terms or reset your active filters.</p>
            <button
              type="button"
              className="btn btn-copy"
              onClick={() => {
                setActiveCategory("all");
                setActiveRole("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displaySkills.map((skill, i) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={i}
              isHiding={hidingIds.has(skill.id)}
              animateIn={animatingIds.has(skill.id)}
              staggerMode={staggerMode}
              stats={statsMap[skill.id]}
              feedback={feedbackMap[skill.id]}
              onInspect={setSelectedSkill}
              onToggleStack={toggleStack}
              isInStack={stackIds.includes(skill.id)}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {filtered.length > visibleCount && (
        <div className="load-more-section">
          <button
            onClick={() => setVisibleCount((c) => c + 60)}
            className="btn btn-load-more"
            type="button"
          >
            Load More Skills ({filtered.length - visibleCount} remaining) ↓
          </button>
        </div>
      )}

      {/* Deep Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onToggleStack={toggleStack}
        isInStack={selectedSkill ? stackIds.includes(selectedSkill.id) : false}
        onSelectSkill={(id) => {
          const s = SKILL_BY_ID.get(id);
          if (s) setSelectedSkill(s);
        }}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        skills={SKILLS}
        onSelectSkill={(s) => setSelectedSkill(s)}
      />

      {/* Stack Composer Bottom Drawer */}
      <StackComposerDrawer
        stackSkills={stackSkills}
        onRemoveSkill={removeStack}
        onClearStack={clearStack}
      />
    </>
  );
}
