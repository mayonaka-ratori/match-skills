# Phase 0 Product Brief — match-skills
## Tokyo Last-Minute Musician Booking Marketplace

### One-Liner
A curated, availability-first platform where Tokyo-based event organizers can quickly find and book a musician for a corporate event, restaurant, hotel lounge, or private party.

---

## Market & Scope

| Item | Value |
|---|---|
| Phase 0 geography | **Tokyo only** |
| Out of scope (Phase 0) | Yokohama, Kawasaki, Omiya, Urawa |
| Target launch | Clickable prototype — no real backend |

---

## User Types

| Role | Description |
|---|---|
| **Organizer** | Event planner, restaurant manager, hotel F&B coordinator, or private host who needs a musician quickly |
| **Musician** | Curated solo/duo/small-ensemble performer with confirmed Tokyo availability |
| **Admin** | Internal staff who curates musician roster and manages bookings (admin-only screens) |

---

## Core Use Case (Happy Path)

1. Organizer opens app → sees available musicians for a date/time in Tokyo
2. Filters by genre, instrumentation, venue type, price range
3. Views a musician profile (bio, sample video/audio, past bookings, price)
4. Sends a booking request (mock in Phase 0)
5. Receives a mock confirmation screen

---

## Differentiators

- **Availability-first**: surface who is free *now* or *this week* — not just who exists
- **Fast response**: curated roster, not an open listing site with hundreds of unvetted profiles
- **Curated quality**: admin-approved musicians only

---

## Phase 0 Deliverables — COMPLETE ✓

All 11 routes implemented and navigable:

| Route | Screen | Role |
|---|---|---|
| `/` | Landing page | organizer |
| `/request/new` | Multi-step request form | organizer |
| `/request/review` | Request confirmation | organizer |
| `/matches/[requestId]` | Candidate list with filters | organizer |
| `/musicians/[slug]` | Musician detail + sticky booking CTA | organizer |
| `/booking/confirm/[requestId]/[musicianId]` | Booking confirmation | organizer |
| `/musician/onboarding` | Musician registration form | musician |
| `/musician/availability` | 7×3 availability grid editor | musician |
| `/offer/[token]` | Offer YES/HOLD/NO response | musician |
| `/admin/requests` | Admin request list + status overview | admin |
| `/admin/requests/[id]` | Admin request detail + shortlist panel | admin |

---

## What is Explicitly OUT OF SCOPE for Phase 0

- Real authentication (no Supabase Auth, no OAuth)
- Real payments (no Stripe)
- Real-time chat
- Calendar sync (Google Calendar, iCal)
- Native mobile app packaging (no Expo, no Capacitor)
- Notifications (email, SMS, push)
- Reviews / ratings
- Multi-city support
- File upload for photos/media (mock: Unsplash URLs only)
- Negotiation / counter-offer (offer flow is YES/HOLD/NO only)

---

## Tech Stack (Phase 0)

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.2 with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 (CSS-first config, no tailwind.config.ts) |
| Components | shadcn/ui (base-nova / @base-ui/react) |
| Data | Local mock data (`/lib/mock/`) — no DB, no `src/` prefix |
| Auth | `MockSessionContext` — role switcher floating pill, no sign-in page |
| State | React Context only |
| Icons | lucide-react |
| Fonts | Inter (Latin) + Noto Sans JP (Japanese) |

---

## UI Language

- All **user-facing copy must be in Japanese** (東京限定, 演奏家を探す, etc.)
- Engineering docs, code comments, variable names, and this file: **English**
- No machine-translated placeholder text — use real, natural Japanese copy

---

## Phase 1 Upgrade Path (future, not now)

- Swap mock data → Supabase tables (schema mirrors mock types exactly)
- Swap mock auth → Supabase Auth (roles: organizer, musician, admin)
- Swap mock booking → Supabase row + Stripe payment intent
- `/lib/types.ts` is the single source of truth for DB schema

---

## Open Questions — Resolved by Phase 0 Implementation

1. **Booking model** → **request-first**: organizer submits request → admin shortlists → offer sent to musician → musician responds YES/HOLD/NO. No instant confirm.
2. **Pricing model** → **hourly** (`pricePerHour` JPY) with optional `priceNote`. Estimated total shown at booking confirmation. No flat fee in Phase 0.
3. **Musician onboarding** → **self-service form** at `/musician/onboarding` (mock submit). Admin reviews before listing (implied by `isCurated` flag; no admin approval UI yet).
4. **Admin tools** → **internal only** in Phase 0: request list + request detail + shortlist panel. No public-facing admin dashboard.

## Remaining Open Questions (for Phase 1)

1. Payment timing: deposit upfront vs. post-event invoice?
2. Admin musician approval workflow: email notification or dashboard action?
3. Multi-musician booking: can one request be filled by an ensemble vs. solo?
4. Organizer repeat bookings: should past bookings be surfaced to speed re-booking?
