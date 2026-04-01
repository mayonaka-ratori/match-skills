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
| Data needed | `Musician` type from `/src/types/musician.ts` |
| Key components | `MusicianCard`, `AvailabilityBadge`, `BookingButton` |

---

## Step-by-Step Procedure

### Step 1 — Define or confirm types
- Check `/src/types/` for existing interfaces
- If new fields are needed, add them to the existing type (do not create a new file unless the domain is truly new)
- All fields must be compatible with a future Supabase column

### Step 2 — Seed mock data
- Check `/src/lib/mock-data/` for existing data
- If the screen needs data not yet present, add 3–5 realistic mock entries
- Use the format: `id: "x-001"` where `x` is a short prefix for the entity
- All mock entries must use Japanese names, locations, and text where user-facing

### Step 3 — Create the route
- Create `src/app/[route]/page.tsx`
- Add a layout wrapper if needed (`layout.tsx` in the same folder)
- Use `async` page components for data-fetching patterns (even with mock data, simulate the pattern)

### Step 4 — Build components
- Place feature-specific components in `src/components/[feature]/`
- Each component file = one exported component
- Props interface defined at the top of the file
- Accept `className?: string` on the root element

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

- [ ] Route exists in `src/app/`
- [ ] All props are typed (no `any`)
- [ ] Mock data exists and matches types
- [ ] All user-facing text is in Japanese
- [ ] Empty state is handled
- [ ] Navigation to/from this screen works
- [ ] Works at 375px mobile width
- [ ] No `console.log` left in committed code
- [ ] File list summary provided at end

---

## File List Summary Format

At the end of every build task, output:

```
Files created:
  src/app/musicians/[id]/page.tsx
  src/components/musicians/MusicianProfile.tsx
  src/components/musicians/AvailabilityBadge.tsx

Files modified:
  src/lib/mock-data/musicians.ts
  src/types/musician.ts
```
