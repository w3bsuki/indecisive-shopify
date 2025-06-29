FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat bash

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build:all

# Make start script executable
RUN chmod +x start.sh

# Railway sets PORT dynamically
EXPOSE ${PORT:-9000}

# Start the application using our startup script
CMD ["./start.sh"]