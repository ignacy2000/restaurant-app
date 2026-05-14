# CLAUDE.md — internal/modules

Jeden moduł = jeden bounded context. Lustro frontendowych `src/modules/`.

## Drzewo

```
auth/                       # logowanie, refresh, reset hasła, dozwolone origins (CORS)
user/                       # rejestracja użytkownika
restaurant/                 # restauracja właściciela
restaurant/menu/            # menu i pozycje menu
restaurant/table/           # stoliki (QR)
restaurant/order/           # zamówienia gości
restaurant/call/            # wywołania kelnera
```

`restaurant/` ma `mount.go` z `MountAll(...)` — montuje wszystkie pod-moduły z jednego miejsca, żeby `cmd/api/main.go` nie wiedział o `menu/`, `table/` itp.

## Plik po pliku (wzorzec)

```
entity.go                   # domenowe modele Go (czyste struktury, bez tagów JSON)
dto.go                      # request/response z bindingami Gin (CreateXReq, XResponse)
repository.go               # *Repository, metody DB (pgx)
service.go                  # *Service — logika; bierze repo + zewnętrzne zależności
handler.go                  # *Handler — Gin endpointy, DTO ↔ Service
routes.go                   # Mount(r, authMw, h) — rejestracja w routerze
repository_test.go          # jednostkowe (mocki / inproc DB)
repository_integration_test.go  # integracyjne z prawdziwą DB
```

## Dodawanie nowego modułu

1. Stwórz `internal/modules/<name>/` z plikami jak wyżej.
2. Migracja DB w `internal/database/migrations/` jeśli nowa tabela.
3. W `cmd/api/main.go` (lub jeśli jest pod-modułem `restaurant/`, w `restaurant/mount.go`) — `NewRepository → NewService → NewHandler → Mount`.
4. Endpoint pod `/api/<name>` (Gin grupa `api := r.Group("/api")`).
5. Dodaj integracyjny test repo.

## Ważne

- Repository nie wie nic o Gin. Service nie wie o Gin. Tylko Handler dotyka `*gin.Context`.
- DTO mają tagi JSON i binding; entity nie (chyba że ten konkretny model wraca surowo).
- Cross-module dependency idzie przez **typ z innego modułu** importowany, nie przez DI — patrz np. `auth.Service` używające `user.Repository`, czy `restaurant/order.Service` używające `restaurant/table.Repository`.
- Zewnętrzne zależności (storage S3, mailer, hub WS, kolejka) trafiają do `Service` jako **interfejsy zdefiniowane lokalnie w module** (patrz `restaurant.ImageStore` w `mount.go`), żeby testy nie musiały importować `pkg/storage` itp.

## Co już istnieje

Moduły implementujące powyższy wzorzec:

- `auth/` — login/refresh/logout, reset hasła (mail przez Asynq), `origins` dla dynamic CORS
- `user/` — rejestracja
- `restaurant/` — restauracje (zalogowanego właściciela)
- `restaurant/menu/` — sekcje + pozycje menu; upload zdjęć (multipart → S3)
- `restaurant/table/` — stoliki z pojemnością (QR generuje frontend)
- `restaurant/order/` — zamówienia + flow `awaiting_confirmation` z linkiem e-mailowym (token jednorazowy)
- `restaurant/call/` — wywołania kelnera
