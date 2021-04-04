FROM node:15 AS base

RUN apt-get update
RUN apt-get install -y python3 python3-pip

WORKDIR /usr/app

RUN mkdir /data

RUN pip3 install cython

COPY scripts/requirements.txt scripts/requirements.txt
RUN pip3 install -r scripts/requirements.txt

COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile
# Clean
RUN yarn cache clean

# Generate Prisma package
COPY db db
RUN yarn prisma generate

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

COPY . .
RUN yarn build

ENV NODE_ENV=production
ENV UPLOAD_DIR=/data

EXPOSE 3000

ENTRYPOINT ["yarn"]

CMD ["start"]
