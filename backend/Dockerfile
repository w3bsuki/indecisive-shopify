FROM node:20-alpine

WORKDIR /app

# Copy package files ONLY
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the app
RUN yarn build:all

# Start the app
CMD ["yarn", "start"]