# movies

Classement personnel de films, avec une page publique en lecture seule.

- `api/`: backend Node.js / Express / TypeScript / Prisma (MariaDB)
- `web/`: frontend React / Vite / TypeScript

## Lancement en local

### Base de données (MariaDB via Docker)

L'API a besoin d'une MariaDB. Le plus simple est d'utiliser le `docker-compose.yml` a la racine :

```bash
docker compose up -d db
```

Cree un `.env` a la racine (voir les variables `MARIADB_*` dans `docker-compose.yml`) et un `api/.env` avec au minimum `DATABASE_URL`, `TMDB_API_KEY`, `ADMIN_PASSWORD_HASH`. Puis :

```bash
cd api
npm install
npx prisma migrate dev
npm run db:seed
```

### API

```bash
cd api
npm install
npm run dev
```

### Web

```bash
cd web
npm install
npm run dev
```

## Changement du mot de passe admin

Pour modifier le mot de passe admin, genere un nouveau hash bcrypt puis relance le seed avec `FORCE_ADMIN_PASSWORD_RESET=true`.
Cela met a jour l'utilisateur admin sans reinitialiser la base de donnees.

Exemple:

```bash
cd api
ADMIN_PASSWORD_HASH="<hash bcrypt>" FORCE_ADMIN_PASSWORD_RESET=true npm run db:seed
```

## Deploiement (production)

Deploye sur `https://movies.rivierenathan.fr` : Docker Compose (services `db` + `api`) derriere nginx (hote), qui sert aussi le front statique (`/var/www/movies`) et proxy `/api/*` vers le conteneur API. Same-origin (pas de CORS, cookie `SameSite=Strict`), HTTPS via Let's Encrypt/certbot.

### Redeploiement

Depuis le VPS (`/opt/movies`, deja clone depuis ce repo) :

```bash
./deploy.sh
```

Ce script fait `git pull`, rebuild/redemarre `db` + `api`, puis rebuild le front et le republie dans le dossier servi par nginx. Voir `deploy.sh` pour le detail.

### Premiere installation sur un nouveau serveur

1. `git clone` le repo dans `/opt/movies`
2. Creer `/opt/movies/.env` (secrets prod : mots de passe MariaDB, `TMDB_API_KEY`, `ADMIN_PASSWORD_HASH` — **les `$` d'un hash bcrypt doivent etre doubles `$$`**, docker-compose interprete `$` comme une substitution de variable)
3. `docker compose up -d --build db api` (la migration Prisma s'applique automatiquement au demarrage du conteneur `api`)
4. Seed initial : `docker compose exec api node dist/prisma/seed.js` (pas `npm run db:seed`, qui depend de `tsx`, absent de l'image de prod)
5. `docker compose build web-build && docker compose run --rm web-build` pour generer le front dans le dossier configure par `WEB_DIST_PATH`
6. Config nginx (bloc `server` avec `root` sur le dossier statique + `location /api/` en `proxy_pass` vers l'API) + `certbot --nginx -d <domaine>`
