# HelpHub BD

A local services marketplace for Sherpur — connect customers with trusted providers (electricians, plumbers, mechanics, tutors, and more) in one place. Built with Next.js and MongoDB.

Live URL : https://help-hub-bd.vercel.app

## Features

- **Roles** — User, Provider, and Admin dashboards with role-aware navigation.
- **Search & discover** — Filter providers by category, location, rating, price, and verified-only; sort by relevance, rating, reviews, or price.
- **Provider profiles** — Business info, photos, services & price list, working hours, reviews, and a save (favorite) list.
- **Service requests** — Request a service from a provider's profile with description, budget, preferred date/time, and emergency flag.
- **Provider workflow** — Accept / reject / complete requests, manage availability, services, pricing, working hours, and profile.
- **Reviews** — Customers can rate and review providers after a completed request.
- **Admin panel** — Dashboard stats, manage users, providers, categories, requests, reviews, and reports.
- **Notifications** — In-app notifications for new requests, status changes, reviews, and verification.
- **Bilingual** — English and Bangla (বাংলা) with a live language switcher.
- **Phone-first auth** — Register/login with a Bangladeshi phone number, JWT sessions.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4, Base UI, shadcn-style components
- **Data:** MongoDB + Mongoose
- **Forms/validation:** react-hook-form + Zod
- **Data fetching:** TanStack Query
- **Uploads:** Cloudinary
- **Auth:** bcryptjs + jsonwebtoken (httpOnly cookie)
- **UI extras:** sonner (toasts), lucide-react (icons), next-themes, framer-motion

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Cloudinary](https://cloudinary.com) account (for image uploads)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env.local

# 3. Fill in real values (see table below), then seed the database
npm run seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (local or Atlas). Use `mongodb://localhost:27017/help-hub-bd` for local. |
| `JWT_SECRET` | Secret used to sign auth tokens. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_APP_URL` | Base URL of the app (e.g. `http://localhost:3000` locally, your Vercel domain in production). |
| `NEXT_PUBLIC_APP_NAME` | App name shown in the UI (default: `HelpHub BD`). |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key (server-side only). |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (server-side only). |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset name. |
| `NEXT_PUBLIC_SUPPORT_PHONE` | Support phone number shown in the footer/emergency sections. |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support email shown in the footer. |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run seed` | Seed categories, providers, and a demo admin into MongoDB |

## Project Structure

```
src/
├── app/
│   ├── (auth)/            # login, register, forgot-password
│   ├── (main)/            # home, providers, search, services, become-provider, dashboards
│   ├── api/               # REST API routes (auth, providers, requests, admin, ...)
│   ├── layout.tsx         # root layout
│   ├── favicon.ico        # favicon (icon.svg / icon.png / apple-icon.png also included)
│   ├── robots.ts          # robots.txt
│   └── sitemap.ts         # sitemap.xml
├── components/
│   ├── layout/            # Navbar, BottomNav, Footer, Notifications, LanguageSwitcher, UserMenu
│   ├── dashboard/         # User, Provider, Admin dashboards + shared tabs
│   ├── home/              # landing page sections
│   ├── providers/         # ProviderCard, ProviderProfile, ReportDialog, ...
│   ├── requests/          # ServiceRequestForm, ReviewDialog
│   ├── search/            # search filters
│   ├── shared/            # EmptyState, StarRating, VerifiedBadge, ...
│   └── ui/                # base UI (button, dialog, input, table, ...)
├── context/               # AuthContext, LanguageContext
├── hooks/                 # useQueries (TanStack queries)
├── lib/                   # auth, mongodb, validations, constants, i18n, upload, ...
├── models/                # Mongoose models
└── types/                 # shared TypeScript types
```

## Deployment

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com) (Next.js auto-detects the build settings).
3. Add the environment variables from the table above in Project → Settings → Environment Variables:
   - Use a **MongoDB Atlas** connection string for `MONGODB_URI` (localhost won't work on Vercel).
   - Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://help-hub-bd.vercel.app`).
   - Generate a fresh `JWT_SECRET` for production.
4. Deploy.

## License

Private project — all rights reserved.
