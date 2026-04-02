# Phase 0 Locked Spec — match-skills
> These decisions are locked. Do not reopen them for Phase 0. Treat the codebase as the source of truth.

---

## 1. Booking Model — Request-First Flow ✓ LOCKED

The booking flow is **organizer-initiates-request**, not musician-browse-and-book:

```
Organizer fills request form (/request/new)
  → Review screen (/request/review)
  → Candidate list (/matches/[requestId])
  → Musician detail (/musicians/[slug])
  → Booking confirmation (/booking/confirm/[requestId]/[musicianId])

In parallel — admin side:
  Admin views request (/admin/requests/[id])
  → Shortlists musicians (AdminShortlistPanel)
  → Sends offers to musicians

Musician side:
  Musician views offer (/offer/[token])
  → Responds YES (承諾) / HOLD (保留) / NO (お断り)
```

**Locked decisions:**
- No instant-confirm. Musician must explicitly accept.
- Organizer sees estimated fee (pricePerHour × durationHours) at confirmation — not a binding quote.
- Offer response is YES/HOLD/NO only. No negotiation, no counter-offer.
- Admin is the intermediary between organizer and musician in Phase 0.

---

## 2. Musician Card Media — Photo-First Card, Richer on Detail ✓ LOCKED

**Card (`MusicianCard`):**
- Aspect ratio `4/3` photo at top with `object-cover`
- Availability badge overlaid top-left on photo
- Curated (公認) badge overlaid top-right on photo
- Below photo: name, ensemble type, tagline (2-line clamp), genre tags, price, area, booking count, response speed label

**Detail page (`/musicians/[slug]`):**
- Full-width hero photo (h-64 mobile / h-80 sm / h-96 lg) with gradient overlay
- Availability badge + back-link overlaid on hero
- Two-column layout below: bio/genres/instruments (left) + price/area/events/availability (right)
- Trust signals row: responseLabel, popularityLabel, bookingCount
- Tags row (hashtag style)
- Media placeholder (dashed border stub) — `TODO Phase 1: embed actual media`
- Sticky bottom booking CTA bar

**Locked decisions:**
- `photoUrl` is an Unsplash URL in Phase 0. No file upload.
- `mediaUrl` is always `null` in Phase 0. The media section renders as a placeholder stub.
- No video embed, no audio player in Phase 0.

---

## 3. Availability — Organizer Badges + Musician Weekly Grid ✓ LOCKED

**Organizer-facing (read-only badges):**
- `AvailabilityBadge` component renders `availabilityLabel` string from mock data
- Four statuses: `available_today` (急ぎ対応可) / `available_this_week` (今週対応可) / `available_weekend` (今週末対応可) / `contact_required` (要日程相談)
- Badge appears on both `MusicianCard` (photo overlay) and detail page (hero overlay + detail section)
- `CandidateList` has a client-side "今週OK" filter toggle using `availabilityStatus`

**Musician-facing (editable grid):**
- `AvailabilityEditor` at `/musician/availability`
- 7 columns (today + 6 days) × 3 rows (午前 / 午後 / 夜)
- Each cell toggles between 空き (○, green) / 不可 (×, muted)
- Summary line: `今週の空き: X スロット`
- Mock save with toast confirmation
- No drag-select. No date picker. No calendar library.

**Locked decisions:**
- Availability badge is a pre-computed display string (`availabilityLabel`), not derived live from slot data.
- Slot data (`MOCK_AVAILABILITY`) exists but is only used by `AvailabilityEditor`, not by the organizer-facing badge.
- Phase 1 will compute `availabilityStatus` from actual slot data server-side.

---

## 4. Price Display — JPY Range + Package Hint ✓ LOCKED

**Display format:**
- `formatPricePerHour(n)` → `¥XX,000 / 時間`
- `formatPrice(n)` → `¥XX,000` (total fee, used on offer/confirmation screens)
- Estimated total on confirmation: `pricePerHour × durationHours`

**On musician card:** price shown as `¥XX,000 / 時間` inline with name (top-right of card body)

**On musician detail:** price shown prominently as `¥XX,000 / 時間` with optional `priceNote` below (e.g., "2時間以上から承ります") and disclaimer: `※ 正式なお見積もりは予約確定後にご案内します`

**On booking confirmation:** itemised as `¥XX,000 / 時間 × N時間 = ¥XX,000`

**Locked decisions:**
- All prices in JPY. No currency conversion.
- `pricePerHour` is always an integer (no decimals).
- Pricing is hourly only. No flat-fee or per-event pricing in Phase 0.
- The displayed price is always described as 目安 (estimate). No binding price in Phase 0.
- Phase 1 will add a Stripe payment intent after musician accepts.

---

## 5. Admin — Request List + Request Detail + Shortlist Panel ✓ LOCKED

**Request list (`/admin/requests`):**
- Server component
- Status overview cards: 対応待ち / 候補選定中 / オファー送付済み / 確定済み (counts)
- Table: event type, date/time/area, organizer, status badge, 詳細 link
- Sorted newest first
- No pagination in Phase 0

**Request detail (`/admin/requests/[id]`):**
- Desktop: two-column `lg:grid-cols-[1fr_380px]` — details left, shortlist right
- Mobile: single column (shortlist panel scrolls below details)
- Left panel: event info card, organizer info card, sent offers list (with offer token links)
- Right panel: `AdminShortlistPanel`

**Shortlist panel (`AdminShortlistPanel`):**
- Client component
- Genre filter + availability filter (chips)
- Musician list with checkboxes
- `候補として送る (X名)` CTA — disabled until ≥1 musician checked
- Mock action: updates local state, shows toast, does not persist

**Locked decisions:**
- `RequestStatus` values: `"pending"` / `"shortlisted"` / `"offers_sent"` / `"confirmed"` / `"cancelled"`
- Admin cannot create or delete requests in Phase 0 (view + shortlist only)
- No drag-and-drop, no Kanban, no bulk actions in Phase 0

---

## 6. Primary Routes ✓ LOCKED

All 11 routes are implemented. Do not rename or remove them.

| Route | Purpose | Role | Type |
|---|---|---|---|
| `/` | Landing page | organizer | server |
| `/request/new` | Multi-step request form | organizer | client |
| `/request/review` | Confirmation + link to candidates | organizer | client |
| `/matches/[requestId]` | Candidate list with genre/availability filters | organizer | server + client |
| `/musicians/[slug]` | Musician detail + sticky booking CTA | organizer | server |
| `/booking/confirm/[requestId]/[musicianId]` | Booking confirmation (mock) | organizer | server |
| `/musician/onboarding` | Musician registration form | musician | client |
| `/musician/availability` | 7×3 weekly availability grid editor | musician | client |
| `/offer/[token]` | Offer YES/HOLD/NO response | musician | server + client |
| `/admin/requests` | Admin request table + status counts | admin | server |
| `/admin/requests/[id]` | Admin request detail + shortlist panel | admin | server + client |

**Navigation notes:**
- No `/sign-in` route. Role switching via `RoleSwitcher` floating pill (主催者 / 演奏家 / 管理者).
- Musician detail back link hardcodes `/request/review`. Phase 1 should use `router.back()` or referrer.
- Booking CTA on detail page hardcodes `req-004` as the requestId. Phase 1 reads from session.
- `RoleSwitcher` is visible on every page via root layout. It is demo-only.

---

## 7. Tokyo-Only Scope ✓ LOCKED

- Geography constraint: **Tokyo only** for Phase 0
- Neighborhoods in use: 港区, 渋谷区, 新宿区, 中央区, 千代田区, 台東区, 品川区, 世田谷区, 目黒区, 台東区, 広尾, 西麻布
- Out of scope: Yokohama, Kawasaki, Omiya, Urawa — do not add data for these areas
- `travelAreas` on `Musician` is a string array of Tokyo neighborhood names only
- `venueNeighborhood` on `BookingRequest` is a Tokyo neighborhood name string
- Phase 2+ may expand to other cities; the schema already supports it (no hardcoded city field)

---

## Stack Constraints ✓ LOCKED

| Item | Locked value |
|---|---|
| Framework | Next.js 16.2.2 |
| React | 19 |
| Tailwind | 4 (CSS-first, `@import "tailwindcss"` in `app/globals.css`) |
| UI library | shadcn/ui base-nova (`@base-ui/react`) |
| Button links | `LinkButton` from `@/components/ui/link-button` — no `asChild` |
| Types | All in `/lib/types.ts` — single file |
| Mock data | `/lib/mock/*.ts` — barrel via `/lib/mock/index.ts` |
| Routing | App Router only — no `pages/` |
| `params` | Always `await params` — it is a Promise in Next.js 16 |
| Directory | No `src/` prefix |
| Auth | `MockSessionContext` only |
| State | React Context only |
| Phase 1 markers | `TODO Phase 1:` comments in source |
