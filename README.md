# PermitFlorida

**Florida's Building Permit Navigator**

A webapp that helps Florida homeowners and contractors determine if they need a building permit for their project. Covers all 470 Florida jurisdictions with Florida Building Code compliance.

## Features

- ✅ **Instant Permit Checks** — Get YES/NO/MAYBE answers in under 60 seconds
- ✅ **Complete Florida Coverage** — All 67 counties + 400+ municipalities
- ✅ **Hurricane & Flood Zones** — Automatic zone detection and requirements
- ✅ **Three Pricing Tiers**:
  - **Free**: 3 lookups/month
  - **Pro**: $19/month unlimited
  - **Contractor**: $49/month with lead generation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **Payments**: Stripe

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Stripe
STRIPE_PUBLIC_KEY="pk_..."
RIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Deployment

This app is configured for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## License

MIT

---

Built with ❤️ for Florida homeowners and contractors.
