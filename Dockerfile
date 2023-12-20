FROM node:18


WORKDIR /app


COPY package.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .


EXPOSE 8080

RUN npm run build

CMD [ "npm", "run", "start:prod" ]