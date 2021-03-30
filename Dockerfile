FROM node:15-alpine AS base

RUN apk --no-cache add python3

WORKDIR /usr/app

RUN mkdir /data

RUN apk --no-cache add --virtual build-dependencies libtool autoconf automake build-base git jq python3-dev openblas-dev lapack-dev

COPY scripts/requirements.txt scripts/requirements.txt
RUN pip3 install -r scripts/requirements.txt

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
ENV UPLOAD_DIR=/data

EXPOSE 3000

ENTRYPOINT ["yarn"]

CMD ["start"]
