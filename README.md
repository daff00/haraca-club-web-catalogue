# Haraca

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?logo=supabase)
![Jest](https://img.shields.io/badge/Jest-30-C21325?logo=jest)

Haraca is a modern fashion e-commerce landing site and content management system for the Haraca brand. The app combines a public storefront with an admin dashboard for managing products, banners, lookbook photos, testimonials, brand content, and contact information.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (via Supabase)
- Supabase Storage
- NextAuth
- Jest + Testing Library

## Main Features

- Public pages for Home, Shop, Lookbook, About, and Contact
- Product catalog with categories, labels, and product detail support
- Admin panel for managing:
  - products
  - banners
  - lookbook photos
  - testimonials
  - brand content
  - contact information
  - admin users
- Image upload flow to Supabase Storage
- Responsive UI for desktop and mobile

## Project Structure

```text
src/
  app/
    (public)/          # Public-facing routes
    (admin)/admin/     # Admin routes and protected pages
    api/               # API routes including upload handling
  components/
    public/            # Public UI components
    admin/             # Admin UI components
    ui/                # Shared UI primitives
  lib/                  # Auth, Prisma, Supabase, validation helpers
  actions/             # Server actions for data access
  types/               # Shared TypeScript types
prisma/
  schema.prisma        # Database schema
  seed.ts              # Seed script for sample data
```

## Prerequisites

Make sure you have installed:

- Node.js 20+
- npm
- A Supabase project
- A PostgreSQL database connection

## Environment Variables

Create a file named `.env.local` in the project root and add the following variables:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Notes

- `DATABASE_URL` and `DIRECT_URL` should come from your Supabase PostgreSQL setup.
- `NEXTAUTH_SECRET` can be generated with:

```bash
openssl rand -base64 32
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Prepare the database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

The seed script creates:

- an admin user
- sample contact information
- sample brand content
- sample products and testimonials

Default admin credentials after seeding:

- Email: `admin@haraca.id`
- Password: `haraca2024!`

> Change the password after your first login.

### 3. Create Supabase storage bucket

In your Supabase dashboard, create a public bucket named `haraca-media`.
This bucket is used for uploaded product, banner, and lookbook images.

### 4. Run the app

```bash
npm run dev
```

Then open:

- public site: http://localhost:3000
- admin login: http://localhost:3000/admin/login

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio
npm run db:seed
```

## Testing

Run the test suite with:

```bash
npm run test
```

## Deployment

For deployment on Vercel or another Node.js host:

1. Push the project to GitHub.
2. Add all environment variables in your hosting platform.
3. Make sure the Supabase bucket is already created and public.
4. Run the database migration/push step in the production environment.

If you deploy to Vercel, set `NEXTAUTH_URL` to your production domain in the environment variables.
