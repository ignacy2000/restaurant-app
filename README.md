# restaurant-app

Monorepo dla aplikacji do obsługi stolików w restauracji.

```
restaurant-app/
├── backend/          Go (Gin) + PostgreSQL + Redis
├── frontend/         React + Vite + Bun
├── docker-compose.yml
└── Tiltfile
```

## Wymagania

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (uruchomione)
- [Tilt](https://docs.tilt.dev/install.html): `brew install tilt-dev/tap/tilt`

## Uruchomienie

```bash
tilt up
```

- Tilt UI: <http://localhost:10350>
- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8080>
- Redis Commander: <http://localhost:8081>
- Postgres: `localhost:5432` (user: `app`, password: `app`, db: `app`)

`tilt up` zbuduje obrazy dev (backend z [air](https://github.com/air-verse/air) dla hot reload, frontend z Vite + HMR), wystartuje cały stack i zacznie obserwować zmiany w plikach.

```bash
tilt down                # zatrzymaj kontenery (dane DB zostają w volumenach)
docker volume rm restaurant-app_postgres_data restaurant-app_redis_data   # pełny reset
```

## Hot reload

- **Backend**: edycja dowolnego `.go` w `backend/cmd|internal|pkg/` → `air` rekompiluje binarkę w 1–3 s.
- **Frontend**: edycja `frontend/src/` → Vite HMR przeładowuje moduły bez full reloadu.
- **Zależności**: zmiana `go.mod`/`go.sum` lub `package.json`/`bun.lock` → Tilt robi pełny rebuild obrazu.

## Migracje DB

Backend uruchamia `golang-migrate` automatycznie na starcie ([backend/cmd/api/main.go](backend/cmd/api/main.go)). Świeży `tilt up` na pustej bazie utworzy schemat sam.

## Build produkcyjny

Każdy Dockerfile ma stage `prod`:

```bash
docker build --target prod -t restaurant-app-backend:prod ./backend
docker build --target prod -t restaurant-app-frontend:prod ./frontend
```
