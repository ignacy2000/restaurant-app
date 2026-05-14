# CLAUDE.md — backend

Go 1.26, Gin, pgx, PostgreSQL, Redis (Asynq queue), MinIO (S3), Mailpit (dev SMTP), WebSocket.

Module name: `table-service.pl` (patrz `go.mod`).

## Układ katalogów

```
cmd/api/main.go             # composition root — wszystkie wiringi tutaj
internal/database/          # connect, migrate (golang-migrate, embed.FS)
internal/database/migrations/   # *.sql (up/down), embedded
internal/modules/           # domena: każdy moduł = entity + dto + repo + svc + handler + routes
internal/ws/                # głębsza obsługa hubu/eventów
internal/testhelper/        # narzędzia testowe (np. setup DB)
pkg/config/                 # ładowanie env (.env opcjonalny)
pkg/logger/                 # slog
pkg/middleware/             # auth (JWT), CORS, request log
pkg/mailer/                 # SMTP klient
pkg/storage/                # S3 (MinIO) klient
pkg/worker/                 # Asynq server + processory
pkg/ws/                     # WS hub (broker pub/sub)
```

## Kanoniczny układ modułu (`internal/modules/<name>/`)

Patrz `auth/` jako wzorzec:

- `entity.go` — modele domenowe
- `dto.go` — request/response struktury z bindingami Gin
- `repository.go` — dostęp do DB (pgx); `NewRepository(db *sql.DB) *Repository`
- `service.go` — logika biznesowa; `NewService(repo, deps...) *Service`
- `handler.go` — Gin handlery, mapują DTO ↔ service
- `routes.go` — `func Mount(r *gin.RouterGroup, auth gin.HandlerFunc, h *Handler)`
- `repository_test.go` — unit (mock DB)
- `repository_integration_test.go` — integracja (prawdziwa DB)

Moduł z pod-modułami (np. `restaurant/`) ma dodatkowo:

- `mount.go` — wiringa pod-modułów (`MountAll`) — przeniesione z `main.go`, żeby `main.go` nie znał ich repo/svc.

## Wiring (composition root)

Wszystko składamy w `cmd/api/main.go`. Schemat: utwórz pgx pool → uruchom migrations → utwórz Asynq client/worker → utwórz hub WS → dla każdego modułu: `NewRepository → NewService → NewHandler → Mount`. Nie używaj DI containerów — wszystko ręcznie.

## Konwencje

- **Błędy** — handler zwraca `{"error": "..."}`. Wiadomości błędów krótkie i po angielsku (`invalid credentials`, `not found`), lub propaguj `err.Error()` dla błędów walidacji Gin.
- **Walidacja** — `binding:"required,email,max=320"` itp. w DTO; Gin sam zwróci 400 z opisem.
- **Auth** — middleware z `pkg/middleware`, montowany jako parametr w `Mount`.
- **Context** — zawsze `c.Request.Context()` do warstwy serwisu; nigdy `context.Background()` w handlerze.
- **WebSocket** — emisja eventów przez `hub.Broadcast(...)`; klient (właściciel restauracji) subskrybuje na `/api/ws`.
- **Migracje** — pliki `NNNN_name.up.sql` + `NNNN_name.down.sql` w `internal/database/migrations/`; embed przez `embed.FS` i `MigrateUp` na starcie.

## Komendy

```bash
# w kontenerze (preferowane — środowisko = produkcyjne dev)
docker compose exec backend go test -race -count=1 ./...
docker compose exec backend go vet ./...
docker compose exec backend go build ./...

# lokalnie
cd backend && go test ./...
```

Hot reload: `air` (patrz `.air.toml`). Edycja `.go` w `cmd/`, `internal/`, `pkg/` → rebuild w 1–3 s.

## Czego NIE robić

- Nie dodawaj zależności bez potrzeby. Stack jest celowo wąski.
- Nie wprowadzaj globalnych stanów — wszystko przez wiring w `main.go`/`mount.go`.
- Nie pisz testów z mockowanym DB tam, gdzie istnieje `*_integration_test.go` — pattern jest taki, że obie warstwy testów współistnieją.
