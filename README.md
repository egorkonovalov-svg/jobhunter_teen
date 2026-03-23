# TeenWork

Job board for teenagers (14–18) in Russia. All UI is in Russian.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (PostCSS plugin, `@theme inline`)
- **Supabase** (Postgres + Auth + Row-Level Security)
- **Zod** for input validation
- **react-markdown** for job descriptions

## Features

- Job listings with search, filters (city, category, type), and pagination
- Job detail pages with markdown descriptions and related jobs
- Employer dashboard — toggle active/inactive, delete jobs
- Job posting form with field-level Zod validation
- Authentication via Supabase (email/password, OAuth, magic links)
- Role-based access: `teen` and `employer`
- Row-Level Security on all tables — no service_role key exposed to client
- Responsive design with mobile menu

## Project Structure

```
app/
  layout.tsx              Root layout (Space Grotesk + Manrope fonts)
  page.tsx                Landing page
  globals.css             Design tokens, utility classes
  auth/
    login/page.tsx        Login form
    register/page.tsx     Registration with role toggle
    callback/route.ts     OAuth & magic link callback
  jobs/
    page.tsx              Job listing with search & filters
    [id]/page.tsx         Job detail
  dashboard/page.tsx      Employer dashboard
  post-job/
    page.tsx              Job posting form
    actions.ts            Server action with validation

components/
  Header.tsx              Sticky header with frosted glass
  Footer.tsx              4-column footer
  JobCard.tsx             Job card with hover animations
  SearchBar.tsx           Search input
  JobFilters.tsx          Sidebar filters
  ui/                     Button, Input, Badge primitives

lib/
  constants.ts            Cities (15), categories (10), job types (3)
  schemas/job.ts          Zod schema for job validation
  schemas/profile.ts      Zod schema for profile validation
  supabase/client.ts      Browser Supabase client
  supabase/server.ts      Server Supabase client (cookie-based)

proxy.ts                  Auth middleware (protects /post-job, /dashboard)

supabase/migrations/
  001_init.sql            profiles + jobs tables with RLS
  002_add_constraints.sql CHECK constraints
  003_profile_rls.sql     Refined profile RLS policies
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone <repo-url>
cd jobhunter-teen
npm install
```

### Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables (both are public/safe to expose):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon (public) key |

### Database Setup

1. Create a new Supabase project
2. Run the migrations in order in the Supabase SQL Editor:
   - `supabase/migrations/001_init.sql` — creates `profiles` and `jobs` tables with RLS policies and an auth trigger
   - `supabase/migrations/002_add_constraints.sql` — adds CHECK constraints for field lengths, enums, and salary ranges
   - `supabase/migrations/003_profile_rls.sql` — refines profile RLS to prevent role self-elevation
3. (Optional) Import `supabase/mock_jobs.csv` for sample data

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Import the repository in Vercel
2. Add environment variables in **Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy for Production and Preview environments

## Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| `midnight` | `#0F1419` | Primary text, headings |
| `navy` | `#1A1F2E` | Dark sections (hero, footer) |
| `gold` | `#C9A96E` | Primary accent — CTAs, links |
| `teal` | `#2A5C5C` | Internship badges |
| `warm-white` | `#FAF9F7` | Page background |
| `warm-gray` | `#F2F1EF` | Card backgrounds |

### Typography

- **Headings**: Space Grotesk (Cyrillic supported)
- **Body**: Manrope (Cyrillic supported)

Light theme only — no dark mode.

## Security

- **Auth**: Supabase Auth with JWT validation via `getUser()` (not `getSession()`)
- **RLS**: All tables protected — users access only their own data; anyone can read active jobs
- **Validation**: Zod schemas on all server actions + DB CHECK constraints as final backstop
- **No service_role key** exposed to client — only the anon/public key is used
- **Role immutability**: Profile RLS prevents users from changing their own role
- **Contact info**: Email validation before rendering `mailto:` links (prevents href injection)

## Database Schema

**profiles** — `id` (uuid, FK to auth.users), `role` (teen/employer), `name`, `city`, `company_name`, `created_at`

**jobs** — `id` (uuid), `employer_id` (FK to profiles), `title`, `company`, `city`, `category`, `type` (internship/part-time/gig), `salary_min`, `salary_max`, `description`, `contact_info`, `is_active`, `created_at`
