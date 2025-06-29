FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

WORKDIR /app/.medusa/server
RUN npm install --production

ENV NODE_ENV=production

CMD ["sh", "-c", "npm run predeploy && npm run start"]