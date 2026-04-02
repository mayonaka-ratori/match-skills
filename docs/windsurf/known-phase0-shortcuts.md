# Known Phase 0 Shortcuts — match-skills
> Intentional shortcuts taken in Phase 0 to ship a clickable prototype fast.
> Each item has a `TODO Phase 1:` comment at the corresponding source location.
> Do not "fix" these in Phase 0 — they are deliberate, not bugs.

---

## Navigation & Routing

### Hardcoded requestId in booking CTA
- **Where:** `app/musicians/[slug]/page.tsx`
- **Shortcut (resolved Phase 0):** The fake `req-001` fallback has been removed. The page now operates in two modes:
  - **Mode A** (`?requestId=` present): CTA → `/booking/confirm/${requestId}/${musician.id}` — organizer flow, label「この演奏家で予約を申し込む」
  - **Mode B** (no `?requestId=`): CTA → `/request/new?eventType=<suitableEvents[0]>&musician=<slug>` — standalone entry, label「この演奏家でリクエストを始める」; `RequestFormWizard` pre-selects the event type chip and shows a dismissible musician hint banner
- **Query params introduced:** `?eventType=` and `?musician=` on `/request/new`
- **Phase 1 fix:** requestId will always be present (real session); remove Mode B branch and hint banner

### Hardcoded mock request on review page
- **Where:** `app/request/review/page.tsx`
- **Shortcut:** ~~Always showed req-004~~ — **resolved in Phase 0**: `RequestFormWizard` now writes a `RequestDraft` to `sessionStorage` on submit via `lib/request-draft.ts`; the review page reads the draft and renders live user input. Falls back to mock req-004 (with a subtle "サンプルデータ" notice) when no draft is present (direct navigation, demo scenario entry).
- **Remaining shortcut:** The candidates CTA still links to `req-004` even when showing a real draft (no real `requestId` exists until Supabase insert).
- **Phase 1 fix:** Create a real BookingRequest row in Supabase on form submit, redirect with the new `requestId`; remove `lib/request-draft.ts` entirely.

### Back link on musician detail hardcodes `/request/review`
- **Where:** `app/musicians/[slug]/page.tsx` line ~49
- **Shortcut:** `href="/request/review"` always
- **Why:** No referrer tracking in Phase 0
- **Phase 1 fix:** Pass `?from=/matches/[requestId]` as a query param and use `router.back()` or read it

---

## Data & State

### All filtering is client-side on full mock array
- **Where:** `components/request/CandidateList.tsx`
- **Shortcut:** Server passes all 10 musicians to client; filter runs via `.filter()` in `useState`
- **Why:** No DB query, no server-side filtering needed with 10 records
- **Phase 1 fix:** Move genre/availability filters to Supabase query params; paginate results

### AdminShortlistPanel does not persist shortlist changes
- **Where:** `components/admin/AdminShortlistPanel.tsx`
- **Shortcut:** Checking musicians and clicking "候補として送る" updates React state only — reloading the page resets to mock data
- **Why:** No backend to write to
- **Phase 1 fix:** `PATCH /api/requests/[id]/shortlist` → Supabase update, then send offer rows

### AvailabilityEditor does not persist slot changes
- **Where:** `components/musician/AvailabilityEditor.tsx`
- **Shortcut:** Toggle state lives in component; saving shows a toast but writes nothing
- **Why:** No backend
- **Phase 1 fix:** `POST /api/availability` → upsert `availability_slots` rows in Supabase

### OfferResponseCard does not persist response
- **Where:** `components/offer/OfferResponseCard.tsx`
- **Shortcut:** Clicking YES/HOLD/NO updates local state and shows inline confirmation; page reload reverts to mock status
- **Why:** No backend
- **Phase 1 fix:** `PATCH /api/offers/[id]` → update `offers.status` + `offers.responded_at` in Supabase

### MusicianOnboardingForm does not create a musician record
- **Where:** `components/musician/MusicianOnboardingForm.tsx`
- **Shortcut:** Form submission shows a toast and redirects to `/musician/availability`; nothing is written
- **Why:** No backend, no file upload
- **Phase 1 fix:** `POST /api/musicians` → insert musician row, upload photo to Supabase Storage, redirect with new musician slug

---

## Media & Assets

### All musician photos are Unsplash URLs
- **Where:** `lib/mock/musicians.ts` — `photoUrl` fields
- **Shortcut:** Using `https://images.unsplash.com/...` URLs instead of uploaded assets
- **Why:** No file upload, no storage bucket in Phase 0
- **Phase 1 fix:** Supabase Storage bucket for musician photos; upload in onboarding form

### `mediaUrl` is always `null`
- **Where:** All 10 musicians in `lib/mock/musicians.ts`
- **Shortcut:** Media section on detail page renders as a placeholder stub ("予約確定後にご案内します")
- **Why:** No video hosting, no audio player in Phase 0
- **Phase 1 fix:** Support YouTube/Vimeo embed URL or direct upload to Supabase Storage

---

## Auth & Sessions

### Role switcher is the only "auth"
- **Where:** `components/layout/RoleSwitcher.tsx`, `context/mock-session.tsx`
- **Shortcut:** Any visitor can switch to any role (organizer / musician / admin) with one tap
- **Why:** No real auth in Phase 0. Demo mechanism only.
- **Phase 1 fix:** Supabase Auth with role stored in `profiles` table; route guards per role

### Musician identity is hardcoded in mock session
- **Where:** `context/mock-session.tsx`
- **Shortcut:** When role = `"musician"`, `mockUser.musicianId` is hardcoded (e.g. `"m-001"`)
- **Why:** No real user → musician mapping
- **Phase 1 fix:** Join `auth.users` → `profiles` → `musicians` to resolve the musician record for the logged-in user

### Offer page is accessible by anyone with the token URL
- **Where:** `app/offer/[token]/page.tsx`
- **Shortcut:** No auth check — any person with the URL can see and respond to the offer
- **Why:** Token-based access is intentional for Phase 0 (email link to musician). No session check needed for demo.
- **Phase 1 fix:** Verify that the logged-in musician matches `offer.musicianId` before allowing response

---

## Admin

### Admin has no auth guard
- **Where:** `app/admin/requests/page.tsx`, `app/admin/requests/[id]/page.tsx`
- **Shortcut:** No role check — any visitor can navigate to `/admin/requests`
- **Why:** Role switcher is the only gate; acceptable for a demo
- **Phase 1 fix:** Middleware-level route protection: redirect to sign-in if `role !== "admin"`

### Request status is never updated by admin action
- **Where:** `app/admin/requests/[id]/page.tsx` + `AdminShortlistPanel`
- **Shortcut:** Clicking "候補として送る" shows a toast but does not change `req.status` from `"pending"` to `"shortlisted"` in persistent state
- **Why:** Mock data is read-only
- **Phase 1 fix:** Update `booking_requests.status` + insert `offers` rows atomically in Supabase

---

## Copy & Content

### Trust bar stats are hardcoded fiction
- **Where:** `app/page.tsx` trust bar section
- **Shortcut:** "10名", "500件+", "東京全域", "最短当日" are static strings
- **Why:** No real data to pull from
- **Phase 1 fix:** Compute from real DB aggregates (musician count, confirmed booking count)

### "Next steps" copy mentions email but no email is sent
- **Where:** `app/booking/confirm/[requestId]/[musicianId]/page.tsx`
- **Shortcut:** Step 3 says "お支払いの案内をメールでお送りします" but no email is triggered
- **Why:** No Resend / email integration in Phase 0
- **Phase 1 fix:** Trigger Resend email to organizer on booking confirmation; trigger offer email to musician

### STEP labels use English "STEP 01"
- **Where:** `app/page.tsx` "How it works" section
- **Shortcut:** `STEP 01`, `STEP 02`, `STEP 03` use English "STEP"
- **Why:** Stylistic choice — "STEP" is a common loanword in Japanese UI
- **Status:** Acceptable. No change needed unless copy audit requests it.
