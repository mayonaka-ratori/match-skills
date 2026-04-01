# Project Memory — match-skills
> Paste this as a **Windsurf Memory** or include it at the top of any agent session to give instant project context.

---

## What This Project Is

**match-skills** is a Tokyo-only, last-minute musician booking marketplace. Organizers (event planners, venue managers, private hosts) find and book curated musicians quickly. Phase 0 is a clickable prototype with no real backend.

---

## Current Phase

**Phase 0 — Clickable Prototype**
- No real auth, no real payments, no real DB
- All data from local TypeScript mock files
- Goal: a showable, navigable demo of the full organizer booking flow

---

## Tech Stack

| Layer | Decision |
|---|---|
| Framework | Next.js 14+ App Router |
| Language | TypeScript strict |
| Styles | Tailwind CSS |
| Components | shadcn/ui + lucide-react |
| Data | `/src/lib/mock-data/*.ts` |
| Auth | `MockSessionContext` (hardcoded roles) |
| State | React Context or Zustand |
| Fonts | Inter + Noto Sans JP |

---

## User Roles

- **organizer** — finds and books musicians
- **musician** — views their upcoming bookings
- **admin** — curates musician roster

---

## Key Domain Types (single source of truth in `/src/types/`)

```ts
Musician          // id, name, genres, instruments, location, pricePerHour, availability, bio, mediaUrl
BookingRequest    // id, organizerId, musicianId, eventType, eventDate, venue, durationHours, status
Organizer         // id, name, email, companyName
Venue             // id, name, address, type (restaurant | hotel | corporate | private)
MusicianGenre     // enum: Jazz | Classical | Pop | Bossa Nova | Acoustic | Latin | ...
EventType         // enum: Corporate | Restaurant | HotelLounge | PrivateParty | Wedding | ...
BookingStatus     // enum: Pending | Confirmed | Cancelled
```

---

## Screen Inventory (Phase 0)

| Route | Screen | Role |
|---|---|---|
| `/` | Home / Discovery | organizer |
| `/musicians/[id]` | Musician Profile | organizer |
| `/booking/new` | Booking Request Form | organizer |
| `/booking/confirmation` | Mock Confirmation | organizer |
| `/dashboard` | Musician Dashboard | musician |
| `/admin/roster` | Admin Roster | admin |
| `/sign-in` | Mock Sign-in | all |

---

## Architectural Decisions

- **Mock data mirrors future DB schema** — every field in mock types becomes a Supabase column in Phase 1. Do not add fields that cannot be persisted.
- **No `pages/` directory** — App Router only.
- **Japanese UI copy hardcoded** — no i18n library in Phase 0.
- **shadcn/ui primitives** live in `src/components/ui/` and are never hand-edited.
- **Feature components** live in `src/components/[feature]/`.

---

## Geography Constraint

Tokyo only. Specifically **out of scope**: Yokohama, Kawasaki, Omiya, Urawa. Do not add neighborhood/city data for those areas.

---

## What Has Been Done

- [ ] Repository initialized (empty as of Phase 0 setup)
- [ ] `/docs/windsurf/` documentation created
- [ ] Next.js project scaffolded
- [ ] Mock data types defined
- [ ] Mock data populated
- [ ] Home / Discovery screen
- [ ] Musician Profile screen
- [ ] Booking Request Form
- [ ] Booking Confirmation screen
- [ ] Musician Dashboard
- [ ] Admin Roster screen

---

## Glossary (Japanese UI Terms)

| English | Japanese |
|---|---|
| Musician | 演奏家 |
| Organizer | 主催者 |
| Booking | 予約 |
| Availability | 空き状況 |
| Book Now | 今すぐ予約 |
| Request Booking | 予約を申し込む |
| Confirmed | 確定済み |
| Pending | 確認中 |
| Cancelled | キャンセル済み |
| Genre | ジャンル |
| Price per hour | 1時間あたりの料金 |
| Tokyo | 東京 |
| Event Type | イベント種別 |
| Corporate Event | 企業イベント |
| Restaurant | レストラン |
| Hotel Lounge | ホテルラウンジ |
| Private Party | プライベートパーティー |
| Wedding | 結婚式 |
| Find a Musician | 演奏家を探す |
| Profile | プロフィール |
| Admin | 管理者 |
| Roster | 演奏家一覧 |

---

## Phase 1 Upgrade Checklist (future)

- Replace `MockSessionContext` with Supabase Auth
- Replace mock data arrays with Supabase queries (schema mirrors types exactly)
- Add Stripe payment intent on booking confirmation
- Add row-level security policies per role
- Expand to Yokohama, Kawasaki as second geography
