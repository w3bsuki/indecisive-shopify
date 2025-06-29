FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies including devDependencies for build
RUN yarn install --frozen-lockfile --production=false

# Copy all source files
COPY . .

# Build backend and admin panel
RUN yarn build && \
    ls -la .medusa/server/public/admin/ && \
    echo "Admin build completed"

# Make start script executable
RUN chmod +x start.sh

# Railway provides PORT env var at runtime
ENV NODE_ENV=production

# Use start script to handle PORT
CMD ["./start.sh"]