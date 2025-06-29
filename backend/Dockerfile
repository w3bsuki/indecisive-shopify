FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build backend and admin panel
RUN yarn build:all && \
    # Verify admin build files exist
    ls -la .medusa/server/public/admin/ || echo "Admin build directory not found" && \
    # List all .medusa contents
    find .medusa -name "index.html" || echo "No index.html found in .medusa"

# Railway provides PORT env var
ENV PORT=9000

# Start directly with yarn start
CMD ["yarn", "start"]