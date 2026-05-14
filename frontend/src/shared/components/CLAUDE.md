# CLAUDE.md — design system

Wszystko jest komponentem. Nie używaj surowych `<div>`, `<p>`, `<span>`, `<h1>`, `<a>`, `<img>`, `<ul>`, `<button>` w kodzie feature'owym — używaj prymitywów z tego folderu.

## Mapa prymitywów

### Typografia

| HTML | Komponent | Props |
|------|-----------|-------|
| `<h1>`–`<h6>` | `Title` | `level`, `size`, `tone`, `align`, `truncate` |
| `<p>`, `<span>`, `<small>`, `<strong>`, `<em>` | `Text` | `as`, `size`, `weight`, `tone`, `align`, `truncate`, `italic` |
| `<label>` | `Label` | `size`, `required` |
| `<a>` / `<Link>` z RR | `Link` | `to` (internal) lub `href` (external), `variant`, `size`, `underline` |

### Layout

| HTML | Komponent | Props |
|------|-----------|-------|
| `<div>` generyczne | `Box` | `as` (`section`/`article`/`header`/…) |
| `<div className="flex flex-col gap-…">` | `Stack` | `direction`, `gap`, `align`, `justify`, `wrap`, `inline`, `fullWidth` |
| `<div className="flex …">` | `Flex` | jak `Stack` + `direction="row"` default |
| `<div className="grid grid-cols-…">` | `Grid` | `cols`, `responsive: { sm, md, lg, xl }`, `gap` |
| `<div className="max-w-… mx-auto">` | `Container` | `maxWidth`, `padding`, `centered` |
| `<hr>` / pionowy separator | `Divider` | `orientation`, `spacing` |

### Treść/media

| HTML | Komponent | Props |
|------|-----------|-------|
| `<img>` | `Image` | wymagany `alt`, `radius`, `fit`, `ratio`, lazy default |
| inline SVG | `Icon` | `size`, `tone`, `label` (a11y); dzieci = `<path>` |
| `<ul>`/`<ol>` + `<li>` | `List` + `ListItem` | `variant` (`unordered`/`ordered`/`none`), `spacing` |

### Wcześniej istniejące

`Alert`, `Badge`, `Button`, `Card`, `EmptyState`, `FormField`, `Input`, `Textarea`, `Spinner`, `ThemeToggle`, `ProtectedRoute`.

## Konwencje pisania komponentów

```ts
import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

interface FooProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variants: Record<Variant, string> = { /* … */ }
const sizes:    Record<Size,    string> = { /* … */ }

export function Foo({ variant = 'primary', size = 'md', className, children, ...props }: FooProps) {
  return (
    <div className={cn('base classes', variants[variant], sizes[size], className)} {...props}>
      {children}
    </div>
  )
}
```

Zasady:

- **Klasy łącz przez `cn(...)`** — `tailwind-merge` rozwiązuje konflikty (`className` z propsa zawsze wygrywa).
- **Warianty jako `Record<Variant, string>`** — nie używaj zewnętrznych libów typu CVA.
- **Dark mode obowiązkowy** — każdy kolor ma wariant `dark:`.
- **`className` z propsa idzie na końcu** w `cn(...)` — żeby konsument mógł nadpisać.
- **Spread `...props`** żeby przepuszczać `aria-*`, `data-*`, `onClick` itp.
- **`children: ReactNode`** jeśli wymagany, opcjonalny z `?` jeśli nie.
- **Brak hardcoded paddingu/marginesu z zewnątrz** — jeśli komponent ma "wewnętrzny" odstęp, definiuj go propsem (np. `padding`); marginesy zewnętrzne to robota layoutu konsumenta.

## Stories

Każdy komponent dostaje `*.stories.tsx`:

- `title: 'shared/components/<Name>'`
- `tags: ['autodocs']`
- Stories po polsku, args w `args`, warianty jako kolejne `export const X: Story = { args: ... }`.
- Story używające routera → opakuj w `MemoryRouter`.

## Czego NIE wprowadzać

- Nowych zależności (np. `class-variance-authority`, `radix-ui`) bez ustalenia z użytkownikiem.
- Komponentów "polimorficznych" z generycznym `as` poza listą pre-defined union (TS dla pełnej polimorfii staje się ciężki — patrz `Text`/`Stack`).
- Inline `style={{...}}` — zawsze Tailwind przez `className`.
- "Smart" komponentów (z fetchem, store'em) — design system jest stateless. Wyjątki: `ThemeToggle`, `ProtectedRoute` (świadomie tu trzymane).

## Import path

Pojedynczy komponent:

```ts
import { Text } from '../../../shared/components/Text'
```

Lub przez barrel (gdy ich więcej):

```ts
import { Stack, Text, Title } from '../../../shared/components'
```
