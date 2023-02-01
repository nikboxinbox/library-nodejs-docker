FROM node

WORKDIR /app

ARG NODE_ENV=development

# COPY ./package*.json /app

COPY . .

RUN npm install
# COPY src/ .src
EXPOSE 4000 

CMD [ "npm", "run", "dev" ]