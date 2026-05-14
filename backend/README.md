# rst — Restaurant Table Service API

REST API do zarządzania restauracją: menu (z uploadem zdjęć), stoliki (QR), zamówienia (z potwierdzaniem przez e-mail), wywołania kelnera i powiadomienia w czasie rzeczywistym przez WebSocket.

## Stack

- **Go 1.26** — Gin, pgx, golang-migrate
- **PostgreSQL** — baza danych (migracje embedded)
- **Redis** — cache dozwolonych origins (CORS), kolejka zadań asynchronicznych (Asynq)
- **MinIO (S3)** — przechowywanie zdjęć pozycji menu
- **WebSocket** — powiadomienia real-time dla właściciela restauracji i widoku gościa
- **SMTP** — Mailpit w dev, Gmail/dowolny SMTP w prod (reset hasła, potwierdzenie zamówienia)

## Wymagania

- Go 1.26+
- PostgreSQL
- Redis
- S3-kompatybilny storage (MinIO w dev)

## Uruchomienie

Najprościej przez Tilt z root repo (`tilt up`) — patrz top-level README. Standalone:

```bash
cp .env.example .env   # uzupełnij zmienne (lub uruchom z env z docker-compose)
go run ./cmd/api
```

Serwer przy starcie automatycznie uruchamia migracje, ensure'uje bucket S3 i startuje worker kolejki.

## Zmienne środowiskowe

| Zmienna | Domyślna | Opis |
|---------|----------|------|
| `PORT` | `8080` | Port serwera |
| `DATABASE_URL` | — | Connection string PostgreSQL |
| `ENV` | `development` | Tryb (`development` / `production`) |
| `JWT_SECRET` | `change-me-in-production` | Sekret podpisywania JWT |
| `FRONTEND_URL` | `http://localhost:3000` | Adres frontendu (CORS + linki w mailach) |
| `REDIS_ADDR` | `localhost:6379` | Adres Redis |
| `SMTP_HOST` | `localhost` | Host SMTP (Mailpit, Gmail itp.) |
| `SMTP_PORT` | `1025` | Port SMTP (Mailpit `1025`, Gmail `587`) |
| `SMTP_FROM` | `no-reply@localhost` | Adres nadawcy |
| `SMTP_USERNAME` | — | Login SMTP (puste = bez auth, np. dla Mailpit) |
| `SMTP_PASSWORD` | — | Hasło SMTP |
| `S3_ENDPOINT` | `localhost:9000` | Endpoint S3 (wewnątrz sieci) |
| `S3_PUBLIC_ENDPOINT` | `http://localhost:9000` | Endpoint publiczny do generowania URL-i zdjęć |
| `S3_ACCESS_KEY` | `minioadmin` | Access key |
| `S3_SECRET_KEY` | `minioadmin` | Secret key |
| `S3_BUCKET` | `menu-images` | Nazwa bucketu dla zdjęć menu |
| `S3_USE_SSL` | `false` | TLS dla połączenia z S3 |

## API

Wszystkie endpointy pod `/api`. `🔒` oznacza wymagany JWT w nagłówku `Authorization: Bearer <token>`.

### Autentykacja

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `POST` | `/api/auth/login` | Logowanie |
| `POST` | `/api/auth/logout` | Wylogowanie |
| `POST` | `/api/auth/refresh` | Odświeżenie access tokena |
| `POST` | `/api/auth/forgot-password` | Żądanie resetu hasła (wysyła link e-mailem) |
| `POST` | `/api/auth/reset-password` | Ustawienie nowego hasła tokenem |

### Dozwolone origins (CORS) `🔒`

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `GET` | `/api/origins` | Lista dozwolonych origins |
| `POST` | `/api/origins` | Dodaj origin (np. produkcyjna domena) |
| `DELETE` | `/api/origins/:id` | Usuń origin |

### Użytkownicy

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `POST` | `/api/users` | Rejestracja |

### Restauracje

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| `GET` | `/api/restaurants/:id` | — | Pobierz restaurację (publiczne — używane przez widok gościa) |
| `POST` | `/api/restaurants` | 🔒 | Utwórz restaurację |
| `GET` | `/api/restaurants/my` | 🔒 | Restauracje zalogowanego użytkownika |

### Menu

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| `GET` | `/api/restaurants/:id/menus` | — | Lista menu (sekcji) restauracji |
| `GET` | `/api/restaurants/:id/menu-items` | — | Wszystkie pozycje menu restauracji |
| `POST` | `/api/restaurants/:id/menus` | 🔒 | Utwórz menu (sekcję) |
| `PATCH` | `/api/menus/:menuId` | 🔒 | Aktualizuj menu |
| `POST` | `/api/menus/:menuId/items` | 🔒 | Dodaj pozycję do menu |
| `PATCH` | `/api/menu-items/:itemId` | 🔒 | Aktualizuj pozycję |
| `POST` | `/api/menu-items/:itemId/image` | 🔒 | Upload zdjęcia (multipart) — wrzuca do S3 |
| `DELETE` | `/api/menu-items/:itemId` | 🔒 | Usuń pozycję |

### Stoliki

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| `GET` | `/api/restaurants/:id/tables` | — | Lista stolików (publiczne — gość czyta po skanowaniu QR) |
| `POST` | `/api/restaurants/:id/tables` | 🔒 | Utwórz stolik |
| `PATCH` | `/api/restaurants/:id/tables/:tableId` | 🔒 | Aktualizuj pojemność |
| `DELETE` | `/api/restaurants/:id/tables/:tableId` | 🔒 | Usuń stolik |

### Zamówienia

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| `POST` | `/api/restaurants/:id/tables/:tableId/orders` | — | Złóż zamówienie (gość) — jeśli z e-mailem, idzie do stanu `awaiting_confirmation` i wysyła link potwierdzający |
| `GET` | `/api/restaurants/:id/tables/:tableId/orders` | — | Zamówienia stolika (gość śledzi swój status) |
| `GET` | `/api/orders/confirm?token=…` | — | Potwierdzenie zamówienia tokenem z e-maila |
| `GET` | `/api/restaurants/:id/orders` | 🔒 | Wszystkie zamówienia restauracji |
| `GET` | `/api/restaurants/:id/orders/active` | 🔒 | Aktywne zamówienia (panel obsługi) |
| `PATCH` | `/api/restaurants/:id/orders/:orderId/status` | 🔒 | Zmień status zamówienia |

### Wywołania kelnera

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| `POST` | `/api/restaurants/:id/tables/:tableId/calls` | — | Wywołaj kelnera (gość) |
| `GET` | `/api/restaurants/:id/calls` | 🔒 | Lista wywołań |
| `GET` | `/api/restaurants/:id/calls/active` | 🔒 | Aktywne wywołania (panel) |
| `PATCH` | `/api/restaurants/:id/calls/:callId/status` | 🔒 | Zmień status wywołania |

### WebSocket

| Ścieżka | Auth | Opis |
|---------|------|------|
| `GET /api/ws/restaurants/:id` | JWT w `?token=` | Właściciel — odbiera `order.created`, `order.status_changed`, `call.created`, `call.status_changed` |
| `GET /api/ws/restaurants/:id/tables/:tableId` | — | Stolik gościa — odbiera `order.status_changed` dla swojego stolika |

## Testy

```bash
# Jednostkowe (mocki / sqlmock)
go test ./internal/modules/...

# Integracyjne (wymaga Dockera — testcontainers-go uruchamia Postgres)
go test -tags integration ./internal/modules/...

# Race detector + brak cache
go test -race -count=1 ./...
```

## Struktura projektu

```
cmd/api/          # Punkt wejścia, composition root
internal/
  database/       # Połączenie DB, migracje (embedded SQL)
  modules/
    auth/         # JWT, sesje, reset hasła, dynamic CORS origins
    user/         # Rejestracja
    restaurant/   # Restauracje + sub-moduły: menu, table, order, call (montowane przez mount.go)
  ws/             # Handler HTTP WebSocket (upgrade + auth)
  testhelper/     # Pomocniki do testów integracyjnych
pkg/
  config/         # Ładowanie zmiennych środowiskowych
  logger/         # Strukturalne logi (slog)
  mailer/         # Klient SMTP
  middleware/     # Auth JWT, dynamic CORS (cache Redis), recovery, request log
  storage/        # Klient S3 (MinIO) — upload/serve zdjęć menu
  worker/         # Asynq — serwer + procesor zadań email
  ws/             # Hub WebSocket, klienci, zdarzenia
```
