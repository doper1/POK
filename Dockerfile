FROM node:20-alpine3.19

WORKDIR /app

RUN apk add --no-cache chromium

RUN adduser -D -h /app pok

USER pok

COPY package*.json ./

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm ci 

COPY --chown=pok ./src ./src

COPY --chown=pok ./drizzle.config.ts .

RUN mkdir auth

CMD ["node", "src/app.js"]
