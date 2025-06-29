FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN yarn install

# Build the application (creates .medusa directory)
RUN yarn build

# The app expects to run from .medusa/server
WORKDIR /app/.medusa/server

# Install production dependencies in the server directory
RUN yarn install --production

# Use Railway's PORT
ENV NODE_ENV=production

# Start from the server directory
CMD ["yarn", "start"]