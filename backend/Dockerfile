FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build backend and admin panel
RUN yarn build:all

# The admin panel build output is in .medusa/server/public/admin
# We need to ensure this directory persists

# Use the PORT environment variable from Railway
ENV PORT=${PORT:-9000}

# Start command includes migrations
CMD ["yarn", "start"]