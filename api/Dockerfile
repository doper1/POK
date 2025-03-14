FROM node:20-alpine3.19

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production --frozen-lockfile

COPY . . 

CMD ["node", "app.js"]