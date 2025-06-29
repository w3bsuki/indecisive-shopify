FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build backend and admin panel
RUN yarn build

# Railway provides PORT env var at runtime
ENV NODE_ENV=production

# Start command - it will cd to .medusa/server automatically
CMD ["yarn", "start"]