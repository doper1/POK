FROM node:20-alpine3.19

WORKDIR /app

RUN apk add --no-cache chromium

RUN adduser -D -h /app pok

USER pok

COPY package*.json ./

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm ci --omit=dev 

COPY ./entrypoint.sh .

COPY --chown=pok ./src ./src

RUN mkdir auth

CMD ["/bin/sh", "entrypoint.sh"]
