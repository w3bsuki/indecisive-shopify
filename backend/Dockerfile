FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

ENV NODE_ENV=production
ENV MEDUSA_BACKEND_URL=http://0.0.0.0:9000

# Use the exact command from official docs
CMD ["sh", "-c", "cd .medusa/server && yarn install && yarn predeploy && MEDUSA_BACKEND_HOST=0.0.0.0 yarn run start"]