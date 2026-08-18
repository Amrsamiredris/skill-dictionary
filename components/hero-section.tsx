"use client";

import { useState } from "react";

export function HeroSection({
  totalSkills,
  totalCategories,
  onOpenCommandPalette,
}: {
  totalSkills: number;
  totalCategories: number;
  onOpenCommandPalette: () => void;
}) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="hero-section page-reveal" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
      <div className="hero-badge-row">
        <span className="hero-pill">
          <span className="hero-pill-dot" />
          The Open Standard for AI Agent Directives
        </span>
        <button
          type="button"
          className="hero-cmd-badge"
          onClick={onOpenCommandPalette}
          title="Press ⌘K to open search"
        >
          <kbd>⌘</kbd>
          <kbd>K</kbd>
          <span>Quick Search</span>
        </button>
      </div>

      <h1 className="hero-title">
        Supercharge your AI with{" "}
        <span className="hero-gradient-text">2,150+ Battle-Tested Skills</span>
      </h1>

      <p className="hero-subtitle">
        Drop-in instructions, frameworks, and tools for <strong>Claude</strong>,{" "}
        <strong>ChatGPT</strong>, <strong>Codex</strong>, <strong>Antigravity</strong>, and{" "}
        <strong>Cursor</strong>. Turn generic AI responses into crisp, production-grade output.
      </p>

      {/* Hero Stats */}
      <div className="hero-stats-grid">
        <div className="hero-stat-card">
          <span className="hero-stat-number">{totalSkills.toLocaleString()}+</span>
          <span className="hero-stat-label">Production Skills</span>
        </div>
        <div className="hero-stat-card">
          <span className="hero-stat-number">{totalCategories}+</span>
          <span className="hero-stat-label">Domains & Categories</span>
        </div>
        <div className="hero-stat-card">
          <span className="hero-stat-number">1-Click</span>
          <span className="hero-stat-label">Prompt & CLI Copy</span>
        </div>
        <div className="hero-stat-card">
          <span className="hero-stat-number">100%</span>
          <span className="hero-stat-label">Free & Open Source</span>
        </div>
      </div>

      {/* Interactive Concept Explainer: Why Skills? */}
      <div className="hero-concept-box">
        <div className="hero-concept-header">
          <div className="hero-concept-title-group">
            <span className="hero-concept-icon">💡</span>
            <div>
              <strong>Why use modular Skills instead of basic prompting?</strong>
              <p>See the real-world difference a specialized skill makes</p>
            </div>
          </div>
          <button
            type="button"
            className="hero-concept-toggle-btn"
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? "Hide Comparison ↑" : "Compare Before & After ↓"}
          </button>
        </div>

        {showDemo && (
          <div className="hero-comparison-grid">
            <div className="hero-comparison-col before">
              <div className="comparison-badge before-badge">❌ Without Skill (Generic AI Slop)</div>
              <div className="comparison-prompt">
                <code>User: &quot;Build a landing page dashboard for my SaaS&quot;</code>
              </div>
              <div className="comparison-output">
                <p>• Plain unstyled grey boxes and generic purple gradients</p>
                <p>• 400 lines of repetitive boilerplate code</p>
                <p>• No dark mode, no keyboard navigation, no accessibility</p>
                <p>• Cluttered layouts with zero visual hierarchy</p>
              </div>
            </div>

            <div className="hero-comparison-col after">
              <div className="comparison-badge after-badge">✨ With Skill (e.g. design-taste-frontend)</div>
              <div className="comparison-prompt">
                <code>User: &quot;follow the design-taste-frontend skill: Build SaaS landing page&quot;</code>
              </div>
              <div className="comparison-output">
                <p>• Precision typography, bespoke micro-borders, and glassmorphism</p>
                <p>• Full WCAG accessibility, dark/light theme, and spring physics</p>
                <p>• Modular component architecture with zero fluff</p>
                <p>• Production-grade Polish matching Linear, Apple, and Vercel</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
