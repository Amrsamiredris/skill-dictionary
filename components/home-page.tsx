"use client";

import { useState, useCallback } from "react";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { GlobalStatsBar } from "@/components/global-stats-bar";
import { SkillCatalog } from "@/components/skill-catalog";
import { SiteFooter } from "@/components/site-footer";
import { IntroModal } from "@/components/intro-modal";
import { ScrollTop } from "@/components/scroll-top";
import { SKILLS, CATEGORIES } from "@/lib/skills";

export function HomePage() {
  const [search, setSearch] = useState("");

  const handleOpenCmd = useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }, []);

  return (
    <div className="container">
      <SiteHeader search={search} onSearchChange={setSearch} />
      <main>
        <HeroSection
          totalSkills={SKILLS.length}
          totalCategories={CATEGORIES.length}
          onOpenCommandPalette={handleOpenCmd}
        />
        <GlobalStatsBar />
        <SkillCatalog searchQuery={search} />
      </main>
      <SiteFooter />
      <IntroModal />
      <ScrollTop />
    </div>
  );
}
