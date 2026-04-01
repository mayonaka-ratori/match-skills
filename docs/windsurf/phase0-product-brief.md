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

## Phase 0 Deliverables (Clickable Prototype)

| Screen | Notes |
|---|---|
| Home / Discovery | Availability filter + musician card grid |
| Musician Profile | Bio, media, price, availability badge |
| Booking Request Form | Organizer fills in event details (mock submit) |
| Booking Confirmation | Mock success screen |
| Musician Dashboard | Musician sees mock upcoming bookings |
| Admin Roster | Admin views/curates musician list |
| Sign-in page | Static mock — no real auth |

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
- Musician self-onboarding flow

---

## Tech Stack (Phase 0)

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Data | Local mock data (`/src/lib/mock-data/`) — no DB |
| Auth | Hardcoded mock session context — no real auth |
| State | React Context or Zustand (lightweight) |
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
- Mock data types in `/src/types/` become the single source of truth for DB schema

---

## Open Questions (to resolve before Phase 1)

1. Booking model: instant confirm vs. musician-accepts flow?
2. Pricing model: flat fee, hourly, or both?
3. Musician onboarding: invite-only or application form?
4. Admin tools: internal only or a proper dashboard product?
