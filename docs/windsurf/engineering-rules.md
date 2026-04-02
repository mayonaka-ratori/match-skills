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

- **Next.js 16 with App Router** — use `app/` directory routing, not `pages/`.
- **`params` and `searchParams` are Promises** in Next.js 16 — always `const { id } = await params;` in async page/layout components.
- **TypeScript strict mode** — `"strict": true` in `tsconfig.json`. No `any` types. No `// @ts-ignore` without a comment explaining why.
- All new files must have proper type annotations on every function signature.

---

## 2. Styling

- **Tailwind CSS 4** only — no inline styles, no CSS Modules, no styled-components.
- CSS-first config: `@import "tailwindcss"` in `/app/globals.css`. No `tailwind.config.ts` needed.
- Use **shadcn/ui** components as the base for all UI elements (Button, Card, Dialog, Input, Select, Badge, etc.).
- shadcn Button uses `@base-ui/react/button` — it has **no `asChild` prop**. Use `LinkButton` from `@/components/ui/link-button` for link-styled buttons.
- Do not install additional component libraries without asking.
- Mobile-first: every screen must work at 375px width minimum.
- Dark mode is not required in Phase 0; skip dark: variants unless already present.

---

## 3. Data & State

- **Mock data only** — all data lives in `/lib/mock/`. No API calls to external services in Phase 0.
- Each mock data file exports a typed array matching the interfaces in `/lib/types.ts`.
- Import mock data via `@/lib/mock` (barrel export in `/lib/mock/index.ts`).
- Do not add a database, ORM, or Supabase client in Phase 0.
- Do not add Stripe or any payment SDK in Phase 0.
- Global state: use React Context only. No Zustand, no Redux, no MobX.

---

## 4. Auth

- No real authentication in Phase 0.
- Use a **`MockSessionContext`** that provides a hardcoded user object switchable by role (organizer | musician | admin).
- The context lives at `/context/mock-session.tsx`.
- Role switching is exposed via the `RoleSwitcher` floating pill (`/components/layout/RoleSwitcher.tsx`). There is no `/sign-in` route.

---

## 5. File & Folder Structure

No `src/` prefix — all directories are at the project root:

```
app/                    # Next.js App Router pages & layouts
  globals.css           # Tailwind 4 CSS-first entry point
components/
  ui/                   # shadcn/ui primitives (auto-generated, do not edit)
  layout/               # TopNav, Footer, RoleSwitcher
  common/               # PageHeader, EmptyState
  musicians/            # MusicianCard, AvailabilityBadge
  request/              # RequestFormWizard, CandidateList
  musician/             # MusicianOnboardingForm, AvailabilityEditor
  offer/                # OfferResponseCard
  admin/                # AdminShortlistPanel
context/
  mock-session.tsx      # MockSessionProvider + useMockSession
lib/
  types.ts              # All shared TS interfaces & enums (single file)
  format.ts             # Pure label/format helpers
  utils.ts              # cn() helper
  mock/                 # .ts files exporting typed mock arrays + index.ts barrel
```

---

## 6. Naming Conventions

| Thing | Convention |
|---|---|
| React components | PascalCase (`MusicianCard.tsx`) |
| Utility functions | camelCase (`formatPrice`) |
| Types / interfaces | PascalCase, no `I` prefix (`Musician`, `BookingRequest`) |
| Type union strings | snake_case (`"available_today"`, `"hotel_lounge"`) |
| Mock data exports | SCREAMING_SNAKE_CASE (`MOCK_MUSICIANS`) |
| Mock data files | kebab-case (`musicians.ts`, `booking-requests.ts`) |
| Route folders | kebab-case (`/app/booking-request/`) |

---

## 7. Japanese UI Copy

- All user-facing text **must be in Japanese**.
- Variable names, comments, and type names stay in English.
- Do not use `i18n` / `next-intl` in Phase 0 — hardcode Japanese strings directly.
- Refer to the glossary in `/docs/windsurf/project-memory.md` for consistent term mapping.

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
- Do not use `<Button asChild>` — shadcn Button has no `asChild` prop. Use `LinkButton` from `@/components/ui/link-button`.
- Do not access `params` or `searchParams` synchronously — they are Promises in Next.js 16.
- Do not create a `/src/` directory — there is no `src/` prefix in this project.
- Do not split types into multiple files — all types live in `/lib/types.ts`.
