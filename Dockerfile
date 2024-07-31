FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

EXPOSE 5000

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

CMD ["npm", "run", "start:dev"]

