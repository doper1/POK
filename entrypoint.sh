#!/bin/bash

if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Error: ENV must be set to 'dev' or 'prod'."
  echo "Current value: '${ENV:-unset}'."
  echo "Example:"
  echo " "
  echo "docker compose --env-file=.env.dev up"
  echo "--------------------------------------------"
  exit 1
fi

[[ "$ENV" == "dev" ]] && npm run dev || npm start
