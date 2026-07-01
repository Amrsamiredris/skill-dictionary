"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SKILLS,
  ROLES,
  CATEGORIES,
  type Skill,
} from "@/lib/skills";
import { SkillCard } from "@/components/skill-card";
import { PillBar } from "@/components/pill-bar";
import type { FeedbackAgg, SkillStats } from "@/lib/types";
import { MOTION } from "@/lib/motion";

const SKILL_BY_ID = new Map(SKILLS.map((s) => [s.id, s]));

export function SkillCatalog({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRole, setActiveRole] = useState("all");
  const [statsMap, setStatsMap] = useState<Record<string, SkillStats>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackAgg>>({});
  const filterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialRender = useRef(true);
  const displayIdsRef = useRef<string[]>(SKILLS.map((s) => s.id));

  const [displayIds, setDisplayIds] = useState<string[]>(() =>
    SKILLS.map((s) => s.id),
  );
  const [hidingIds, setHidingIds] = useState<Set<string>>(() => new Set());
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(
    () => new Set(SKILLS.map((s) => s.id)),
  );
  const [staggerMode, setStaggerMode] = useState<"initial" | "filter">(
    "initial",
  );
  const [emptyVisible, setEmptyVisible] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(
        (data: {
          skillStats: SkillStats[];
          feedback: FeedbackAgg[];
        }) => {
          const sm: Record<string, SkillStats> = {};
          for (const s of data.skillStats ?? []) sm[s.skill_id] = s;
          setStatsMap(sm);
          const fm: Record<string, FeedbackAgg> = {};
          for (const f of data.feedback ?? []) fm[f.skill_id] = f;
          setFeedbackMap(fm);
        },
      )
      .catch(() => {});
  }, []);

  const filterSkills = useCallback((): Skill[] => {
    const q = searchQuery.toLowerCase().trim();
    return SKILLS.filter((skill) => {
      if (activeCategory !== "all" && skill.cat !== activeCategory) return false;
      if (
        activeRole !== "all" &&
        (!skill.roles || !skill.roles.includes(activeRole))
      )
        return false;
      if (!q) return true;
      const haystack = [
        skill.name,
        skill.oneliner,
        skill.when,
        skill.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, activeRole, searchQuery]);

  const filtered = filterSkills();
  const filteredIds = filtered.map((s) => s.id);

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
  }, [activeCategory, activeRole, searchQuery]);

  const displaySkills = displayIds
    .map((id) => SKILL_BY_ID.get(id))
    .filter((s): s is Skill => s !== undefined);

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
      <div className="filter-section page-reveal" style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
        <span className="filter-label" id="role-filter-label">
          Filter by role
        </span>
        <PillBar
          items={ROLES}
          activeId={activeRole}
          onSelect={setActiveRole}
          dataAttr="data-role"
          ariaLabelledBy="role-filter-label"
        />
      </div>

      <div className="filter-section page-reveal" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
        <span className="filter-label" id="cat-filter-label">
          Category
        </span>
        <PillBar
          items={CATEGORIES}
          activeId={activeCategory}
          onSelect={setActiveCategory}
          dataAttr="data-cat"
          ariaLabelledBy="cat-filter-label"
        />
      </div>

      <div className="skill-grid" role="list">
        {displaySkills.length === 0 ? (
          <div
            className={`empty-state${emptyVisible ? " is-visible" : ""}`}
            role="status"
          >
            No skills match your filters.
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
            />
          ))
        )}
      </div>
    </>
  );
}
