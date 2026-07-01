"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { GlobalStatsBar } from "@/components/global-stats-bar";
import { SkillCatalog } from "@/components/skill-catalog";
import { SiteFooter } from "@/components/site-footer";
import { IntroModal } from "@/components/intro-modal";
import { ScrollTop } from "@/components/scroll-top";

export function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="container">
      <SiteHeader search={search} onSearchChange={setSearch} />
      <main>
        <GlobalStatsBar />
        <SkillCatalog searchQuery={search} />
      </main>
      <SiteFooter />
      <IntroModal />
      <ScrollTop />
    </div>
  );
}
