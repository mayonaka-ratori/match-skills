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
| Framework | Next.js 16.2.2 App Router |
| Language | TypeScript strict |
| Styles | Tailwind CSS 4 (CSS-first, no tailwind.config.js) |
| Components | shadcn/ui (base-nova / @base-ui/react) + lucide-react |
| Data | `/lib/mock/*.ts` |
| Auth | `MockSessionContext` (hardcoded roles) at `/context/mock-session.tsx` |
| State | React Context |
| Fonts | Inter + Noto Sans JP |

> **Note**: `params` and `searchParams` in App Router pages are Promises in Next.js 16 — must `await` them. shadcn Button uses `@base-ui/react/button` — no `asChild` prop. Use `LinkButton` from `@/components/ui/link-button` for link-styled buttons.

---

## User Roles

- **organizer** — finds and books musicians
- **musician** — views their upcoming bookings
- **admin** — curates musician roster

---

## Key Domain Types (single source of truth in `/lib/types.ts`)

```ts
Musician          // id, slug, name, genres, instruments, neighborhood, travelAreas, pricePerHour, availabilityStatus, tags, isCurated, ...
BookingRequest    // id, organizerId, eventType, eventDate, venueName, venueNeighborhood, durationHours, preferredGenres, budgetPerHour, status, shortlistedMusicianIds, confirmedMusicianId
Organizer         // id, name, email, companyName, phone?
Offer             // id, token, requestId, musicianId, status (pending|accepted|held|declined), fee
AvailabilitySlot  // id, musicianId, date, timeSlot (morning|afternoon|evening), isAvailable
MockUser          // id, role, name, musicianId?, organizerId?
EventType         // "corporate" | "restaurant" | "hotel_lounge" | "private_party"
Genre             // "jazz" | "classical" | "bossa_nova" | "pop" | "acoustic" | "latin" | "soul" | "flamenco" | "lounge"
RequestStatus     // "pending" | "shortlisted" | "offers_sent" | "confirmed" | "cancelled"
OfferStatus       // "pending" | "accepted" | "held" | "declined"
AvailabilityStatus // "available_today" | "available_this_week" | "available_weekend" | "contact_required"
```

---

## Screen Inventory (Phase 0) — all 11 routes implemented ✓

| Route | Screen | Role | Component type |
|---|---|---|---|
| `/` | Landing page | organizer | server |
| `/request/new` | Multi-step request form | organizer | client |
| `/request/review` | Request confirmation + link to candidates | organizer | client |
| `/matches/[requestId]` | Candidate list with filters | organizer | server + client |
| `/musicians/[slug]` | Musician detail + sticky booking CTA | organizer | server |
| `/booking/confirm/[requestId]/[musicianId]` | Booking confirmation | organizer | server |
| `/musician/onboarding` | Musician registration form | musician | client |
| `/musician/availability` | 7×3 availability grid editor | musician | client |
| `/offer/[token]` | Offer YES/HOLD/NO response | musician | server + client |
| `/admin/requests` | Admin request list + status overview | admin | server |
| `/admin/requests/[id]` | Admin request detail + shortlist panel | admin | server + client |

**No `/sign-in` route** — role switching is via `RoleSwitcher` floating pill (主催者 / 演奏家 / 管理者).

---

## Architectural Decisions

- **Mock data mirrors future DB schema** — every field in mock types becomes a Supabase column in Phase 1. Do not add fields that cannot be persisted.
- **No `pages/` directory** — App Router only.
- **Japanese UI copy hardcoded** — no i18n library in Phase 0.
- **No `src/` prefix** — all source dirs are at root: `/app`, `/lib`, `/components`, `/context`.
- **shadcn/ui primitives** live in `/components/ui/` and are never hand-edited.
- **`LinkButton`** (`/components/ui/link-button.tsx`) must be used instead of `<Button asChild>` — shadcn Button uses `@base-ui/react/button` which has no `asChild` prop.
- **Feature components** live in `/components/[feature]/`.
- **Next.js 16**: `params` and `searchParams` in page/layout components are **Promises** — always `await params`.
- **`TODO Phase 1:` comments** mark all integration points in source files.
- **Booking model is request-first**: organizer submits a request → admin shortlists → offer sent to musician → musician responds YES/HOLD/NO.

---

## Geography Constraint

Tokyo only. Specifically **out of scope**: Yokohama, Kawasaki, Omiya, Urawa. Do not add neighborhood/city data for those areas.

---

## What Has Been Done — Phase 0 COMPLETE ✓

- [x] Repository initialized
- [x] `/docs/windsurf/` documentation created
- [x] Next.js 16.2.2 project scaffolded
- [x] Mock data types defined (`/lib/types.ts`)
- [x] Mock data populated (`/lib/mock/`: musicians ×10, requests ×6, organizers ×3, offers ×6, availability slots)
- [x] All 11 routes implemented and navigable
- [x] `MockSessionProvider` + `RoleSwitcher` floating pill
- [x] `TopNav`, `Footer`, `PageHeader`, `EmptyState` layout components
- [x] `MusicianCard` (photo-first, availability badge overlay, price, genres, trust signals)
- [x] `CandidateList` with client-side genre + availability filters
- [x] `RequestFormWizard` multi-step form
- [x] `AdminShortlistPanel` with genre/availability filter + mock send action
- [x] `AvailabilityEditor` (7-column × 3-row grid)
- [x] `MusicianOnboardingForm` with multi-select chips
- [x] `OfferResponseCard` with YES/HOLD/NO inline state update
- [x] Format utils (`/lib/format.ts`): price, date, time, duration, all label functions

---

## Glossary (Japanese UI Terms)

| English | Japanese |
|---|---|
| Musician | 演奏家 |
| Organizer | 主催者 |
| Admin | 管理者 |
| Booking | 予約 |
| Booking Request | 予約リクエスト |
| Availability | 空き状況 |
| Book Now / Request Booking | 予約を申し込む |
| Confirmed | 確定済み |
| Pending | 対応待ち |
| Shortlisted | 候補選定中 |
| Offers Sent | オファー送付済み |
| Cancelled | キャンセル |
| Offer (to musician) | オファー |
| Accept | 承諾する |
| Hold | 保留にする |
| Decline | お断りする |
| Genre | ジャンル |
| Instrument | 楽器 |
| Ensemble Type | 編成 |
| Price per hour | ¥XX,000 / 時間 |
| Tokyo | 東京 |
| Event Type | イベント種別 |
| Corporate Event | 企業イベント |
| Restaurant | レストラン |
| Hotel Lounge | ホテルラウンジ |
| Private Party | プライベートパーティー |
| Find a Musician | 演奏家を探す |
| Profile | プロフィール |
| Curated badge | 公認演奏家 |
| Candidate list | 候補の演奏家 |
| Shortlist panel | 候補リスト |
| Available today | 急ぎ対応可 |
| Available this week | 今週対応可 |
| Available weekend | 今週末対応可 |
| Contact required | 要日程相談 |

---

## Phase 1 Upgrade Checklist (future)

- Replace `MockSessionContext` with Supabase Auth (roles: organizer, musician, admin)
- Replace mock data arrays with Supabase queries (schema mirrors `/lib/types.ts` exactly)
- Add Stripe payment intent on booking confirmation (step 3 of next-steps copy already shows placeholder)
- Add file upload for musician photos and media (mock: Unsplash URLs only in Phase 0)
- Add email notifications via Resend (offer sent, booking confirmed, etc.)
- Add row-level security policies per role
- All `TODO Phase 1:` comments in source mark exact integration points
- Expand to Yokohama, Kawasaki as second geography (Phase 2+)
