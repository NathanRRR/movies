#!/usr/bin/env bash
# Redeploy movies.rivierenathan.fr on the VPS. Run this FROM the VPS,
# from /opt/movies (where the repo is checked out and .env already lives):
#
#   ssh -i ~/.ssh/claude_vps claude@72.62.185.222
#   cd /opt/movies && ./deploy.sh
#
# What it does: pulls the latest code, rebuilds/restarts the api + db
# containers, rebuilds the static front and republishes it to the
# directory nginx serves (/var/www/movies).
set -euo pipefail

cd "$(dirname "$0")"

echo "==> git pull"
git pull --ff-only origin main

echo "==> db + api"
docker compose up -d --build db api

echo "==> web build"
docker compose build web-build
docker compose run --rm web-build

echo "==> done"
docker compose ps
