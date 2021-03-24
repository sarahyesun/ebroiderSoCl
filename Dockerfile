FROM node:15-alpine AS base

RUN apk --no-cache add python3

WORKDIR /usr/app

RUN apk --no-cache add --virtual build-dependencies libtool autoconf automake build-base git jq

COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile
# Clean
RUN apk del build-dependencies
RUN yarn cache clean

# Generate Prisma package
COPY db db
RUN yarn prisma generate

COPY . .
RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["yarn"]

CMD ["start"]
