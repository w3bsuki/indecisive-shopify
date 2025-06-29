FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies without check-cache bullshit
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN yarn build:all

# Run migrations and start
CMD ["sh", "-c", "yarn db:migrate && yarn start"]