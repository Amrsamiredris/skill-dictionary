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

export function SkillCatalog({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRole, setActiveRole] = useState("all");
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [statsMap, setStatsMap] = useState<Record<string, SkillStats>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackAgg>>({});
  const filterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [hiding, setHiding] = useState(false);

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
    if (isInitialRender) {
      setVisibleIds(filteredIds);
      setIsInitialRender(false);
      return;
    }

    const prevIds = visibleIds;
    const needsHide = prevIds.some((id) => !filteredIds.includes(id));

    if (needsHide) {
      setHiding(true);
      if (filterTimer.current) clearTimeout(filterTimer.current);
      filterTimer.current = setTimeout(() => {
        setVisibleIds(filteredIds);
        setHiding(false);
      }, 220);
    } else {
      setVisibleIds(filteredIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeRole, searchQuery]);

  const displaySkills = filtered;

  return (
    <>
      <div className="filter-section">
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

      <div className="filter-section">
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
          <div className="empty-state" role="status">
            No skills match your filters.
          </div>
        ) : (
          displaySkills.map((skill, i) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={i}
              isEntering={!hiding}
              stats={statsMap[skill.id]}
              feedback={feedbackMap[skill.id]}
            />
          ))
        )}
      </div>
    </>
  );
}

