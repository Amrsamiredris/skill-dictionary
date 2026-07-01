# skill / dict

A browsable library of AI agent skills — search, filter, and copy prompts in one click.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Supabase (Postgres, Auth magic link, analytics)
- Deployed on Vercel
- Vercel Analytics (pageviews)

## Features

- **Copy-and-go** — browse and copy without signing in
- **Global analytics** — total copies, GitHub clicks, like/dislike per skill
- **Install feedback** — optional "Did you install this?" after copy
- **Optional profiles** — magic link sign-in, username, personal dashboard
- **Public profiles** — `/u/username` (opt-in visibility)

## Setup

1. Copy `.env.example` to `.env.local` and fill in Supabase credentials
2. Run migrations in `supabase/migrations/` against your Supabase project
3. `npm install && npm run dev`

## Supabase migrations

Run `001_stage1_analytics.sql` then `002_stage2_profiles.sql` in the Supabase SQL editor (or via Supabase CLI).

Set `ADMIN_EMAIL` in env to access `/admin/stats`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
