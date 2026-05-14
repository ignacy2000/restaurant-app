# CLAUDE.md — frontend

React 18 + Vite + TypeScript + Tailwind v4 + Bun. Storybook 8 dla design systemu. Vitest + RTL dla testów.

## Komendy

```bash
# w kontenerze
docker compose exec frontend bun run test
docker compose exec frontend bun run test:watch
docker compose exec frontend bun run test:coverage
docker compose exec frontend bunx tsc --noEmit

# lokalnie z hosta
cd frontend && bun run dev
cd frontend && bun run storybook   # http://localhost:6006
cd frontend && bun run build       # tsc + vite build
```

Vite dev server **w kontenerze** chodzi pod Node, nie pod Bun — Bun's `http.Server` psuje vite WS proxy. Patrz `Dockerfile`.

## Struktura

```
src/app/             # composition root: App, providers, AppHeader, router
src/modules/         # domena (auth, restaurants, restaurants/<sub>, guest)
src/shared/          # components (design system), hooks, services, contexts, utils
src/test/setup.ts    # vitest setup (@testing-library/jest-dom)
.storybook/          # konfiguracja Storybooka (stories matched by **/*.stories.tsx)
```

## Routing

Top-level w `src/app/router.tsx` zbiera `authRoutes`, `guestRoutes` i `<RestaurantRouter />`. Każdy moduł eksportuje swoje routes z `<module>/routes.tsx`. Pod-moduły (np. `restaurants/modules/menus`) eksportują `menuRoutes` i są zagnieżdżane w `RestaurantRouter`.

## Stylowanie

- **Tailwind v4** przez `@tailwindcss/vite`. Brak `tailwind.config.*` — konfiguracja w CSS (`@import`/`@theme`).
- Klasy łączone przez [src/shared/utils/cn.ts](src/shared/utils/cn.ts) (`clsx` + `tailwind-merge`).
- Dark mode jest globalny (klasa `dark` na `<html>`) — komponenty ZAWSZE deklarują warianty `dark:`.

## HTTP

Wszystkie wywołania API przez [src/shared/services/http.ts](src/shared/services/http.ts):

- `http<T>(path, options)` — bez auth, dla publicznych endpointów (np. login, guest).
- `authedHttp<T>(path, options)` — z bearer tokenem, auto-refresh przy 401.
- Rzuca `HttpError` (status + message). Łap to w hookach/formularzach.

Bazowy URL to `/api` (proxy w `vite.config.ts` na `VITE_API_PROXY_TARGET`).

## Walidacja formularzy

`zod` (już w deps). Komunikaty po polsku.

## Testy

```bash
bun run test                    # vitest run (jsdom + RTL)
bun run test src/.../File.test  # pojedynczy plik
```

Konwencje:

- Plik testu obok komponentu: `Foo.tsx` + `Foo.test.tsx`.
- `MemoryRouter` z `react-router-dom` do testów stron.
- Dla MSW/fetch — póki co testy używają `vi.spyOn(global, 'fetch')` ad-hoc.

## Storybook

- Każdy komponent z `shared/components/` ma `*.stories.tsx`.
- Stories używają `Meta` + `StoryObj`, args po polsku.
- Routing w story → opakować w `MemoryRouter`.

## Czego NIE robić w nowym kodzie feature'owym

- Nie używaj surowych elementów typograficznych/layoutowych — używaj design systemu z `shared/components/` (patrz `shared/components/CLAUDE.md`).
- Nie importuj `react-router-dom` `Link` bezpośrednio w stronach — używaj `Link` z `shared/components`.
- Nie wprowadzaj globalnych styli — wszystko przez Tailwind + warianty komponentów.
