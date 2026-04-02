# Skill: Wire Prototype State — match-skills
> Use this as a reusable task template when connecting state across routes in the Phase 0 prototype.

---

## Trigger

Use this skill when:
- A CTA on one screen should carry state to the next screen
- A route param or search param is not resolving correctly
- Hardcoded IDs or slugs are causing broken demo flows
- State is being lost between navigation steps

---

## Inputs Required

| Input | Example |
|---|---|
| Flow being connected | Organizer: request form → matches → booking confirm |
| State that must survive | `requestId`, `musicianSlug`, `musicianId` |
| Current breakage | "Confirm screen shows wrong musician because ID is hardcoded" |

---

## State Mechanism Decision Tree

Work through these options in order — use the lightest one that works:

### 1. Route params (preferred for entity identity)
Use when the state identifies a specific resource and belongs in the URL.
```
/matches/[requestId]           → requestId comes from the request just submitted
/musicians/[slug]              → slug comes from the musician card link
/booking/confirm/[requestId]/[musicianId]  → both from prior navigation
/offer/[token]                 → token from offer email link (mock)
/admin/requests/[id]           → id from admin request table row
```

### 2. Search params (preferred for ephemeral filters and form state)
Use when state is transient, optional, or filter-like.
```
/request/review?eventType=corporate&date=2025-04-18&...
/matches/[requestId]?genre=jazz&availability=today
```
- Access via `searchParams` prop in server components (await in Next.js 16)
- Access via `useSearchParams()` in client components

### 3. Centralized typed mock data (preferred for resolved entities)
Never fetch data inline — always look it up from the canonical mock arrays:
```ts
import { MOCK_MUSICIANS, MOCK_REQUESTS, MOCK_OFFERS } from "@/lib/mock";

const musician = MOCK_MUSICIANS.find((m) => m.slug === slug);
const request  = MOCK_REQUESTS.find((r) => r.id === requestId);
const offer    = MOCK_OFFERS.find((o) => o.token === token);
```

### 4. React Context (only for session-scoped state)
Use only for:
- Current mock user role (already in `/context/mock-session.tsx`)
- State that is truly global and role-dependent

Do not use context to pass IDs or entity data between route navigations.

---

## Step-by-Step Procedure

### Step 1 — Map the flow
List every screen in the flow and what state each one needs:

| Screen | Route | State needed | Source |
|---|---|---|---|
| Request form | `/request/new` | (none coming in) | user input |
| Review | `/request/review` | event details | search params from form |
| Matches | `/matches/[requestId]` | requestId | route param |
| Musician profile | `/musicians/[slug]` | slug | route param |
| Confirm | `/booking/confirm/[requestId]/[musicianId]` | requestId + musicianId | route params |

### Step 2 — Identify hardcoded IDs
Search for:
```
grep -r "req-001\|m-001\|tanaka-makoto\|tkn-abc123" app/
```
Every hardcoded ID is a potential demo breakage point. Replace with:
- A route param that is passed in from the previous screen
- A lookup against `MOCK_*` data using that param

### Step 3 — Add graceful fallbacks
For every dynamic route, add a missing-state handler:
```ts
const musician = MOCK_MUSICIANS.find((m) => m.slug === params.slug);
if (!musician) notFound(); // renders /not-found.tsx
```

### Step 4 — Fix navigation links
After confirming what state flows where, update all `<Link href>` and `router.push()` calls:
```tsx
// Bad — hardcoded
<Link href="/matches/req-001">候補を見る</Link>

// Good — derived from data
<Link href={`/matches/${request.id}`}>候補を見る</Link>
```

### Step 5 — Verify the full demo flow
Walk through each role's flow manually:

**Organizer**
`/` → `/request/new` → `/request/review` → `/matches/[requestId]` → `/musicians/[slug]` → `/booking/confirm/[requestId]/[musicianId]`

**Musician**
`/musician/onboarding` → `/musician/availability` → `/offer/[token]`

**Admin**
`/admin/requests` → `/admin/requests/[id]`

---

## Output Checklist

- [ ] No hardcoded IDs outside `/lib/mock/`
- [ ] Every route param resolves against real mock data
- [ ] Every navigation link is dynamic (not hardcoded)
- [ ] Missing state renders gracefully (not a blank/broken screen)
- [ ] `notFound()` used for unresolvable params
- [ ] Search params used for filters and ephemeral state only
- [ ] Context used only for session role
- [ ] All changes survive a full demo walkthrough for each role
- [ ] File list summary provided

---

## Constraints

- No backend, no API calls
- No real auth
- Do not over-engineer — the simplest mechanism that makes the demo flow wins
- All state must be easily replaceable with Supabase queries in Phase 1
