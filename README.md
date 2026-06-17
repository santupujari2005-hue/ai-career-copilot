<<<<<<< HEAD
# AI Career Copilot

A production-ready web application that helps users upload resumes, analyze them with AI, identify skill gaps, generate career roadmaps, prepare for interviews, and track career progress.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM** + **PostgreSQL**
- **Auth.js** (NextAuth v5)
- **OpenAI API**
- **React Hook Form** + **Zod**
- **Shadcn UI** (Radix primitives)
- **Recharts**

## Features

- **Authentication** — Sign up, login, logout, protected routes, user profile
- **Resume Management** — PDF upload, text extraction, analysis history
- **AI Resume Analysis** — Score, strengths, weaknesses, ATS tips, projects
- **Career Roadmap** — 30-day plans for 6 target roles
- **Skill Gap Analysis** — Priority and difficulty-ranked missing skills
- **Dashboard** — Stats, charts, progress tracking
- **Interview Coach** — AI questions + answer evaluation
- **Progress Tracking** — Skills, projects, resume improvements

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Installation

```bash
# Clone and install
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL
# - AUTH_SECRET (generate with: openssl rand -base64 32)
# - OPENAI_API_KEY

# Push database schema
npm run db:push

# Seed default skills (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js secret key |
| `AUTH_URL` | App URL (http://localhost:3000) |
| `OPENAI_API_KEY` | OpenAI API key |
| `NEXT_PUBLIC_APP_URL` | Public app URL |

## Project Structure

```
app/
  (app)/              # Protected app routes
    dashboard/
    upload/
    roadmap/
    interview/
    profile/
  api/                # API routes
  login/
  signup/
  page.tsx            # Landing page
components/
  ui/                 # Shadcn UI components
  layout/
  dashboard/
  upload/
  roadmap/
  interview/
  profile/
lib/
  auth.ts             # Auth.js config
  openai.ts           # AI service
  prisma.ts
  upload.ts           # Local file upload
  pdf.ts
  validations.ts
actions/
  user.ts             # Server actions
prisma/
  schema.prisma
types/
hooks/
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/resume/analyze` | Upload & analyze resume |
| POST | `/api/roadmap/generate` | Generate career roadmap |
| POST | `/api/interview/questions` | Generate interview questions |
| POST | `/api/interview/evaluate` | Evaluate interview answers |

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed skills data
```

## License

MIT
=======
# ai-career-copilot
ai-career-copilot resume-analyzer career-guidance ats-score interview-preparation nextjs typescript prisma sqlite openai full-stack-project
>>>>>>> ee25142c889baff3f7274005f67bba4b7e57ab35
