FROM node:latest

WORKDIR /app

ARG NODE_ENV=development
COPY . .
# COPY ./package*.json ./
RUN npm install
# COPY src/ .src

CMD [ "npm", "run", "dev" ]