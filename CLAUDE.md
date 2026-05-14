# CLAUDE.md — restaurant-app

Monorepo: aplikacja do obsługi stolików w restauracji.

## Stos

- **backend/** — Go 1.26 + Gin + pgx + PostgreSQL + Redis (Asynq) + WebSocket
- **frontend/** — React 18 + Vite + TypeScript + Tailwind v4 + Bun + Storybook 8
- **docker-compose.yml** — Postgres, Redis, MinIO (S3 dla zdjęć menu), Mailpit, backend, frontend
- **Tiltfile** — orkiestracja dev (hot reload przez sync; pełny rebuild na zmianę `go.mod`/`bun.lock`)

## Uruchomienie

```bash
tilt up         # cały stack z hot reloadem
tilt down       # stop (volumes zostają)
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Tilt UI: http://localhost:10350
- MinIO console: http://localhost:9001 (`minioadmin` / `minioadmin`)
- Mailpit UI: http://localhost:8025

Bez kontenerów (pod IDE/testy):

```bash
cd backend && go mod download && go run ./cmd/api
cd frontend && bun install --frozen-lockfile && bun run dev
```

## Testy

W kontenerze (pewne):

```bash
docker compose exec backend  go test -race -count=1 ./...
docker compose exec frontend bun run test
```

Lokalnie też działa.

## Polityka commitów

- Nie commituję bez polecenia użytkownika.
- Wiadomości po polsku w formie krótkiego opisu (patrz `git log`).
- Nie skipuj hooków, nie używaj `--amend` po porażce hooka — twórz nowy commit.

## Konwencje wysokopoziomowe

- Wszystkie teksty UI i komunikaty błędów po polsku.
- Backend i frontend mają lustrzaną strukturę "modułów" (auth, restaurants, restaurants/menu, …) — patrz `backend/internal/modules/CLAUDE.md` i `frontend/src/modules/CLAUDE.md`.
- Migracje DB są **embedded** i uruchamiają się automatycznie na starcie backendu — patrz `backend/cmd/api/main.go`.

## Memory

Vite dev server w kontenerze frontu chodzi pod **Node, nie Bun** — Bun's `http.Server` psuje vite'owe WS proxy. Patrz `frontend/Dockerfile`.
