# CLAUDE.md — src/modules

Lustro `backend/internal/modules/`. Każdy moduł = jeden bounded context.

## Drzewo

```
auth/                       # logowanie / rejestracja / reset
guest/                      # widok gościa: menu, składanie zamówienia, wywołanie kelnera
restaurants/                # panel właściciela
restaurants/modules/menus/  # CRUD menu + pozycji + uploady zdjęć
restaurants/modules/tables/ # CRUD stolików, generowanie QR
restaurants/modules/orders/ # lista i obsługa zamówień
restaurants/modules/calls/  # lista wywołań kelnera
restaurants/modules/panel/  # dashboard / shell panelu
```

## Kanoniczny układ modułu

```
<module>/
  components/         # komponenty użyte tylko w tym module
  hooks/              # useXxx — fetch + stan + ewentualnie WS
  pages/              # komponenty stron (mountowane jako route element)
  services/           # *.api.ts — wywołania backendu (przez shared/services/http)
  types/              # *.types.ts — TypeScript modele (mirror backend DTO/entity)
  routes.tsx         # element <Route ... /> eksportowany dalej
  index.ts            # barrel — eksportuje routes, kluczowe hooki/api/typy
```

Niektóre moduły mają zagnieżdżone `modules/` (np. `restaurants/modules/menus`).

## index.ts (barrel)

Eksportuj tylko to, co używają inne moduły lub `app/router.tsx`:

```ts
export { menuRoutes } from './routes'
export { useMenus } from './hooks/useMenus'
export { menusApi } from './services/menus.api'
export type { Menu, CreateMenuReq } from './types/menu.types'
```

Nie re-eksportuj komponentów internalnych modułu.

## Konwencje

- **Nazwy** — pliki w kebab-case (`menus.api.ts`, `menu.types.ts`); komponenty/hooki w PascalCase/`useFoo`.
- **Importy między modułami** — wyłącznie przez barrel (`from '../../<module>'`), nie głęboko w pliki.
- **Importy z shared** — przez ścieżki względne (`../../../shared/...`) lub przyszły alias `@/shared/...` (póki co względne). Komponenty design systemu importuj z barrel'a: `import { Stack, Text, Title } from '../../../shared/components'`.
- **Typy z backendu** — duplikat w `types/`. Trzymaj nazwy zgodne z DTO (`CreateMenuReq` ↔ Go `CreateMenuReq`).
- **Walidacja** — `zod` w `services/validation.ts` (już mamy w `auth/`, `restaurants/`, `tables/`, `menus/`, `orders/`). Komunikaty po polsku, limity exportuj jako `*_LIMITS` żeby form mógł je użyć w `maxLength`.
- **Hooki** — `useXxx` zwracają `{ data, loading, error, refetch }` lub akcje (`createX, updateX, deleteX`). Łapane są `HttpError` z `shared/services/http`.
- **UI** — komponenty modułu używają wyłącznie prymitywów z `shared/components/` (Stack, Card, Text, Title, Button, FormField, …). Patrz `shared/components/CLAUDE.md`.

## Dodawanie nowego modułu

1. Stwórz strukturę jak wyżej.
2. Wystaw `routes.tsx` i barrel `index.ts`.
3. Podłącz routes w odpowiednim wyższym module (`app/router.tsx` dla top-level, `restaurants/router` dla pod-modułu).
4. Po stronie backendu zazwyczaj istnieje lustrzany moduł — dopasuj nazwy DTO i ścieżki API.
