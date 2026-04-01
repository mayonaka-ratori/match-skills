# Engineering Rules — match-skills
> Paste this content into Windsurf **Workspace Rules** so every agent session respects it automatically.

---

## 0. Mindset

- **Plan first, code second.** Before writing any code, state the plan as a numbered list and wait for confirmation if the change is non-trivial.
- **Keep tasks small and explicit.** One screen, one component, or one data type per task.
- **Show changed files** at the end of every task as a brief summary list.
- **Never delete or rename** existing files without explicit instruction.
- **Do not implement features** that are marked Out of Scope for Phase 0.

---

## 1. Language & Framework

- **Next.js 14+ with App Router** — use `app/` directory routing, not `pages/`.
- **TypeScript strict mode** — `"strict": true` in `tsconfig.json`. No `any` types. No `// @ts-ignore` without a comment explaining why.
- All new files must have proper type annotations on every function signature.

---

## 2. Styling

- **Tailwind CSS** only — no inline styles, no CSS Modules, no styled-components.
- Use **shadcn/ui** components as the base for all UI elements (Button, Card, Dialog, Input, Select, Badge, etc.).
- Do not install additional component libraries without asking.
- Mobile-first: every screen must work at 375px width minimum.
- Dark mode is not required in Phase 0; skip dark: variants unless already present.

---

## 3. Data & State

- **Mock data only** — all data lives in `/src/lib/mock-data/`. No API calls to external services in Phase 0.
- Each mock data file exports a typed array that matches the interfaces in `/src/types/`.
- Do not add a database, ORM, or Supabase client in Phase 0.
- Do not add Stripe or any payment SDK in Phase 0.
- Global state: use React Context or Zustand only. No Redux, no MobX.

---

## 4. Auth

- No real authentication in Phase 0.
- Use a **`MockSessionContext`** that provides a hardcoded user object switchable by role (organizer | musician | admin).
- The context lives at `/src/context/mock-session.tsx`.

---

## 5. File & Folder Structure

```
src/
  app/                  # Next.js App Router pages
  components/           # Shared UI components
    ui/                 # shadcn/ui primitives (auto-generated, do not edit)
    [feature]/          # Feature-specific components
  context/              # React contexts (MockSessionContext, etc.)
  lib/
    mock-data/          # .ts files exporting typed mock arrays
    utils/              # Pure helper functions
  types/                # Shared TypeScript interfaces & enums
  styles/               # global.css only
```

---

## 6. Naming Conventions

| Thing | Convention |
|---|---|
| React components | PascalCase (`MusicianCard.tsx`) |
| Utility functions | camelCase (`formatPrice.ts`) |
| Types / interfaces | PascalCase, no `I` prefix (`Musician`, `BookingRequest`) |
| Enums | PascalCase (`MusicianGenre`) |
| Mock data files | kebab-case (`musicians.ts`, `booking-requests.ts`) |
| Route folders | kebab-case (`/app/booking-request/`) |

---

## 7. Japanese UI Copy

- All user-facing text **must be in Japanese**.
- Variable names, comments, and type names stay in English.
- Do not use `i18n` / `next-intl` in Phase 0 — hardcode Japanese strings directly.
- Keep a running glossary in `/docs/windsurf/ui-copy-glossary.md` (create if needed) so terms are consistent across screens.

---

## 8. Component Rules

- Every component must accept a `className?` prop for layout override.
- Avoid prop drilling deeper than 2 levels — use context or lift state.
- No business logic inside UI components — extract to hooks or utils.
- Prefer composition over large monolithic components.

---

## 9. Commits & PRs (when applicable)

- Commit messages: `[scope] short description` (e.g., `[musician-card] add availability badge`)
- One logical change per commit.
- No commented-out code in committed files.

---

## 10. What NOT to Do

- Do not add `pages/` directory routes.
- Do not call `fetch()` against real external URLs.
- Do not add environment variables for third-party services (Supabase, Stripe, etc.).
- Do not add `eslint-disable` without a comment.
- Do not generate lorem ipsum — use realistic Japanese placeholder content instead.
