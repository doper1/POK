FROM node:20-alpine3.19

WORKDIR /app

RUN addgroup pok && \
    adduser -D -h /app -G pok pok  
    

RUN apk update && apk upgrade && apk add --no-cache \
    chromium \
    imagemagick \
    optipng \
    dcron \ 
    libcap \
    dos2unix 

RUN chown pok:pok /usr/sbin/crond && \
    setcap cap_setgid=ep /usr/sbin/crond && \
    setcap cap_setgid=ep /bin/busybox

COPY --chown=pok --chmod=700 ./scripts/cronjobs.sh /var/spool/cron/crontabs/pok
RUN chown pok:pok  /var/spool/cron/crontabs/pok && \
    dos2unix /var/spool/cron/crontabs/pok

# USER pok

COPY --chown=pok --chmod=700 ./cards ./cards

COPY --chown=pok package*.json ./

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm ci 

COPY --chown=pok --chmod=700 ./scripts/entrypoint.sh ./
COPY --chown=pok ./src ./src
COPY --chown=pok ./db ./db

RUN mkdir auth && \
    chmod 700 auth && \
    chown pok auth
    
RUN mkdir newCards && \
    chmod 700 newCards && \
    chown pok newCards

CMD ["/app/entrypoint.sh"]
