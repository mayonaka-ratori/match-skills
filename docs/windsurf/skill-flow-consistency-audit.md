# Skill: Flow Consistency Audit — match-skills
> Use this as a reusable task template to audit the prototype for broken or inconsistent navigation flows.

---

## Trigger

Use this skill when:
- Preparing for a demo or user interview
- After a batch of new screens have been built
- Suspecting a regression in navigation or state flow
- Reviewing hardcoded IDs or brittle links

---

## Inputs Required

| Input | Example |
|---|---|
| Scope | Full prototype audit |
| Roles to check | organizer, musician, admin (or specify one) |
| Known issues | "Back link on confirm screen is broken" |

---

## Audit Checklist

### 1. Primary CTAs

Walk each role's happy path and verify every primary CTA leads to the correct next screen:

**Organizer flow**
- [ ] `/` → 「演奏家を探す」 or 「依頼を出す」 CTA → `/request/new`
- [ ] `/request/new` → submit → `/request/review` (with search params populated)
- [ ] `/request/review` → 「送信する」 → `/matches/[requestId]` (real `req-xxx` ID)
- [ ] `/matches/[requestId]` → musician card → `/musicians/[slug]` (real slug)
- [ ] `/musicians/[slug]` → 「予約を確定する」 or booking CTA → `/booking/confirm/[requestId]/[musicianId]`
- [ ] `/booking/confirm/[requestId]/[musicianId]` → success state visible

**Musician flow**
- [ ] `/musician/onboarding` → submit → sensible next screen or success state
- [ ] `/musician/availability` → save → success feedback
- [ ] `/offer/[token]` → YES / HOLD / NO → response state reflects choice

**Admin flow**
- [ ] `/admin/requests` → row click → `/admin/requests/[id]`
- [ ] `/admin/requests/[id]` → shortlist action → `AdminShortlistPanel` reflects change

---

### 2. Back Links

For each interior screen, verify a back link exists and points to a real route:

| Screen | Expected back target |
|---|---|
| `/request/review` | `/request/new` |
| `/matches/[requestId]` | `/request/review` or `/` |
| `/musicians/[slug]` | `/matches/[requestId]` (with param intact) |
| `/booking/confirm/[requestId]/[musicianId]` | `/musicians/[slug]` |
| `/musician/availability` | `/musician/onboarding` or musician home |
| `/offer/[token]` | No back needed (token-gated) |
| `/admin/requests/[id]` | `/admin/requests` |

- [ ] No back link uses raw `history.back()` — unreliable in demos
- [ ] Back links preserve context (e.g. musician profile back link includes requestId if needed)

---

### 3. Route Param Usage

For each dynamic route, verify:

| Route | Param | Must resolve against |
|---|---|---|
| `/matches/[requestId]` | `requestId` | `MOCK_REQUESTS` |
| `/musicians/[slug]` | `slug` | `MOCK_MUSICIANS` (by slug) |
| `/booking/confirm/[requestId]/[musicianId]` | both | `MOCK_REQUESTS` + `MOCK_MUSICIANS` |
| `/offer/[token]` | `token` | `MOCK_OFFERS` (by token) |
| `/admin/requests/[id]` | `id` | `MOCK_REQUESTS` (by id) |

- [ ] No route renders with `undefined` or `null` params shown to the user
- [ ] Unresolvable params call `notFound()` — not a blank or crashed screen

---

### 4. Not-Found and Empty States

- [ ] `/not-found.tsx` exists and renders a sensible Japanese message
- [ ] Every list screen has a Japanese empty state (no results)
- [ ] Matches list with no candidates shows empty state, not a blank grid
- [ ] Admin shortlist panel shows empty state when no musicians shortlisted
- [ ] Offer screen handles already-responded tokens gracefully

---

### 5. Sticky CTA Interactions

- [ ] Sticky booking CTA on `/musicians/[slug]` does not overlap content on mobile
- [ ] Sticky CTA disappears or becomes inactive if the musician is not available
- [ ] Sticky CTA links carry correct `requestId` and `musicianId`

---

### 6. Role Switcher Overlap Risks

The floating role switcher (主催者 / 演奏家 / 管理者) sits at the bottom of the screen.

- [ ] Role switcher does not obscure sticky CTAs on musician profile
- [ ] Role switcher does not obscure form submit buttons on mobile
- [ ] Role switcher does not interfere with bottom navigation on any screen
- [ ] Switching roles on an interior screen does not leave the user on a role-inappropriate route

---

### 7. Demo Continuity Across Roles

For each role, verify a clean end-to-end demo walk is possible without hitting a dead end:

**Organizer demo path**
`/` → `/request/new` → `/request/review` → `/matches/req-001` → `/musicians/tanaka-makoto` → `/booking/confirm/req-001/m-001`

**Musician demo path**
`/musician/onboarding` → `/musician/availability` → `/offer/tkn-abc123`

**Admin demo path**
`/admin/requests` → `/admin/requests/req-001`

- [ ] Each demo path completes without a 404 or blank screen
- [ ] All mock data referenced in demo paths exists in `/lib/mock/`

---

## Output Format

Return findings in this structure:

### Issues Found

| # | Screen / Route | Issue | Severity |
|---|---|---|---|
| 1 | `/booking/confirm/[requestId]/[musicianId]` | musicianId hardcoded as "m-001" | High |
| 2 | `/musicians/[slug]` | Back link missing | Medium |
| 3 | `/matches/[requestId]` | Empty state copy is in English | Low |

**Severity levels**
- **High** — breaks the demo, must fix before showing
- **Medium** — confusing or incomplete, should fix before showing
- **Low** — polish, fix when convenient

### Recommended Fixes

For each high/medium issue: one-sentence fix description + affected files.

### Smallest Safe Implementation Plan

Ordered list of changes, smallest-impact first, to restore full demo continuity.
