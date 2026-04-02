<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:match-skills-rules -->
# match-skills — Critical Project Rules

## Stack (non-negotiable)
- **Next.js 16.2.2** + React 19 + **Tailwind CSS 4** (CSS-first, `@import "tailwindcss"` in `app/globals.css`, no `tailwind.config.ts`)
- **shadcn/ui base-nova** (`@base-ui/react`) — Button has **no `asChild` prop**. Use `LinkButton` from `@/components/ui/link-button` for link-styled buttons.
- **`params` and `searchParams` are Promises** in Next.js 16 — always `const { id } = await params;`

## File Layout (no `src/` prefix)
```
app/              ← pages & layouts (globals.css here)
components/       ← ui/, layout/, common/, musicians/, request/, musician/, offer/, admin/
context/          ← mock-session.tsx
lib/
  types.ts        ← ALL types — single file, do not split
  format.ts       ← label/format helpers
  utils.ts        ← cn() only
  mock/           ← mock data + index.ts barrel
```

## Phase 0 Status
- **All 11 routes are implemented.** Do not add new routes.
- **Booking model is request-first** (organizer request → admin shortlist → offer → musician YES/HOLD/NO)
- **No `/sign-in` route** — role switching via `RoleSwitcher` floating pill
- **All data is mock-only** — no Supabase, no Stripe, no real auth
- **`TODO Phase 1:` comments** in source mark all integration points
- See `/docs/windsurf/phase0-locked-spec.md` for locked decisions
- See `/docs/windsurf/known-phase0-shortcuts.md` for intentional shortcuts
<!-- END:match-skills-rules -->
