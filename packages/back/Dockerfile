FROM node:lts-alpine
WORKDIR /usr/src/back
RUN apk add --no-cache --virtual .gyp python make g++
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN ["chmod", "+x", "/usr/src/back/wait-for"]
EXPOSE 80
CMD node ./src/index.js