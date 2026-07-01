"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { SignInButton } from "@/components/sign-in-button";

export function SiteHeader({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const { theme, toggle } = useTheme();

  return (
    <header className="site-header">
      <div className="header-brand">
        <h1 className="logo">
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            skill <span>/</span> dict
          </Link>
        </h1>
        <HowItWorksButton />
      </div>
      <div className="header-actions">
        <div className="search-wrap">
          <input
            type="search"
            className="search-input"
            placeholder="Search skills..."
            aria-label="Search skills"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <SignInButton />
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          aria-pressed={theme === "light"}
          type="button"
        >
          <span className="theme-icon-wrap">
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </span>
        </button>
      </div>
    </header>
  );
}

function HowItWorksButton() {
  return (
    <button
      type="button"
      className="how-it-works"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-intro-modal"));
      }}
    >
      How it works
    </button>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={20}
      height={20}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={20}
      height={20}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
