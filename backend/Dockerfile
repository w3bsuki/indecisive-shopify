FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies including devDependencies for build
RUN yarn install --frozen-lockfile --production=false

# Copy all source files
COPY . .

# Build backend and admin panel
RUN yarn build

# The build output is in .medusa/server
# We need to install dependencies there and run from there
WORKDIR /app/.medusa/server

# Install production dependencies in the build output directory
RUN yarn install --production

# Railway provides PORT env var at runtime
ENV NODE_ENV=production
ENV DISABLE_MEDUSA_ADMIN=false

# Start from the .medusa/server directory
CMD ["yarn", "start"]