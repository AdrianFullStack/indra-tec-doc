FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#RUN npx prisma migrate dev --name init
RUN npx prisma generate
#RUN npx prisma db pull

EXPOSE 3000

CMD ["npm", "run", "start:dev"]