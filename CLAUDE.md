@AGENTS.md

# Project: TeenWork

Teen job board for Russia (14–18 year olds). All UI text is in Russian.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS v4 (PostCSS plugin, `@theme inline` in globals.css)
- **Database**: Supabase (Postgres + Auth + RLS)
- **Markdown**: react-markdown for job descriptions
- **Utilities**: clsx for conditional classes

## Commands

- `npm run dev` — local dev server (requires `.env.local` with Supabase keys)
- `npm run build` — production build (Turbopack)
- `npm run lint` — ESLint

## Environment Variables

Only two, both in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
app/
  layout.tsx          — Root layout (Space Grotesk + Manrope fonts)
  page.tsx            — Landing page (hero, stats, featured jobs, categories, CTA)
  not-found.tsx       — Global 404
  globals.css         — Design tokens (@theme inline), utility classes
  auth/login/         — Login form (client component)
  auth/register/      — Registration with teen/employer role toggle
  jobs/page.tsx       — Job listing with search, filters, pagination
  jobs/loading.tsx    — Skeleton loader
  jobs/[id]/page.tsx  — Job detail with markdown, sidebar, related jobs
  dashboard/page.tsx  — Employer dashboard (server actions for toggle/delete)
  post-job/page.tsx   — Job posting form (employer-only)
components/
  Header.tsx          — Sticky header with frosted glass, mobile menu
  Footer.tsx          — Dark footer, 4-column grid
  JobCard.tsx         — Job listing card with hover animations
  SearchBar.tsx       — Search input (client component)
  JobFilters.tsx      — Sidebar filters (client component)
  ui/Button.tsx       — 5 variants: primary, accent, secondary, outline, danger
  ui/Input.tsx        — Styled input with uppercase labels
  ui/Badge.tsx        — Job type badges (internship, part-time, gig, active, inactive)
lib/
  constants.ts        — CITIES (15), CATEGORIES (10), JOB_TYPES (3)
  supabase/client.ts  — Browser Supabase client
  supabase/server.ts  — Server Supabase client (cookie-based)
proxy.ts              — Auth middleware (protects /post-job, /dashboard)
supabase/migrations/001_init.sql — Schema: profiles + jobs tables with RLS
```

## Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| `midnight` | `#0F1419` | Primary text, headings, dark buttons |
| `navy` | `#1A1F2E` | Dark sections (hero, footer, CTA) |
| `gold` | `#C9A96E` | Primary accent — CTAs, links, highlights |
| `gold-hover` | `#B8944F` | Gold hover state |
| `teal` | `#2A5C5C` | Internship badges |
| `teal-light` | `#E8F0F0` | Teal badge backgrounds |
| `warm-white` | `#FAF9F7` | Page background |
| `warm-gray` | `#F2F1EF` | Card backgrounds, surfaces, skeletons |
| `border` | `#E8E6E1` | All borders |
| `text-secondary` | `#6B6560` | Muted body text |
| `text-tertiary` | `#9C9690` | Hints, placeholders |

### Typography
- **Headings**: Space Grotesk (`heading-display` class), tight tracking (-0.02em)
- **Body**: Manrope (set on `<body>` via CSS variable)
- Both fonts support Cyrillic

### Component Patterns
- Cards: `bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)]`
- Hover lift: `hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5`
- All transitions: `transition-all duration-300`
- Labels: `text-xs font-semibold uppercase tracking-wider text-text-secondary`
- Link animation: `link-underline` class (width grows from 0 on hover)
- No emojis in UI — use text or geometric shapes

## Database Schema

**profiles**: id (uuid, PK → auth.users), role ('teen'|'employer'), name, city, company_name, created_at
**jobs**: id (uuid), employer_id (FK → profiles), title, company, city, category, type ('internship'|'part-time'|'gig'), salary_min, salary_max, description, contact_info, is_active, created_at

RLS: anyone reads active jobs; employers CRUD own jobs; users read/write own profile.

## Conventions

- Path alias: `@/*` maps to project root (`@/lib/...`, `@/components/...`)
- Server components by default; `'use client'` only when needed (forms, state, search params)
- Server actions for mutations (dashboard toggle/delete) — always re-verify auth
- Supabase client: `createClient()` from `@/lib/supabase/client` (browser) or `@/lib/supabase/server` (server)
- Job type badges use per-type color schemes defined in component maps, not the Badge component directly on listing pages
- No dark mode — light premium theme only
