FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

ENV NODE_ENV=production

# Use the exact command from official docs
CMD ["sh", "-c", "cd .medusa/server && yarn install && yarn predeploy && yarn run start"]