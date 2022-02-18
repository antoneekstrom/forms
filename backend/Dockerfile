FROM node:17.5-alpine3.14

ENV NODE_ENV=production

WORKDIR /app

COPY package.json .
RUN yarn install

COPY ./src ./src
COPY ./prisma/schema.prisma ./prisma/schema.prisma
COPY tsconfig.json .

RUN yarn generate
RUN yarn build

CMD yarn migrate:deploy && yarn start
