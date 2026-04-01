# Phase 0 Implementation Plan
> Senior founding engineer + product design perspective. Plan only — no code.

---

## 1. Route Map

| # | Screen | Route | Role |
|---|---|---|---|
| 1 | Landing page | `/` | organizer (entry point) |
| 2 | Organizer request form | `/request/new` | organizer |
| 3 | Candidate list | `/request/[id]/candidates` | organizer |
| 4 | Musician detail | `/musicians/[id]` | organizer |
| 5 | Booking confirmation | `/booking/confirmation` | organizer |
| 6 | Musician onboarding | `/onboarding` | musician |
| 7 | Musician availability | `/musician/availability` | musician |
| 8 | Offer response | `/musician/offers/[offerId]` | musician |
| 9 | Admin request list | `/admin/requests` | admin |
| 10 | Admin request detail + shortlist | `/admin/requests/[id]` | admin |
| – | Mock sign-in / role switcher | `/sign-in` | all |

### Navigation flows

**Organizer happy path:**
`/` → `/request/new` → `/request/[id]/candidates` → `/musicians/[id]` → `/booking/confirmation`

**Musician path:**
`/sign-in` (switch to musician) → `/onboarding` → `/musician/availability` → `/musician/offers/[offerId]`

**Admin path:**
`/sign-in` (switch to admin) → `/admin/requests` → `/admin/requests/[id]`

---

## 2. Page-by-Page UX Notes

### Screen 1 — Landing Page (`/`)
- **Purpose:** Convert a first-time organizer. Prove the value prop in 5 seconds.
- **Layout (mobile):**
  ```
  [TopNav: logo + CTA button]
  [Hero: 今夜の演奏家が、すぐ見つかる。]
  [Subhead + 「演奏家を探す」 large CTA]
  [How it works: 3 steps icon row]
  [Featured musicians: 3 MusicianCards]
  [Trust bar: 登録演奏家 XX名 / 累計予約 XXX件]
  [Footer]
  ```
- **Key copy:** `今夜の演奏家が、すぐ見つかる。` / `東京のプロ演奏家を、今すぐ検索`
- **CTA wires to:** `/request/new`
- **Edge cases:** Static page, no empty states needed.

### Screen 2 — Organizer Request Form (`/request/new`)
- **Purpose:** Capture event requirements in ≤5 fields. Minimise time to candidate list.
- **Fields:**
  1. イベント種別 — Select: 企業イベント / レストラン / ホテルラウンジ / プライベートパーティー
  2. 日時 — Date + time inputs (native HTML, no date library)
  3. 演奏時間 — Select: 1時間 / 2時間 / 3時間 / 4時間
  4. 会場エリア — Select of Tokyo neighborhoods (渋谷区, 新宿区, 港区, 中央区, 品川区, 世田谷区, 台東区, 目黒区)
  5. ジャンル希望 — Optional multi-select badges (not a dropdown)
- **Validation:** required fields show Japanese error messages inline
- **CTA:** `演奏家を探す` → mock-generates a requestId, routes to `/request/req-001/candidates`
- **Edge cases:** Empty genre selection is valid (show all genres).

### Screen 3 — Candidate List (`/request/[id]/candidates`)
- **Purpose:** Show matched, available musicians. Fast scan, easy comparison.
- **Layout:** Sticky filter bar (top) + `MusicianGrid` (card grid below)
- **Filter bar:** Genre chips + 「今週OK」toggle + Price range slider (simple select in Phase 0)
- **Card shows:** Photo, name, neighborhood, genre badges, availability badge, price, booking count, 「詳細を見る」button
- **Default sort:** availability (today first), then booking count
- **Empty state:** `条件に合う演奏家が見つかりませんでした。` + 「条件を変えて再検索」link
- **CTA per card:** → `/musicians/[id]`

### Screen 4 — Musician Detail (`/musicians/[id]`)
- **Purpose:** Full profile. Give the organizer enough trust to book.
- **Layout (mobile-first):**
  ```
  [Large photo header — aspect-video]
  [Name + neighborhood + curated badge]
  [Trust row: 予約実績 XX件 / 平均評価 (Phase 1)]
  [Genre + instrument tags]
  [Price: ¥XX,000 / 時間]
  [Availability badge: 今週OK / 本日OK / 要確認]
  [Bio text]
  [Media stub: play button over thumbnail]
  [Past events: simple list]
  [Sticky bottom bar: 「予約を申し込む」 full-width button]
  ```
- **CTA:** `予約を申し込む` → `/booking/confirmation?musicianId=[id]&requestId=[id]`
- **Edge cases:** No photo → grey placeholder with musical note icon. No media → hide media section.

### Screen 5 — Booking Confirmation (`/booking/confirmation`)
- **Purpose:** Reassure organizer, communicate next steps.
- **Layout:**
  ```
  [Success icon (checkmark, large)]
  [予約リクエストを送りました！]
  [Summary card: musician name, date/time, venue area, duration, estimated fee]
  [Next steps copy: 演奏家から24時間以内にご連絡します。]
  [「トップに戻る」button]
  ```
- **Edge cases:** If params are missing, show a generic confirmation (Phase 0 acceptable).

### Screen 6 — Musician Onboarding (`/onboarding`)
- **Purpose:** Musician registers their profile. Shows the product has a musician-side.
- **Fields:**
  1. お名前
  2. プロフィール写真 (mock: avatar URL input or preset avatar picker)
  3. 楽器 (multi-select chips)
  4. ジャンル (multi-select chips)
  5. 活動エリア (multi-select: Tokyo neighborhoods)
  6. 1時間あたりの料金 (number input, JPY)
  7. 自己紹介 (textarea, max 300 chars)
  8. 演奏動画URL (optional, text input)
- **CTA:** `プロフィールを登録する` → mock success toast + redirect to `/musician/availability`
- **Edge cases:** Client-side validation only in Phase 0. No real submission.

### Screen 7 — Musician Availability (`/musician/availability`)
- **Purpose:** Musician marks open time slots for the next 7 days.
- **Layout:** 7-column grid. Columns = days (今日, 明日, + 5 more). Rows = time slots (午前, 午後, 夜).
- **Cell states:** ○ 空き (green) / × 不可 (gray) — toggle on click
- **Summary line:** `今週の空き: X スロット`
- **CTA:** `空き状況を更新する` → mock save + toast
- **Edge cases:** If all slots are blocked, show a gentle reminder: `空きスロットが0です。予約が入りにくくなります。`

### Screen 8 — Offer Response (`/musician/offers/[offerId]`)
- **Purpose:** Musician sees one booking offer and responds.
- **Layout:**
  ```
  [PageHeader: 新しいオファーが届いています]
  [OfferCard: event type, date/time, venue area, duration, fee]
  [Organizer: "主催者情報はご成約後にお知らせします" — privacy placeholder]
  [3 action buttons, stacked on mobile:]
    [承諾する (green, primary)]
    [保留にする (amber, outline)]
    [お断りする (red outline)]
  ```
- **After action:** Show inline status update (no page reload needed). `承諾しました！` / `保留にしました` / `辞退しました`
- **Edge cases:** Already-responded offer → show read-only status card.

### Screen 9 — Admin Request List (`/admin/requests`)
- **Purpose:** Admin sees all incoming organizer requests and their status.
- **Layout:** Sticky filter tabs: すべて / 対応待ち / 候補送付済み / 確定済み / キャンセル
- **Row shows:** ID chip, event type, event date, venue area, status badge, `対応する` action button
- **Sort:** Newest first by default
- **Empty state:** `現在、リクエストはありません。`

### Screen 10 — Admin Request Detail + Shortlist (`/admin/requests/[id]`)
- **Purpose:** Admin reviews one request, shortlists musicians to offer to the organizer.
- **Layout (desktop two-panel; mobile tabbed):**
  - **Left / Tab 1:** Request details (event type, date, venue, duration, genre preference, organizer info)
  - **Right / Tab 2:** Filtered musician list with checkboxes. Filter by genre/availability.
  - **Action:** `候補として送る (X名)` button — disabled until ≥1 musician selected
- **After action:** Status updates to 候補送付済み, toast shown.
- **Edge cases:** No available musicians matching criteria → empty state with 「条件を広げる」 suggestion.

---

## 3. Component Tree

```
AppShell
  TopNav
    Logo
    NavLinks (conditional per role)
    RoleSwitcher          ← demo-only floating badge
  <main>{children}</main>
  Footer

─ Shared / Common ─────────────────────────────────
PageHeader               (title, subtitle, back link)
EmptyState               (icon, message, optional CTA)
LoadingSkeleton          (card-shaped pulse)
PriceDisplay             (formats ¥XX,000 / 時間)
StatusBadge              (reused across request + offer statuses)

─ musicians/ ────────────────────────────────────────
MusicianCard             (grid card)
  AvailabilityBadge
  GenreBadge
  InstrumentTag
MusicianGrid             (responsive grid wrapper)
MusicianProfile          (full detail layout)
  TrustSignals
  MusicianMediaStub
  PastBookingsList
  AvailabilityBadge

─ request/ ──────────────────────────────────────────
RequestForm
  EventTypePicker
  DurationPicker
  NeighborhoodPicker
  GenreMultiSelect
CandidateFilters         (filter bar on candidate list)

─ booking/ ──────────────────────────────────────────
BookingConfirmationCard

─ offer/ ────────────────────────────────────────────
OfferCard
OfferActionButtons

─ availability/ ─────────────────────────────────────
WeeklyCalendar
  SlotToggle             (individual morning/afternoon/evening cell)

─ admin/ ────────────────────────────────────────────
RequestTable
  RequestRow
    RequestStatusBadge
ShortlistPanel
  MusicianCheckboxRow
```

---

## 4. Mock Data Schema

### `/src/types/musician.ts`
```ts
type AvailabilityStatus = "available_today" | "available_this_week" | "contact_for_availability"

interface Musician {
  id: string                    // "m-001"
  name: string                  // "田中 誠"
  nameKana?: string             // "タナカ マコト"
  bio: string
  instruments: Instrument[]
  genres: Genre[]
  neighborhood: string          // "渋谷区"
  pricePerHour: number          // 25000 (JPY)
  availabilityStatus: AvailabilityStatus
  bookingCount: number
  photoUrl: string | null
  mediaUrl: string | null
  tags: string[]                // ["企業イベント向け", "ホテル実績多数"]
  isCurated: boolean
}
```

### `/src/types/booking-request.ts`
```ts
type RequestStatus = "pending" | "shortlisted" | "confirmed" | "cancelled"

interface BookingRequest {
  id: string                    // "req-001"
  organizerId: string
  eventType: EventType
  eventDate: string             // "2025-04-15"
  eventTime: string             // "19:00"
  venueName: string
  venueNeighborhood: string
  durationHours: number
  preferredGenres: Genre[]
  budget: number | null
  status: RequestStatus
  shortlistedMusicianIds: string[]
  confirmedMusicianId: string | null
  createdAt: string
}
```

### `/src/types/offer.ts`
```ts
type OfferStatus = "pending" | "accepted" | "held" | "declined"

interface Offer {
  id: string                    // "offer-001"
  requestId: string
  musicianId: string
  status: OfferStatus
  sentAt: string
  respondedAt: string | null
  fee: number
}
```

### `/src/types/organizer.ts`
```ts
interface Organizer {
  id: string                    // "o-001"
  name: string
  companyName: string
  email: string
  phone?: string
}
```

### `/src/types/availability.ts`
```ts
type TimeSlot = "morning" | "afternoon" | "evening"

interface AvailabilitySlot {
  id: string
  musicianId: string
  date: string                  // "2025-04-15"
  timeSlot: TimeSlot
  isAvailable: boolean
}
```

### `/src/types/index.ts` — shared enums
```ts
type EventType = "corporate" | "restaurant" | "hotel_lounge" | "private_party"
type Genre = "jazz" | "classical" | "bossa_nova" | "pop" | "acoustic" | "latin" | "soul" | "flamenco"
type Instrument = "piano" | "violin" | "guitar" | "saxophone" | "harp" | "cello" | "vocal" | "bass" | "flute"
type UserRole = "organizer" | "musician" | "admin"
```

### Mock data counts (minimum for a convincing demo)
| File | Entries |
|---|---|
| `musicians.ts` | 10 musicians — varied genre/instrument/price/availability |
| `booking-requests.ts` | 6 requests — varied statuses |
| `organizers.ts` | 3 organizers |
| `offers.ts` | 6 offers — varied statuses (pending/accepted/held/declined) |
| `availability-slots.ts` | Slots for 2–3 musicians × 7 days × 3 time slots |

---

## 5. File Tree

```
match-skills/
├── docs/windsurf/                         # ← already exists
├── public/
│   └── images/musicians/                  # placeholder avatars (or use UI Avatars API stub)
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # root layout, fonts
│   │   ├── page.tsx                       # Landing
│   │   ├── sign-in/page.tsx               # Mock role switcher
│   │   ├── request/
│   │   │   ├── new/page.tsx               # Request form
│   │   │   └── [id]/candidates/page.tsx   # Candidate list
│   │   ├── musicians/
│   │   │   └── [id]/page.tsx              # Musician detail
│   │   ├── booking/
│   │   │   └── confirmation/page.tsx      # Confirmation
│   │   ├── onboarding/page.tsx            # Musician onboarding
│   │   ├── musician/
│   │   │   ├── availability/page.tsx      # Availability grid
│   │   │   └── offers/[offerId]/page.tsx  # Offer response
│   │   └── admin/
│   │       └── requests/
│   │           ├── page.tsx               # Admin request list
│   │           └── [id]/page.tsx          # Admin detail + shortlist
│   ├── components/
│   │   ├── ui/                            # shadcn/ui (never hand-edit)
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── TopNav.tsx
│   │   │   ├── RoleSwitcher.tsx
│   │   │   └── Footer.tsx
│   │   ├── common/
│   │   │   ├── PageHeader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── musicians/
│   │   │   ├── MusicianCard.tsx
│   │   │   ├── MusicianGrid.tsx
│   │   │   ├── MusicianProfile.tsx
│   │   │   ├── AvailabilityBadge.tsx
│   │   │   ├── GenreBadge.tsx
│   │   │   ├── InstrumentTag.tsx
│   │   │   ├── TrustSignals.tsx
│   │   │   ├── MusicianMediaStub.tsx
│   │   │   └── PastBookingsList.tsx
│   │   ├── request/
│   │   │   ├── RequestForm.tsx
│   │   │   ├── EventTypePicker.tsx
│   │   │   ├── DurationPicker.tsx
│   │   │   ├── NeighborhoodPicker.tsx
│   │   │   ├── GenreMultiSelect.tsx
│   │   │   └── CandidateFilters.tsx
│   │   ├── booking/
│   │   │   └── BookingConfirmationCard.tsx
│   │   ├── offer/
│   │   │   ├── OfferCard.tsx
│   │   │   └── OfferActionButtons.tsx
│   │   ├── availability/
│   │   │   ├── WeeklyCalendar.tsx
│   │   │   └── SlotToggle.tsx
│   │   └── admin/
│   │       ├── RequestTable.tsx
│   │       ├── RequestRow.tsx
│   │       ├── RequestStatusBadge.tsx
│   │       ├── ShortlistPanel.tsx
│   │       └── MusicianCheckboxRow.tsx
│   ├── context/
│   │   └── mock-session.tsx               # MockSessionContext + useMockSession
│   ├── lib/
│   │   ├── mock-data/
│   │   │   ├── musicians.ts
│   │   │   ├── booking-requests.ts
│   │   │   ├── organizers.ts
│   │   │   ├── offers.ts
│   │   │   └── availability-slots.ts
│   │   └── utils/
│   │       ├── format-price.ts            # ¥XX,000 formatter
│   │       ├── format-date.ts             # Japanese date formatter
│   │       └── cn.ts                      # clsx + tailwind-merge
│   ├── types/
│   │   ├── index.ts                       # Enums + re-exports
│   │   ├── musician.ts
│   │   ├── booking-request.ts
│   │   ├── organizer.ts
│   │   ├── offer.ts
│   │   └── availability.ts
│   └── styles/
│       └── globals.css
├── .windsurf/
│   └── rules.md                           # Copy of engineering-rules.md
├── components.json                        # shadcn/ui config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

Total: 11 routes, ~40 components, 5 type files, 5 mock data files.

---

## 6. Phased Build Order

Each wave is one focused AI session. Complete and verify before starting next wave.

### Wave 0 — Foundation (1 session)
1. `create-next-app` with TypeScript + Tailwind + App Router
2. Install shadcn/ui, lucide-react, Noto Sans JP (next/font)
3. Create all files in `/src/types/` and `/src/lib/mock-data/`
4. `MockSessionContext` + `useMockSession` hook
5. `AppShell`, `TopNav`, `RoleSwitcher`, `Footer`
6. `globals.css`, `tailwind.config.ts` with font + color config
7. `components.json` and init shadcn/ui primitives (Button, Card, Badge, Input, Select, Dialog)

**Exit criteria:** `npm run dev` works, role switcher renders, fonts load, no TS errors.

### Wave 1 — Organizer core flow (1 session per screen)
1. Landing page — hero, how-it-works, featured musician cards, trust bar
2. Request form — all 5 fields, validation, mock submit → redirect
3. Candidate list — MusicianGrid, MusicianCard, CandidateFilters, empty state
4. Musician detail — full MusicianProfile, sticky booking CTA

**Exit criteria:** Full organizer path navigable end-to-end (no dead ends).

### Wave 2 — Booking confirmation (short session)
5. Booking confirmation — summary card, next-steps copy, back-to-home CTA

**Exit criteria:** Complete organizer happy path works start-to-finish.

### Wave 3 — Musician side (1 session)
6. Musician onboarding — form with chips, mock save
7. Musician availability — WeeklyCalendar, SlotToggle, mock save
8. Offer response — OfferCard, OfferActionButtons, inline status update

**Exit criteria:** Musician path navigable from sign-in through offer response.

### Wave 4 — Admin side (1 session)
9. Admin request list — RequestTable with status tabs, filter
10. Admin request detail + shortlist — two-panel/tabbed layout, ShortlistPanel

**Exit criteria:** Admin path navigable, shortlist action works.

### Wave 5 — Polish (1 session)
- Mobile polish pass on all 10 screens (use `skill-mobile-polish.md`)
- Japanese copy audit against glossary
- Empty states on all list/grid screens
- Loading skeletons on Candidate List + Admin screens
- Navigation audit: every screen reachable, no dead-end pages
- `tsc --noEmit` passes clean

**Exit criteria:** Acceptance checklist below is fully green.

---

## 7. Risks & Scope Creep Traps

| Risk | Likely trigger | Mitigation |
|---|---|---|
| Candidate list filter complexity | "Add real filtering logic" | Keep filters as simple array `.filter()` on mock data. URL params for state. |
| Availability calendar becomes a real calendar | "Make it look like Google Calendar" | Hard cap: 7-column × 3-row toggle grid. No drag-select. No date library. |
| Admin shortlist → Kanban board | "Let's make it drag-and-drop" | Checkboxes + one action button only. No DnD in Phase 0. |
| Musician onboarding file upload | "Can we upload a real photo?" | Mock only: preset avatar picker (4 options) OR URL text input. No file upload. |
| Multi-step booking wizard | "Add step 2, step 3..." | One confirmation screen only. |
| Design system customisation | "Let's match our brand colors exactly" | Neutral palette (slate/zinc) is sufficient. Custom color tokens: 1–2 only (primary accent + availability green). |
| Japanese copy perfectionism | Iterating over every sentence | Use the glossary, write naturally, move on. Copy can be refined post-demo. |
| Authentication beyond role switcher | "Can we add a real login?" | `RoleSwitcher` floating badge is the demo mechanism. No form, no JWT, no sessions. |
| Offer flow complexity | "Add negotiation / counter-offer" | Phase 0: YES / HOLD / NO only. No message thread. |
| Phase 1 prep bleeding in | "Let's set up Supabase schema now" | Strictly no. Mock types are the schema. Supabase is Wave 0 of Phase 1. |

---

## 8. Phase 0 Acceptance Checklist

### Navigation
- [ ] All 10 screens are reachable without dead ends
- [ ] Organizer happy path completable: `/` → form → candidates → detail → confirmation
- [ ] Musician path completable: sign-in (role switch) → onboarding → availability → offer response
- [ ] Admin path completable: sign-in (role switch) → request list → request detail → shortlist action
- [ ] `RoleSwitcher` visible on every screen; switches role and updates nav without page reload

### Quality
- [ ] Every screen works at 375px width — no horizontal overflow
- [ ] All user-facing text is in Japanese — zero English visible to demo audience
- [ ] All list/grid screens have empty states with Japanese copy
- [ ] Every form shows inline Japanese validation messages
- [ ] `tsc --noEmit` exits with 0 errors
- [ ] `npm run build` completes without error

### Data & Engineering
- [ ] No `console.log` in committed code
- [ ] No real API calls or third-party env variables
- [ ] All mock data matches TypeScript interfaces exactly
- [ ] No `any` types in source files
- [ ] shadcn/ui `components/ui/` files are unmodified

### Demo-readiness
- [ ] Can be demoed in a browser with just `npm run dev` — no setup required
- [ ] Looks credible to 5 musicians and 5 event planners in Tokyo
- [ ] Loading skeletons or instant render on candidate list and admin screens
- [ ] No broken image placeholders — all photos either load or show a graceful fallback
