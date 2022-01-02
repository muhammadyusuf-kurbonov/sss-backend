FROM node:16-alpine3.12 as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

EXPOSE 3030
CMD ["yarn", "start"]