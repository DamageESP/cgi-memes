FROM node:lts-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache --virtual .gyp python make g++
COPY package*.json ./
RUN npm install --silent
COPY . .
EXPOSE 80
CMD npx forever start ./src/index.js