# Indecisive Wear - E-commerce Fashion Store

> Production-ready Next.js 15 + Medusa v2 e-commerce platform with zero bloat architecture

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Backend**: Medusa v2 (Node.js)
- **Database**: PostgreSQL + Supabase
- **Deployment**: Vercel (frontend) + Railway (backend)
- **Payments**: Stripe
- **Package Manager**: pnpm (frontend), yarn (backend)

## Project Structure

```
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── commerce/          # E-commerce components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & services
├── public/                # Static assets
├── backend/               # Medusa v2 backend
│   └── medusa-backend/    # Backend source
└── docs/                  # Essential documentation
```

## Quick Start

### Frontend Development
```bash
pnpm install
pnpm dev          # http://localhost:3000
```

### Backend Development  
```bash
cd backend/medusa-backend
yarn install
yarn dev          # http://localhost:9000
```

## Deployment

- **Frontend**: Auto-deploys to Vercel on push to main
- **Backend**: Auto-deploys to Railway on push to main
- **Admin Panel**: https://your-backend.railway.app/admin

## Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md) 
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture](docs/ARCHITECTURE.md)

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Frontend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend (Railway)
DATABASE_URL=postgres://...
STRIPE_API_KEY=sk_live_...
JWT_SECRET=...
COOKIE_SECRET=...
```

## Features

✅ **Production Ready**
- Server Components architecture
- Optimized performance  
- SEO friendly
- Mobile responsive

✅ **E-commerce Core**
- Product catalog
- Shopping cart
- Secure checkout
- Order management
- Customer accounts

✅ **Developer Experience**
- TypeScript throughout
- Component library
- Hot reloading
- Automated deployments

## License

MIT License - see [LICENSE](LICENSE) for details.