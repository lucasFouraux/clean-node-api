FROM node:14.17.3

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build
CMD [ "npm", "start" ]
