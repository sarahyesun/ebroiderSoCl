FROM node:15-alpine AS base

RUN apk --no-cache add python3

WORKDIR /usr/app

#
# Install all dependencies
#
FROM base AS base-with-dependencies

RUN apk --no-cache add --virtual build-dependencies libtool autoconf automake build-base git jq

COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

#
# Remove dev dependencies for prod
#
FROM base-with-dependencies AS prod-dependencies

RUN yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')
RUN rm -rf /usr/local/share/.cache/yarn

#
# Build app
#
FROM base-with-dependencies AS builder

# Generate Prisma package
COPY db db
RUN yarn prisma generate

COPY . .
RUN yarn build

#
# Only copy essentials
#
FROM prod-dependencies AS prod

COPY --from=builder /usr/app/.blitz .blitz
COPY --from=builder /usr/app/.next .next
COPY --from=builder /usr/app/node_modules/@prisma/client node_modules/@prisma/client
COPY scripts scripts

ENV NODE_ENV=production

ENTRYPOINT ["yarn"]

CMD ["start"]
