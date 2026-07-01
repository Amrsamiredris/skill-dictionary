export type Skill = {
  id: string;
  cat: string;
  roles: string[];
  name: string;
  oneliner: string;
  when: string;
  tags: string[];
  source: string;
  prompt: string;
  gh: string;
};

export type Role = { id: string; label: string };
export type Category = { id: string; label: string };

export const SKILLS: Skill[] = [
  {
    "id": "design-taste-frontend",
    "cat": "visual",
    "roles": [
      "designers",
      "marketers",
      "founders"
    ],
    "name": "design-taste-frontend",
    "oneliner": "Default anti-slop frontend. Premium layout, typography, motion, spacing.",
    "when": "Any new UI build. Use this first unless you have a specific aesthetic.",
    "tags": [
      "all apps",
      "greenfield",
      "default"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the design-taste-frontend skill for this: [describe your UI]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/design-taste-frontend"
  },
  {
    "id": "gpt-taste",
    "cat": "visual",
    "roles": [
      "designers",
      "marketers",
      "programmers"
    ],
    "name": "gpt-taste",
    "oneliner": "Stricter taste variant for GPT and Codex. Stronger motion and layout variance.",
    "when": "Working in ChatGPT or Codex and output looks generic or flat.",
    "tags": [
      "ChatGPT",
      "Codex",
      "motion"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the gpt-taste skill for this: [describe your UI]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/gpt-taste"
  },
  {
    "id": "minimalist-ui",
    "cat": "visual",
    "roles": [
      "designers",
      "marketers",
      "founders"
    ],
    "name": "minimalist-ui",
    "oneliner": "Editorial minimalism — restrained color, sharp hierarchy. Notion/Linear feel.",
    "when": "Dashboard, SaaS product, or anything needing a clean focused look.",
    "tags": [
      "all apps",
      "minimalist",
      "SaaS"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the minimalist-ui skill for this: [describe your UI]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/minimalist-ui"
  },
  {
    "id": "industrial-brutalist-ui",
    "cat": "visual",
    "roles": [
      "designers",
      "marketers",
      "event-managers"
    ],
    "name": "industrial-brutalist-ui",
    "oneliner": "Swiss typography, raw grid structure, sharp contrast. High visual impact.",
    "when": "Bold landing page, portfolio, or anything that needs edge and presence.",
    "tags": [
      "all apps",
      "brutalist",
      "bold"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the industrial-brutalist-ui skill for this: [describe your UI]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/industrial-brutalist-ui"
  },
  {
    "id": "stitch-design-taste",
    "cat": "visual",
    "roles": [
      "designers",
      "programmers"
    ],
    "name": "stitch-design-taste",
    "oneliner": "Google Stitch-compatible design rules. Outputs a DESIGN.md alongside code.",
    "when": "Building inside Antigravity or Stitch and need structured design token export.",
    "tags": [
      "Antigravity",
      "Stitch",
      "DESIGN.md"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the stitch-design-taste skill for this: [describe your UI]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/stitch-design-taste"
  },
  {
    "id": "brandkit",
    "cat": "image",
    "roles": [
      "designers",
      "marketers",
      "founders"
    ],
    "name": "brandkit",
    "oneliner": "Brand boards — logo directions, color palettes, typography, identity.",
    "when": "Starting a new brand and need identity references before handing to a coder.",
    "tags": [
      "ChatGPT Images",
      "branding",
      "identity"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "use the brandkit skill. Generate brand identity boards for [describe brand].",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/brandkit"
  },
  {
    "id": "imagegen-frontend-web",
    "cat": "image",
    "roles": [
      "designers",
      "marketers"
    ],
    "name": "imagegen-frontend-web",
    "oneliner": "Premium web reference images — strong art direction, anti-slop.",
    "when": "Need high-quality visual comps for a website before handing to a coding agent.",
    "tags": [
      "ChatGPT Images",
      "web",
      "reference"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "use the imagegen-frontend-web skill. Generate website references for [describe].",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/imagegen-frontend-web"
  },
  {
    "id": "imagegen-frontend-mobile",
    "cat": "image",
    "roles": [
      "designers",
      "marketers",
      "event-managers"
    ],
    "name": "imagegen-frontend-mobile",
    "oneliner": "Premium mobile screens and flows — clean hierarchy, multi-screen consistency.",
    "when": "Need mobile app mockups or flow references before coding.",
    "tags": [
      "ChatGPT Images",
      "mobile",
      "flows"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "use the imagegen-frontend-mobile skill. Generate mobile screens for [describe].",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/imagegen-frontend-mobile"
  },
  {
    "id": "high-end-visual-design",
    "cat": "image",
    "roles": [
      "designers",
      "marketers",
      "event-managers"
    ],
    "name": "high-end-visual-design",
    "oneliner": "High-end editorial references — luxury, premium spacing, anti-generic.",
    "when": "Need reference frames for luxury or high-production-value visual output.",
    "tags": [
      "ChatGPT Images",
      "premium",
      "editorial"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "use the high-end-visual-design skill. Generate references for [describe].",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/high-end-visual-design"
  },
  {
    "id": "frontend-ui-engineering",
    "cat": "frontend",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "frontend-ui-engineering",
    "oneliner": "Component architecture, design systems, responsive, WCAG 2.1 AA.",
    "when": "Building or modifying any user-facing interface. Architecture not aesthetics.",
    "tags": [
      "all apps",
      "architecture",
      "accessibility"
    ],
    "source": "addyosmani/agent-skills",
    "prompt": "follow the frontend-ui-engineering skill for this: [describe component or feature]",
    "gh": "https://github.com/addyosmani/agent-skills"
  },
  {
    "id": "vercel-react-best-practices",
    "cat": "frontend",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "vercel-react-best-practices",
    "oneliner": "62 rules across 8 categories: bundle, SSR, re-renders, waterfall elimination.",
    "when": "Any React or Next.js project. Catches perf patterns agents typically miss.",
    "tags": [
      "React",
      "Next.js",
      "performance",
      "SSR"
    ],
    "source": "vercel-labs/agent-skills",
    "prompt": "follow the vercel-react-best-practices skill for this: [describe feature]",
    "gh": "https://github.com/vercel-labs/agent-skills"
  },
  {
    "id": "web-quality-audit",
    "cat": "frontend",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "web-quality-audit",
    "oneliner": "100+ rules: Lighthouse, Core Web Vitals, WCAG 2.2, SEO in one pass.",
    "when": "Before shipping. Full quality check on performance, accessibility, SEO.",
    "tags": [
      "all apps",
      "audit",
      "Lighthouse",
      "SEO"
    ],
    "source": "addyosmani/agent-skills",
    "prompt": "follow the web-quality-audit skill. Audit this project: [paste relevant files]",
    "gh": "https://github.com/addyosmani/agent-skills"
  },
  {
    "id": "supabase",
    "cat": "backend",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "supabase",
    "oneliner": "Full Supabase stack — DB, auth, storage, realtime, edge functions.",
    "when": "Any Supabase project: schema, RLS, auth flow, storage, realtime features.",
    "tags": [
      "all apps",
      "Supabase",
      "Postgres",
      "auth"
    ],
    "source": "supabase/agent-skills",
    "prompt": "follow the supabase skill for this: [describe what you need]",
    "gh": "https://github.com/supabase/agent-skills"
  },
  {
    "id": "supabase-postgres-best-practices",
    "cat": "backend",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "supabase-postgres-best-practices",
    "oneliner": "Schema design, RLS policies, indexing, query optimization.",
    "when": "Writing migrations, configuring Row Level Security, or fixing slow queries.",
    "tags": [
      "Supabase",
      "Postgres",
      "RLS",
      "migrations"
    ],
    "source": "supabase/agent-skills",
    "prompt": "follow the supabase-postgres-best-practices skill for this: [describe issue]",
    "gh": "https://github.com/supabase/agent-skills"
  },
  {
    "id": "context-fundamentals",
    "cat": "context",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "context-fundamentals",
    "oneliner": "Treats context as a finite attention budget. Maximize signal, minimize waste.",
    "when": "Agent is losing track, repeating itself, or context window filling up.",
    "tags": [
      "all apps",
      "token budget",
      "attention"
    ],
    "source": "muratcankoylan/Agent-Skills-for-Context-Engineering",
    "prompt": "follow the context-fundamentals skill. Optimize context for: [describe task]",
    "gh": "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering"
  },
  {
    "id": "context-compression",
    "cat": "context",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "context-compression",
    "oneliner": "Compaction, observation masking, prefix caching, strategic partitioning.",
    "when": "Session near token limit. Agent needs to compress without losing state.",
    "tags": [
      "all apps",
      "compression",
      "memory"
    ],
    "source": "muratcankoylan/Agent-Skills-for-Context-Engineering",
    "prompt": "follow the context-compression skill. Compress context while preserving: [list]",
    "gh": "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering"
  },
  {
    "id": "image-to-code",
    "cat": "workflow",
    "roles": [
      "designers",
      "programmers"
    ],
    "name": "image-to-code",
    "oneliner": "Full pipeline: generate images → analyze → implement frontend code.",
    "when": "Starting from a visual comp or screenshot. Agent builds UI from the image.",
    "tags": [
      "all apps",
      "pipeline",
      "image→code"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the image-to-code skill: generate images, then analyze, then code. Task: [describe]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code"
  },
  {
    "id": "redesign-existing-projects",
    "cat": "workflow",
    "roles": [
      "designers",
      "programmers",
      "founders"
    ],
    "name": "redesign-existing-projects",
    "oneliner": "Visual audit and redesign of existing codebase. Refactors not greenfield.",
    "when": "Existing UI looks bad or inconsistent. Agent reviews and rewrites styling.",
    "tags": [
      "all apps",
      "refactor",
      "audit"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the redesign-existing-projects skill. Audit and redesign: [describe]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/redesign-existing-projects"
  },
  {
    "id": "full-output-enforcement",
    "cat": "workflow",
    "roles": [
      "marketers",
      "designers",
      "event-managers",
      "copywriters",
      "programmers",
      "founders"
    ],
    "name": "full-output-enforcement",
    "oneliner": "Forces complete untruncated code. Kills placeholders and // TODO patterns.",
    "when": "Agent keeps truncating output, writing // TODO, or stopping mid-component.",
    "tags": [
      "all apps",
      "no-truncation",
      "enforcement"
    ],
    "source": "Leonxlnx/taste-skill",
    "prompt": "follow the full-output-enforcement skill. Output the complete implementation of: [describe]",
    "gh": "https://github.com/Leonxlnx/taste-skill/tree/main/skills/full-output-enforcement"
  },
  {
    "id": "vercel-deploy-claimable",
    "cat": "workflow",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "vercel-deploy-claimable",
    "oneliner": "Deploy to Vercel instantly from any AI chat. Returns preview + claim URL.",
    "when": "Ready to ship. Works from Claude Desktop, claude.ai, or any connected agent.",
    "tags": [
      "all apps",
      "deploy",
      "Vercel"
    ],
    "source": "vercel-labs/agent-skills",
    "prompt": "follow the vercel-deploy-claimable skill. Deploy this project to Vercel.",
    "gh": "https://github.com/vercel-labs/agent-skills"
  },
  {
    "id": "remotion-render",
    "cat": "workflow",
    "roles": [
      "programmers",
      "designers",
      "marketers"
    ],
    "name": "remotion-render",
    "oneliner": "Render videos from React/Remotion component code via inference.sh. Pass TSX code, get MP4.",
    "when": "You have Remotion TSX and need an MP4 rendered without setting up a local pipeline.",
    "tags": [
      "Remotion",
      "video",
      "render"
    ],
    "source": "halt-catch-fire/skills",
    "prompt": "follow the remotion-render skill for this: [describe your Remotion component]",
    "gh": "https://github.com/halt-catch-fire/skills"
  },
  {
    "id": "find-skills",
    "cat": "workflow",
    "roles": [
      "marketers",
      "designers",
      "event-managers",
      "copywriters",
      "programmers",
      "founders"
    ],
    "name": "find-skills",
    "oneliner": "Discover and install agent skills when users ask how to do X or need a capability match.",
    "when": "User asks \"how do I do X\", \"find a skill for X\", or wants to discover available skills.",
    "tags": [
      "all apps",
      "discovery",
      "skills.sh"
    ],
    "source": "vercel-labs/skills",
    "prompt": "follow the find-skills skill for this: [describe what capability you need]",
    "gh": "https://github.com/vercel-labs/skills"
  },
  {
    "id": "viral-tiktok-content",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "event-managers"
    ],
    "name": "viral-tiktok-content",
    "oneliner": "Write TikTok scripts and hooks shaped for how the FYP actually ranks content.",
    "when": "Need a TikTok hook, script, or video idea optimized for FYP distribution.",
    "tags": [
      "TikTok",
      "content",
      "social"
    ],
    "source": "vyralcontent/content-skills",
    "prompt": "use the viral-tiktok-content skill for this: [describe your TikTok topic]",
    "gh": "https://github.com/vyralcontent/content-skills"
  },
  {
    "id": "grill-me",
    "cat": "workflow",
    "roles": [
      "founders",
      "programmers"
    ],
    "name": "grill-me",
    "oneliner": "A relentless interview to sharpen a plan or design.",
    "when": "You have a plan or design that needs stress-testing before you build.",
    "tags": [
      "all apps",
      "planning",
      "interview"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the grill-me skill for this: [describe your plan or design]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "grill-with-docs",
    "cat": "workflow",
    "roles": [
      "founders",
      "programmers"
    ],
    "name": "grill-with-docs",
    "oneliner": "A relentless interview to sharpen a plan or design, which also creates docs as we go.",
    "when": "Stress-testing a plan and want ADRs or glossary docs produced during the session.",
    "tags": [
      "all apps",
      "planning",
      "ADR"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the grill-with-docs skill for this: [describe your plan or design]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "lipsync",
    "cat": "image",
    "roles": [
      "marketers",
      "event-managers",
      "copywriters"
    ],
    "name": "lipsync",
    "oneliner": "Lip-sync a face to an audio track on RunComfy via the runcomfy CLI.",
    "when": "Need to sync a portrait or avatar face to a specific audio track.",
    "tags": [
      "RunComfy",
      "video",
      "avatar"
    ],
    "source": "agentspace-so/runcomfy-agent-skills",
    "prompt": "use the lipsync skill for this: [describe portrait and audio]",
    "gh": "https://github.com/agentspace-so/runcomfy-agent-skills"
  },
  {
    "id": "improve-codebase-architecture",
    "cat": "frontend",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "improve-codebase-architecture",
    "oneliner": "Scan a codebase for deepening opportunities, present a visual HTML report, then grill through your pick.",
    "when": "Codebase needs architectural improvements and you want a structured audit before refactoring.",
    "tags": [
      "all apps",
      "architecture",
      "audit"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the improve-codebase-architecture skill for this: [describe codebase]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "tdd",
    "cat": "workflow",
    "roles": [
      "programmers"
    ],
    "name": "tdd",
    "oneliner": "Test-driven development for building features or fixing bugs test-first, red-green-refactor.",
    "when": "Building features or fixing bugs with tests written first, or user mentions red-green-refactor.",
    "tags": [
      "all apps",
      "testing",
      "TDD"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the tdd skill for this: [describe feature or bug]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "kling-3-0",
    "cat": "image",
    "roles": [
      "marketers",
      "event-managers",
      "designers"
    ],
    "name": "kling-3-0",
    "oneliner": "Kling 3.0 multi-shot video generation on RunComfy with native audio-visual sync.",
    "when": "Need multi-shot AI video generation with Kling 3.0 on RunComfy.",
    "tags": [
      "RunComfy",
      "video",
      "Kling"
    ],
    "source": "agentspace-so/runcomfy-agent-skills",
    "prompt": "use the kling-3-0 skill for this: [describe your video]",
    "gh": "https://github.com/agentspace-so/runcomfy-agent-skills"
  },
  {
    "id": "grilling",
    "cat": "workflow",
    "roles": [
      "founders",
      "programmers"
    ],
    "name": "grilling",
    "oneliner": "Interview the user relentlessly about a plan or design to stress-test before building.",
    "when": "User wants to stress-test a plan before building or uses any grill trigger phrase.",
    "tags": [
      "all apps",
      "planning",
      "interview"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the grilling skill for this: [describe your plan or design]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "happyhorse-1-0",
    "cat": "image",
    "roles": [
      "marketers",
      "event-managers",
      "copywriters"
    ],
    "name": "happyhorse-1-0",
    "oneliner": "Generate text-to-video with HappyHorse 1.0 on RunComfy, native 1080p output.",
    "when": "Need high-quality text-to-video generation with HappyHorse 1.0 on RunComfy.",
    "tags": [
      "RunComfy",
      "video",
      "text-to-video"
    ],
    "source": "doany-ai/skills",
    "prompt": "use the happyhorse-1-0 skill for this: [describe your video]",
    "gh": "https://github.com/doany-ai/skills"
  },
  {
    "id": "teach",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "founders",
      "event-managers"
    ],
    "name": "teach",
    "oneliner": "Teach the user a new skill or concept within this workspace.",
    "when": "User wants to learn a concept or skill and needs structured teaching in the current project.",
    "tags": [
      "all apps",
      "learning",
      "onboarding"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the teach skill for this: [describe what to learn]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "image-to-video-doany",
    "cat": "image",
    "roles": [
      "marketers",
      "event-managers",
      "designers"
    ],
    "name": "image-to-video",
    "oneliner": "Animate any still image on RunComfy, smart router to the right i2v model.",
    "when": "Need to animate a still image on RunComfy and want automatic model routing.",
    "tags": [
      "RunComfy",
      "image",
      "video"
    ],
    "source": "doany-ai/skills",
    "prompt": "use the image-to-video skill for this: [describe image and motion]",
    "gh": "https://github.com/doany-ai/skills"
  },
  {
    "id": "nano-banana-2",
    "cat": "image",
    "roles": [
      "designers",
      "marketers"
    ],
    "name": "nano-banana-2",
    "oneliner": "Generate images with Google Nano Banana 2 on RunComfy with documented prompting patterns.",
    "when": "Need flash-tier text-to-image generation with Nano Banana 2 on RunComfy.",
    "tags": [
      "RunComfy",
      "image",
      "Gemini"
    ],
    "source": "runcomfy-com/skills",
    "prompt": "use the nano-banana-2 skill for this: [describe your image]",
    "gh": "https://github.com/runcomfy-com/skills"
  },
  {
    "id": "relight",
    "cat": "image",
    "roles": [
      "designers",
      "marketers",
      "event-managers"
    ],
    "name": "relight",
    "oneliner": "Relight a still image: change lighting setup, color temperature, direction, or mood on RunComfy.",
    "when": "Need to change lighting or mood of a still image without reshooting.",
    "tags": [
      "RunComfy",
      "image",
      "relight"
    ],
    "source": "runcomfy-com/skills",
    "prompt": "use the relight skill for this: [describe image and lighting goal]",
    "gh": "https://github.com/runcomfy-com/skills"
  },
  {
    "id": "agentspace",
    "cat": "workflow",
    "roles": [
      "programmers",
      "founders"
    ],
    "name": "agentspace",
    "oneliner": "See what your AI agent is doing from anywhere. One command turns the folder into a live view.",
    "when": "Need remote visibility into agent logs, code, outputs, and artifacts while the agent runs.",
    "tags": [
      "all apps",
      "monitoring",
      "agents"
    ],
    "source": "agentspace-so/skills",
    "prompt": "follow the agentspace skill for this: [describe your agent session]",
    "gh": "https://github.com/agentspace-so/skills"
  },
  {
    "id": "video-outpainting",
    "cat": "image",
    "roles": [
      "marketers",
      "event-managers",
      "designers"
    ],
    "name": "video-outpainting",
    "oneliner": "Extend the spatial canvas of a video or change aspect ratio on RunComfy.",
    "when": "Need to outpainting-expand a video frame or convert between 9:16 and 16:9.",
    "tags": [
      "RunComfy",
      "video",
      "outpainting"
    ],
    "source": "runcomfy-com/skills",
    "prompt": "use the video-outpainting skill for this: [describe video and target aspect]",
    "gh": "https://github.com/runcomfy-com/skills"
  },
  {
    "id": "video-extend",
    "cat": "image",
    "roles": [
      "marketers",
      "event-managers"
    ],
    "name": "video-extend",
    "oneliner": "Extend or continue an existing video clip on RunComfy via the runcomfy CLI.",
    "when": "Need to lengthen or continue an existing video clip seamlessly.",
    "tags": [
      "RunComfy",
      "video",
      "extend"
    ],
    "source": "runcomfy-com/skills",
    "prompt": "use the video-extend skill for this: [describe clip and extension goal]",
    "gh": "https://github.com/runcomfy-com/skills"
  },
  {
    "id": "image-to-video-runcomfy",
    "cat": "image",
    "roles": [
      "marketers",
      "event-managers",
      "designers"
    ],
    "name": "image-to-video",
    "oneliner": "Animate any still image on RunComfy, smart router to the right i2v model in the catalog.",
    "when": "Need i2v animation via runcomfy-com/skills with automatic model selection.",
    "tags": [
      "RunComfy",
      "image",
      "video"
    ],
    "source": "runcomfy-com/skills",
    "prompt": "use the image-to-video skill for this: [describe image and motion]",
    "gh": "https://github.com/runcomfy-com/skills"
  },
  {
    "id": "ai-image-generation",
    "cat": "image",
    "roles": [
      "designers",
      "marketers",
      "event-managers"
    ],
    "name": "ai-image-generation",
    "oneliner": "Generate and edit images on RunComfy via smart router across the full image-model catalog.",
    "when": "Need text-to-image or image editing across FLUX, GPT Image, and other RunComfy models.",
    "tags": [
      "RunComfy",
      "image",
      "generation"
    ],
    "source": "doany-ai/skills",
    "prompt": "use the ai-image-generation skill for this: [describe your image]",
    "gh": "https://github.com/doany-ai/skills"
  },
  {
    "id": "copywriting",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "founders"
    ],
    "name": "copywriting",
    "oneliner": "Conversion-focused copy for homepages, landing pages, pricing pages, and other web pages.",
    "when": "Writing marketing copy where clarity, customer language, and a single primary action matter most.",
    "tags": [
      "copy",
      "conversion",
      "landing"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the copywriting skill for this: [describe your page type and audience]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "seo-audit",
    "cat": "frontend",
    "roles": [
      "marketers",
      "founders"
    ],
    "name": "seo-audit",
    "oneliner": "Full SEO audit framework covering crawlability, technical foundations, on-page optimization, and content quality.",
    "when": "Auditing a site for organic search issues and need a prioritized remediation plan.",
    "tags": [
      "SEO",
      "audit",
      "on-page"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the seo-audit skill for this: [describe your site and SEO goals]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "marketing-psychology",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "founders"
    ],
    "name": "marketing-psychology",
    "oneliner": "50+ mental models and buyer psychology frameworks applied to messaging, pricing, and conversion.",
    "when": "Shaping offers, pricing, or messaging and want behavioral principles behind the decision.",
    "tags": [
      "psychology",
      "persuasion",
      "pricing"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the marketing-psychology skill for this: [describe your marketing challenge]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "content-strategy",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "event-managers"
    ],
    "name": "content-strategy",
    "oneliner": "Plan searchable and shareable content pillars, topic clusters, and editorial priorities that drive leads.",
    "when": "Building a content calendar or deciding which topics to publish first.",
    "tags": [
      "content",
      "strategy",
      "SEO"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the content-strategy skill for this: [describe your business and content goals]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "programmatic-seo",
    "cat": "workflow",
    "roles": [
      "marketers",
      "founders",
      "programmers"
    ],
    "name": "programmatic-seo",
    "oneliner": "Build SEO pages at scale with templates, data, and proven playbook patterns like comparisons and directories.",
    "when": "Launching many similar SEO pages from structured data without thin-content penalties.",
    "tags": [
      "SEO",
      "templates",
      "scale"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the programmatic-seo skill for this: [describe your data and page types]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "social-content",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "event-managers"
    ],
    "name": "social-content",
    "oneliner": "Platform-native social content for LinkedIn, X, Instagram, TikTok, and Facebook with hooks and calendars.",
    "when": "Planning, writing, or repurposing posts across multiple social platforms.",
    "tags": [
      "social",
      "LinkedIn",
      "content"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the social-content skill for this: [describe your platform and campaign goal]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "email-sequence",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "founders"
    ],
    "name": "email-sequence",
    "oneliner": "Design multi-email flows for welcome, nurture, re-engagement, onboarding, and retention campaigns.",
    "when": "Building or optimizing an automated email sequence with timing, copy, and CTAs.",
    "tags": [
      "email",
      "automation",
      "nurture"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the email-sequence skill for this: [describe your sequence type and audience]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "copy-editing",
    "cat": "workflow",
    "roles": [
      "copywriters",
      "marketers"
    ],
    "name": "copy-editing",
    "oneliner": "Seven focused editing passes to sharpen existing marketing copy without losing voice.",
    "when": "Polishing draft copy for clarity, proof, specificity, and conversion impact.",
    "tags": [
      "editing",
      "copy",
      "review"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the copy-editing skill for this: [paste your draft copy]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "marketing-ideas",
    "cat": "workflow",
    "roles": [
      "marketers",
      "founders",
      "event-managers"
    ],
    "name": "marketing-ideas",
    "oneliner": "Library of 139 proven SaaS marketing tactics filtered by stage, budget, and timeline.",
    "when": "Brainstorming growth channels and need ideas matched to your resources and product stage.",
    "tags": [
      "growth",
      "SaaS",
      "brainstorm"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the marketing-ideas skill for this: [describe your product and constraints]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "ai-seo",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters"
    ],
    "name": "ai-seo",
    "oneliner": "Optimize content for citation and visibility in AI search tools like ChatGPT, Perplexity, and AI Overviews.",
    "when": "Improving how your brand and pages appear in LLM-generated answers and AI search results.",
    "tags": [
      "AI SEO",
      "citations",
      "LLM"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the ai-seo skill for this: [describe your priority queries and content]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "competitor-alternatives",
    "cat": "workflow",
    "roles": [
      "marketers",
      "copywriters",
      "founders"
    ],
    "name": "competitor-alternatives",
    "oneliner": "SEO comparison and alternative pages that position your product honestly against rivals.",
    "when": "Creating competitor comparison or alternatives pages for evaluators searching options.",
    "tags": [
      "SEO",
      "comparison",
      "positioning"
    ],
    "source": "coreyhaines31/marketingskills",
    "prompt": "use the competitor-alternatives skill for this: [describe your product and competitors]",
    "gh": "https://github.com/coreyhaines31/marketingskills"
  },
  {
    "id": "to-prd",
    "cat": "workflow",
    "roles": [
      "founders",
      "programmers"
    ],
    "name": "to-prd",
    "oneliner": "Synthesize conversation and codebase context into a structured PRD published to your issue tracker.",
    "when": "Ready to turn a discussed feature into a PRD with test seams and ready-for-agent triage.",
    "tags": [
      "PRD",
      "planning",
      "product"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the to-prd skill for this: [describe the feature to spec]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "handoff",
    "cat": "workflow",
    "roles": [
      "founders",
      "programmers"
    ],
    "name": "handoff",
    "oneliner": "Write a handoff document summarizing the session so a fresh agent can continue with redacted secrets.",
    "when": "Ending a session and need durable context passed to the next agent or teammate.",
    "tags": [
      "handoff",
      "context",
      "session"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the handoff skill for this: [describe what the next session should focus on]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "brainstorming",
    "cat": "workflow",
    "roles": [
      "founders",
      "designers",
      "marketers",
      "event-managers"
    ],
    "name": "brainstorming",
    "oneliner": "Structured design dialogue that validates ideas through questions and approval before any implementation.",
    "when": "Starting any project and need requirements explored and a design signed off first.",
    "tags": [
      "planning",
      "design",
      "discovery"
    ],
    "source": "obra/superpowers",
    "prompt": "follow the brainstorming skill for this: [describe your idea]",
    "gh": "https://github.com/obra/superpowers"
  },
  {
    "id": "triage",
    "cat": "workflow",
    "roles": [
      "founders",
      "programmers"
    ],
    "name": "triage",
    "oneliner": "State-machine issue triage with roles, reproduction testing, and agent brief generation.",
    "when": "Moving bugs and enhancements through needs-triage to ready-for-agent on your issue tracker.",
    "tags": [
      "triage",
      "issues",
      "workflow"
    ],
    "source": "mattpocock/skills",
    "prompt": "follow the triage skill for this: [describe the issue or queue to triage]",
    "gh": "https://github.com/mattpocock/skills"
  },
  {
    "id": "pptx",
    "cat": "workflow",
    "roles": [
      "marketers",
      "event-managers",
      "copywriters",
      "founders"
    ],
    "name": "pptx",
    "oneliner": "Create, edit, and QA PowerPoint decks with curated palettes, layouts, and visual inspection workflows.",
    "when": "Building or revising a presentation deck with design quality checks.",
    "tags": [
      "PowerPoint",
      "slides",
      "deck"
    ],
    "source": "anthropics/skills",
    "prompt": "use the pptx skill for this: [describe your presentation]",
    "gh": "https://github.com/anthropics/skills"
  },
  {
    "id": "docx",
    "cat": "workflow",
    "roles": [
      "copywriters",
      "founders",
      "event-managers"
    ],
    "name": "docx",
    "oneliner": "Create, read, and edit Word documents with full formatting, tracked changes, and tables.",
    "when": "Producing or editing professional Word documents, proposals, or reports.",
    "tags": [
      "Word",
      "documents",
      "formatting"
    ],
    "source": "anthropics/skills",
    "prompt": "use the docx skill for this: [describe your document]",
    "gh": "https://github.com/anthropics/skills"
  },
  {
    "id": "xlsx",
    "cat": "workflow",
    "roles": [
      "founders",
      "marketers",
      "event-managers"
    ],
    "name": "xlsx",
    "oneliner": "Create and edit Excel spreadsheets with formulas, formatting, and data analysis workflows.",
    "when": "Building spreadsheets, financial models, or data tables that need proper formulas and structure.",
    "tags": [
      "Excel",
      "spreadsheet",
      "data"
    ],
    "source": "anthropics/skills",
    "prompt": "use the xlsx skill for this: [describe your spreadsheet task]",
    "gh": "https://github.com/anthropics/skills"
  },
  {
    "id": "pdf",
    "cat": "workflow",
    "roles": [
      "founders",
      "copywriters",
      "event-managers"
    ],
    "name": "pdf",
    "oneliner": "Merge, split, extract, OCR, and manipulate PDFs including forms and table extraction.",
    "when": "Processing PDF files for extraction, assembly, redaction, or form filling.",
    "tags": [
      "PDF",
      "documents",
      "OCR"
    ],
    "source": "anthropics/skills",
    "prompt": "use the pdf skill for this: [describe your PDF task]",
    "gh": "https://github.com/anthropics/skills"
  },
  {
    "id": "landing-page-design",
    "cat": "visual",
    "roles": [
      "marketers",
      "designers",
      "founders"
    ],
    "name": "landing-page-design",
    "oneliner": "Design high-converting landing pages with AI-generated hero visuals via inference.sh CLI.",
    "when": "Creating a marketing landing page and need conversion-focused layout plus generated imagery.",
    "tags": [
      "landing",
      "conversion",
      "hero"
    ],
    "source": "halt-catch-fire/skills",
    "prompt": "follow the landing-page-design skill for this: [describe your product and page goal]",
    "gh": "https://github.com/halt-catch-fire/skills"
  },
  {
    "id": "product-photography",
    "cat": "image",
    "roles": [
      "marketers",
      "designers",
      "event-managers"
    ],
    "name": "product-photography",
    "oneliner": "Generate professional studio packshots and e-commerce product images via inference.sh CLI.",
    "when": "Need clean product shots for a store, catalog, or ad without a physical photo shoot.",
    "tags": [
      "product",
      "e-commerce",
      "photography"
    ],
    "source": "halt-catch-fire/skills",
    "prompt": "use the product-photography skill for this: [describe your product and style]",
    "gh": "https://github.com/halt-catch-fire/skills"
  },
  {
    "id": "text-to-speech",
    "cat": "workflow",
    "roles": [
      "marketers",
      "event-managers",
      "copywriters"
    ],
    "name": "text-to-speech",
    "oneliner": "Generate natural speech from text with ElevenLabs across 70+ languages and quality tiers.",
    "when": "Turning scripts, announcements, or voiceover copy into polished audio with ElevenLabs.",
    "tags": [
      "audio",
      "voiceover",
      "ElevenLabs"
    ],
    "source": "elevenlabs/skills",
    "prompt": "use the text-to-speech skill for this: [describe your script and voice needs]",
    "gh": "https://github.com/elevenlabs/skills"
  }
];

export const ROLES: Role[] = [
  {
    "id": "all",
    "label": "All Roles"
  },
  {
    "id": "marketers",
    "label": "Marketers"
  },
  {
    "id": "designers",
    "label": "Designers"
  },
  {
    "id": "event-managers",
    "label": "Event Managers"
  },
  {
    "id": "copywriters",
    "label": "Copywriters"
  },
  {
    "id": "programmers",
    "label": "Programmers"
  },
  {
    "id": "founders",
    "label": "Founders / Operators"
  }
];

export const CATEGORIES: Category[] = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "visual",
    "label": "Visual Style"
  },
  {
    "id": "image",
    "label": "Image Gen"
  },
  {
    "id": "frontend",
    "label": "Frontend"
  },
  {
    "id": "backend",
    "label": "Backend"
  },
  {
    "id": "context",
    "label": "Context"
  },
  {
    "id": "workflow",
    "label": "Workflow"
  }
];

export const CAT_VAR: Record<string, string> = {
  visual: '--cat-visual',
  image: '--cat-image',
  frontend: '--cat-frontend',
  backend: '--cat-backend',
  context: '--cat-context',
  workflow: '--cat-workflow',
};

export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find((s) => s.id === id);
}
