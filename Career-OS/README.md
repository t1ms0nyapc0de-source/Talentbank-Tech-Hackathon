# CareerOS

The modern operating system for university career centers. Manage, personalize, and measure every step of the student career journey.

## Features

- **Sign up & Register** — Role-based registration for students and employers
- **Profile & Resume Builder** — Live resume preview with skills, education, and experience
- **Job Listings** — Browse 18+ seeded university-relevant opportunities
- **Keyword & Job Search** — Filter by title, company, location, type, and work style
- **Job Applications** — Apply with optional cover notes and track status
- **Job Matching** — Skill-based match scores with "why matched" insights
- **Candidate Dashboard** — Profile completion, applications, matches, and quick actions
- **Employer Dashboard** — Post jobs, review applicants, and manage hiring pipeline

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui components
- Zustand with localStorage persistence
- Mock data (no backend required for prototype)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- npm

### Install & Run

```bash
cd "Career OS"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

Sign in with any of these emails on the login page:

| Name | Email | Role |
|------|-------|------|
| Alex Rivera | alex.rivera@university.edu | Candidate |
| Jordan Kim | jordan.kim@university.edu | Candidate |
| Sarah Chen | sarah.chen@techcorp.com | Employer |
| Marcus Webb | marcus.webb@greenfield.io | Employer |

You can also register a new account — data persists in your browser via localStorage.

## Project Structure

```
app/
  page.tsx              # Marketing landing page
  (auth)/               # Login & register
  (candidate)/candidate/  # Student app (/candidate/*)
  (employer)/employer/    # Employer app (/employer/*)
components/             # UI, marketing, jobs, resume, dashboard
lib/
  mock/                 # Seed data
  stores/               # Zustand state
  matching.ts           # Job match scoring
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Notes

This is a **UI prototype** with mock authentication and client-side state. No real database, email, or OAuth is configured. All data persists in the browser's localStorage.
