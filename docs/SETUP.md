# Development Setup Guide

## Prerequisites

- Node.js 20+ 
- pnpm (frontend)
- yarn (backend)
- PostgreSQL
- Git

## Frontend Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open browser**
   - Frontend: http://localhost:3000

## Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend/medusa-backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Database setup**
   ```bash
   # Start PostgreSQL locally or use Docker
   docker-compose up -d postgres
   
   # Run migrations
   npx medusa db:migrate
   ```

4. **Seed data (optional)**
   ```bash
   yarn seed
   ```

5. **Start backend server**
   ```bash
   yarn dev
   ```

6. **Access admin panel**
   - Backend API: http://localhost:9000
   - Admin Panel: http://localhost:9000/admin

## Docker Development (Optional)

```bash
docker-compose up
```

This starts:
- PostgreSQL database
- Redis (optional)
- Medusa backend

## Troubleshooting

### Frontend Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall: `rm -rf node_modules && pnpm install`

### Backend Issues  
- Reset database: `npx medusa db:migrate --force`
- Clear build: `rm -rf .medusa`
- Reinstall: `rm -rf node_modules && yarn install`

### Common Errors
- **Port conflicts**: Change ports in respective configs
- **Database connection**: Verify `DATABASE_URL` in `.env`
- **CORS errors**: Check CORS settings in `medusa-config.ts`

## Development Commands

### Frontend
```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run tests
```

### Backend
```bash
yarn dev          # Development server  
yarn build        # Production build
yarn start        # Start production build
yarn test         # Run tests
```

## Next Steps

1. Configure environment variables
2. Set up payment providers (Stripe)
3. Configure email providers
4. Set up file storage
5. Deploy to production

See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup.