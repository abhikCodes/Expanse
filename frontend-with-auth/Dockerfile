FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g prisma && npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
