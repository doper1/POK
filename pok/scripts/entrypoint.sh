#!/bin/sh

chown pok /app/newCards
chmod 770 /app/newCards

su - pok

crond -c /var/spool/cron/crontabs

node /app/src/app.js


# If this file not found when running the docker image,
# change it from CRLF to LF or copy it's content and recreate it
