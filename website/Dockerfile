FROM node:20-alpine3.19 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine3.19 AS runner

WORKDIR /app

RUN addgroup -S website && \
    adduser -S -D -h /app -G website website && \
    apk update && apk upgrade && apk add --no-cache \
    tini \
    && rm -rf /var/cache/apk/*

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production \
    PORT=3000

USER website

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build"] 