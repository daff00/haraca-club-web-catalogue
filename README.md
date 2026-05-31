# Haraca — E-Commerce Website

Marketing site + product catalog for Haraca fashion brand.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Prisma · Supabase · NextAuth.js · Vercel

---

## Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd haraca
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your values:
- `DATABASE_URL` — Supabase connection string (Transaction mode, port 6543)
- `DIRECT_URL` — Supabase direct connection (Session mode, port 5432)
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Dashboard → Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase Dashboard → Project Settings → API
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`

### 3. Database setup

```bash
# Push schema to Supabase
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed initial data (admin user + sample content)
npm run db:seed
```

> **Default admin credentials after seed:**
> Email: `admin@haraca.id`
> Password: `haraca2024!`
> ⚠️ Change this immediately after first login.

### 4. Supabase Storage

Create a storage bucket in Supabase Dashboard:
- Bucket name: `haraca-media`
- Public bucket: ✅ Yes

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Project Structure

```
src/
  app/
    (public)/         ← Public pages (Home, Shop, Lookbook, About, Contact)
    (admin)/admin/    ← Admin panel (protected)
    api/              ← API routes (auth, upload)
    not-found.tsx     ← Custom 404
  components/
    ui/               ← Shared UI components (Button, Input, Card, Badge)
    public/           ← Public-facing components (Navbar, Footer, ProductCard)
    admin/            ← Admin components (Sidebar, DataTable, ImageUploader)
  lib/
    prisma.ts         ← Prisma client singleton
    supabase.ts       ← Supabase client
    auth.ts           ← NextAuth config
    wa.ts             ← WhatsApp message builder
  types/
    index.ts          ← Shared TypeScript types
prisma/
  schema.prisma       ← Database schema
  seed.ts             ← Seed script
```

## Useful Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run db:push       # Push schema changes to DB
npm run db:migrate    # Create a migration
npm run db:studio     # Open Prisma Studio (DB GUI)
npm run db:seed       # Seed database with initial data
npm run db:generate   # Regenerate Prisma client
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables in Vercel → Project Settings → Environment Variables
4. Deploy

> Make sure to set `NEXTAUTH_URL` to your production URL in Vercel env vars.
