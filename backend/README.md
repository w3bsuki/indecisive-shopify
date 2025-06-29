# Indecisive Wear Backend - Medusa 2.0 + Stripe + Supabase

A modern e-commerce backend built with Medusa 2.0, integrated with Stripe for payments and Supabase for authentication and custom features.

## 🚀 Features

- **Medusa 2.0** - Headless commerce platform
- **Stripe Integration** - Complete payment processing with webhooks
- **Supabase Auth** - JWT-based authentication
- **Reviews System** - Product reviews with voting
- **Social Sharing** - Track social media shares
- **Production Ready** - Configured for Render deployment

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Stripe account
- Supabase project

## 🛠️ Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Variables

Copy `.env.template` to `.env` and configure:

```bash
cp .env.template .env
```

Key variables to set:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `STRIPE_API_KEY` - Your Stripe secret key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Supabase service key

### 3. Database Setup

Run Medusa migrations:

```bash
yarn medusa migrations run
```

### 4. Supabase Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration from `src/migrations/supabase/001_create_reviews_schema.sql`
4. Enable real-time for the tables if needed

### 5. Start Development

```bash
yarn dev
```

The backend will be available at `http://localhost:9000`

## 📁 Project Structure

```
src/
├── api/
│   ├── middlewares/
│   │   └── supabase-auth.ts    # JWT authentication
│   ├── store/
│   │   ├── reviews/            # Review endpoints
│   │   └── social/             # Social sharing
│   └── webhooks/
│       └── stripe/             # Stripe webhooks
├── config/
│   └── security.ts             # Security configuration
├── utils/
│   ├── stripe/                 # Stripe utilities
│   └── supabase/               # Supabase client
└── migrations/
    └── supabase/               # Database schema
```

## 🔐 API Endpoints

### Reviews

```bash
# List reviews
GET /store/reviews?product_id=prod_123&sort=newest&limit=20

# Create review
POST /store/reviews
{
  "product_id": "prod_123",
  "rating": 5,
  "title": "Great product",
  "content": "Love it!"
}

# Vote on review
POST /store/reviews/:id/vote
{
  "is_helpful": true
}
```

### Social Sharing

```bash
# Get share URLs
GET /store/social/share?product_id=prod_123

# Track share
POST /store/social/share
{
  "product_id": "prod_123",
  "platform": "twitter"
}
```

## 🚢 Deployment

### Deploy to Render

1. Push to GitHub
2. Create a new Blueprint on Render
3. Connect your repository
4. Use the provided `render.yaml`
5. Add environment variables
6. Deploy!

### Manual Deployment

```bash
# Build
yarn build

# Start production
yarn start
```

## 🧪 Testing

### Test Stripe Webhooks

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:9000/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

### Test Supabase Auth

```bash
# Get a JWT token from Supabase
curl -X POST https://your-project.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Use the token
curl http://localhost:9000/store/reviews \
  -H "Authorization: Bearer your-jwt-token"
```

## 📈 Monitoring

- Health check: `GET /health`
- Medusa Admin: `http://localhost:9000/admin`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

MIT