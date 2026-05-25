# Skill Dictionary

![Skills: 19](https://img.shields.io/badge/Skills-19-blue)
![Live on Vercel](https://img.shields.io/badge/Live%20on-Vercel-black)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

A fast, searchable reference for AI agent skills — open it, find a skill, copy the prompt, go back to your AI tool and use it.

## What this is
AI coding agents (Claude Code, Cursor, Codex, Antigravity, Windsurf, Amp, Cline, and others) support installable `SKILL.md` files that provide specialized knowledge and workflows.

This site is a personal reference dictionary for installed skills, searchable by name, use case, or tag. Each skill card explains what the skill does, when to use it, and includes a one-click copy action for the activation prompt.

## Live site
[skill-dictionary.vercel.app](https://skill-dictionary.vercel.app)

## Skills included

### Visual Style

| Skill | One-line description | Source repo |
|---|---|---|
| `design-taste-frontend` | Default anti-slop frontend. Premium layout, typography, motion, spacing. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `gpt-taste` | Stricter taste variant for GPT / Codex. Stronger motion and layout variance. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `minimalist-ui` | Editorial minimalism — restrained color, sharp hierarchy. Notion/Linear feel. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `industrial-brutalist-ui` | Swiss typography, raw grid structure, sharp contrast. High visual impact. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `stitch-design-taste` | Google Stitch-compatible design rules. Outputs a DESIGN.md alongside code. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |

### Image Gen

| Skill | One-line description | Source repo |
|---|---|---|
| `brandkit` | Brand boards — logo directions, color palettes, typography, identity. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `imagegen-frontend-web` | Premium web reference images — strong art direction, anti-slop. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `imagegen-frontend-mobile` | Premium mobile screens and flows — clean hierarchy, multi-screen consistency. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `high-end-visual-design` | High-end editorial references — luxury, premium spacing, anti-generic. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |

### Frontend Quality

| Skill | One-line description | Source repo |
|---|---|---|
| `frontend-ui-engineering` | Component architecture, design systems, responsive, WCAG 2.1 AA. Auto-triggers on UI work. | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) |
| `vercel-react-best-practices` | 62 rules across 8 categories: bundle, SSR, re-renders, waterfall elimination. | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `web-quality-audit` | 100+ rules: Lighthouse, Core Web Vitals, WCAG 2.2, SEO, best practices in one pass. | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) |

### Backend

| Skill | One-line description | Source repo |
|---|---|---|
| `supabase` | Full Supabase stack — DB, auth, storage, realtime, edge functions. | [supabase/agent-skills](https://github.com/supabase/agent-skills) |
| `supabase-postgres-best-practices` | Schema design, RLS policies, indexing, query optimization for Supabase/Postgres. | [supabase/agent-skills](https://github.com/supabase/agent-skills) |

### Context / Tokens

| Skill | One-line description | Source repo |
|---|---|---|
| `context-fundamentals` | Treats context as a finite attention budget. Maximize signal, minimize token waste. | [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) |
| `context-compression` | Compaction, observation masking, prefix caching, strategic partitioning. | [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) |

### Workflow

| Skill | One-line description | Source repo |
|---|---|---|
| `image-to-code` | Full pipeline: generate images → analyze → implement frontend code. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `redesign-existing-projects` | Visual audit and redesign of an existing codebase. For refactors, not greenfield. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `full-output-enforcement` | Forces complete, untruncated code. Kills placeholders and "...rest here" patterns. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `vercel-deploy-claimable` | Deploy to Vercel instantly from any AI chat. Returns preview URL + claim URL. | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |

## Features
- Apple-inspired light theme with elevated cards and segmented category tabs.
- Fast search + category filters for skill discovery.
- One-click prompt copy with usage tracking and pinned skills strip.
- Cmd/Ctrl+K shortcut support and dark mode styling.
- Vercel Web Analytics script integration for page-view tracking on deployed environments.

## How to use
1. Open the live site.
2. Search by name, use case, or tag.
3. Click **Copy prompt** on the skill you need.
4. Paste into your AI tool and complete the `[placeholders]`.
5. Usage is tracked locally — your most-used skills appear in the stats bar.

## How to install these skills yourself

```bash
npx skills add Leonxlnx/taste-skill
npx skills add addyosmani/agent-skills --skill frontend-ui-engineering
npx skills add addyosmani/agent-skills --skill web-quality-audit
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills --skill vercel-deploy-claimable
npx skills add supabase/agent-skills --skill supabase
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices
npx skills add muratcankoylan/Agent-Skills-for-Context-Engineering
```

## How to add a new skill
Edit `index.html` on GitHub and find the `SKILLS` array. Copy an existing skill object, paste it, and update:

- `id`
- `name`
- `cat`
- `oneliner`
- `when`
- `tags`
- `source`
- `prompt`
- `gh`

Available categories: `visual` | `image` | `frontend` | `backend` | `context` | `workflow`

Commit and push; Vercel auto-redeploys in about 30 seconds.

## How to deploy your own copy
1. Fork this repo.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your fork.
3. Deploy with default settings.
4. Done — you get a live URL instantly.

## Skill sources
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — anti-slop frontend skills.
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — production engineering skills by Addy Osmani.
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — official Vercel skills.
- [supabase/agent-skills](https://github.com/supabase/agent-skills) — official Supabase skills.
- [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) — context and token engineering.

## Contributing
Anyone can suggest a skill by opening an issue with:
- Skill name
- GitHub repo / install command
- What it does and when to use it
