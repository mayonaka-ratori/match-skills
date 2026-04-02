# Skill: Build a New Screen — match-skills
> Use this as a reusable task template whenever you need to build a new page or screen.

---

## Trigger

Use this skill when asked to build a new screen, page, or route in the match-skills prototype.

---

## Inputs Required Before Starting

Confirm these before writing any code:

| Input | Example |
|---|---|
| Screen name | Musician Profile |
| Route | `/musicians/[id]` |
| User role | organizer |
| Primary purpose | View musician details and initiate a booking |
| Data needed | `Musician` type from `/lib/types.ts` |
| Key components | `MusicianCard`, `AvailabilityBadge`, `BookingButton` |

---

## Step-by-Step Procedure

### Step 1 — Define or confirm types
- Check `/lib/types.ts` for existing interfaces (all types live in this single file)
- If new fields are needed, add them to the existing type — do not create new type files
- All fields must be compatible with a future Supabase column

### Step 2 — Seed mock data
- Check `/lib/mock/` for existing data (exported via `/lib/mock/index.ts`)
- If the screen needs data not yet present, add 3–5 realistic mock entries
- Use the format: `id: "x-001"` where `x` is a short prefix for the entity
- All mock entries must use Japanese names, locations, and text where user-facing
- See `skill-seed-demo-scenarios.md` for canonical demo scenarios to align with

### Step 3 — Create the route
- **Phase 0 is complete: do not add new routes.** All 11 routes are implemented.
- If modifying an existing route: edit `app/[route]/page.tsx`
- `params` and `searchParams` are **Promises** in Next.js 16 — always `await params`
- Use `async` page components for data-fetching patterns (even with mock data, simulate the pattern)

### Step 4 — Build components
- Place feature-specific components in `components/[feature]/`
- Each component file = one exported component
- Props interface defined at the top of the file
- Accept `className?: string` on the root element
- Use `LinkButton` from `@/components/ui/link-button` for link-styled buttons (Button has no `asChild`)

### Step 5 — Wire up navigation
- Add links from/to this screen in the relevant parent screens
- Use `<Link href="...">` from `next/link`

### Step 6 — Empty & loading states
- Add an empty state with Japanese copy if the screen can have no data
- Add a skeleton/loading state if the screen loads data (even mock)

### Step 7 — Mobile check
- Visually verify the layout at 375px width
- Check that text doesn't overflow, buttons are tappable (min 44px height), and cards stack correctly

---

## Output Checklist

After completing the screen, confirm all of the following:

- [ ] Route exists in `app/` 
- [ ] All props are typed (no `any`)
- [ ] Mock data exists in `/lib/mock/` and matches `/lib/types.ts`
- [ ] All user-facing text is in Japanese (check glossary in `project-memory.md`)
- [ ] Empty state is handled with Japanese copy
- [ ] Navigation to/from this screen uses dynamic links (no hardcoded IDs)
- [ ] Works at 375px mobile width
- [ ] No `console.log` left in committed code
- [ ] Run `skill-flow-consistency-audit.md` if navigation was changed
- [ ] File list summary provided at end

---

## File List Summary Format

At the end of every build task, output:

```
Files created:
  app/musicians/[slug]/page.tsx
  components/musicians/MusicianProfile.tsx

Files modified:
  lib/mock/musicians.ts
  lib/types.ts
```
