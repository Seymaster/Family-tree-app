
###
# 1. Dependencies
###

FROM node:14.5-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

#Change Work Directory
WORKDIR /home/node/app

#Copy the package.json file
COPY package.json package-lock.json ./

RUN apk update && apk upgrade && apk add ca-certificates && update-ca-certificates && apk add curl


RUN apk add --update tzdata && apk add curl

ENV TZ=Africa/Lagos

# Clean APK cache
RUN rm -rf /var/cache/apk/*

RUN npm install --production

COPY --chown=node:node . .

EXPOSE 80


CMD npm run start


#DOCKER_NAME=registry.gitlab.com/tm30/vas-aggregator-platform/backend/campaign-service