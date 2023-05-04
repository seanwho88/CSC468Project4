FROM node:14-alpine

WORKDIR /webapp

COPY package*.json ./

RUN npm install

RUN npm install mysql2@latest --save

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
