FROM node:lts AS base

RUN apt-get update
RUN apt-get install -y python3 python3-pip ca-certificates
RUN apt-get clean

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

ARG NEXT_PUBLIC_STRIPE_PUBLIC
ENV NEXT_PUBLIC_STRIPE_PUBLIC=$NEXT_PUBLIC_STRIPE_PUBLIC

ARG SMTP_URL
ENV SMTP_URL=$SMTP_URL

ARG SMTP_FROM
ENV SMTP_FROM=$SMTP_FROM

COPY . .
RUN yarn build

ENV NODE_ENV=production
ENV UPLOAD_DIR=/data

EXPOSE 3000

ENTRYPOINT ["yarn"]

CMD ["start"]
