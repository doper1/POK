#!/bin/sh

crond -c /var/spool/cron/crontabs

node /app/src/app.js 
