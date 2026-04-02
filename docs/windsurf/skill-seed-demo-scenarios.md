# Skill: Seed Demo Scenarios — match-skills
> Use this as a reusable task template when preparing realistic demo or interview scenarios.

---

## Trigger

Use this skill when:
- Preparing for a user interview with an organizer or musician
- Setting up a demo that needs to feel believable end-to-end
- Adding or refreshing mock data to cover new scenario types
- Rehearsing the admin shortlist workflow

---

## Requirements for Each Scenario

Every scenario must include:
- A scenario name and one-sentence context
- Organizer identity and company type
- Event type (`EventType` value)
- Venue (real or plausible Tokyo venue + neighborhood)
- Date urgency (today / this week / next weekend)
- Budget (`budgetPerHour` in JPY, or `null` if flexible)
- Recommended musician candidates from `MOCK_MUSICIANS`
- Admin shortlist relevance (which mock request matches)

---

## Five Canonical Demo Scenarios

These are the reference scenarios for this prototype. Use them as the default for all demos and interviews. All are already partially seeded in `/lib/mock/requests.ts` and `/lib/mock/musicians.ts`.

---

### Scenario A — 企業キックオフ（港区）
**Request ID**: `req-001`
**Organizer**: 株式会社テック系スタートアップ の人事担当（`o-001`）
**Event**: 四半期キックオフパーティー, 150名規模
**Venue**: ザ・プリンスパークタワー東京（港区）
**Date urgency**: 3日後（急ぎ）
**Budget**: ¥30,000 / 時間
**Duration**: 2時間
**Genre preference**: ジャズ, ラウンジ
**Recommended musicians**: 田中 誠 (`m-001`), 木村 雪 (`m-004`), 渡辺 花 (`m-009`)
**Admin shortlist status**: shortlisted
**Demo highlight**: Shows urgency label "急ぎ対応可", admin shortlist panel, multi-candidate comparison

---

### Scenario B — レストランBGM（西麻布）
**Request ID**: `req-002`
**Organizer**: 西麻布のイタリアンレストランのオーナー（`o-002`）
**Event**: 週末の特別ディナーコース, 20名
**Venue**: リストランテ アルポルト（西麻布）
**Date urgency**: 明日（急ぎ）
**Budget**: ¥20,000 / 時間
**Duration**: 3時間
**Genre preference**: ボサノバ, アコースティック
**Recommended musicians**: 山田 ケンジ (`m-003`), 中村 はるか (`m-005`)
**Admin shortlist status**: offers_sent (offer tokens: `tkn-ghi789`, `tkn-jkl012`)
**Demo highlight**: Shows offer flow — musician receives `/offer/[token]`, responds YES or HOLD

---

### Scenario C — ホテルVIPラウンジ（千代田区）
**Request ID**: `req-003`
**Organizer**: パレスホテル東京 F&B部門マネージャー（`o-001`）
**Event**: VIPラウンジ オープニングイベント
**Venue**: パレスホテル東京（千代田区）
**Date urgency**: 週末（余裕あり）
**Budget**: ¥45,000 / 時間
**Duration**: 4時間
**Genre preference**: クラシック, ラウンジ
**Recommended musicians**: 佐藤 あかね (`m-002`), 藤原 澪 (`m-007`)
**Admin shortlist status**: confirmed (`m-002` confirmed)
**Demo highlight**: Shows confirmed state, premium pricing, classical ensemble context

---

### Scenario D — 誕生日サプライズ（渋谷区）
**Request ID**: `req-004`
**Organizer**: 個人主催者、自宅パーティー（`o-003`）
**Event**: 誕生日サプライズパーティー, 15名
**Venue**: プライベートレジデンス（渋谷区）
**Date urgency**: 来週（余裕あり）
**Budget**: 未定（`null`）
**Duration**: 2時間
**Genre preference**: ポップ, ジャズ, ソウル
**Recommended musicians**: 中村 はるか (`m-005`), 小川 壮太 (`m-008`)
**Admin shortlist status**: pending（まだショートリストなし）
**Demo highlight**: Shows `null` budget handling, pending status, admin starting shortlist from scratch

---

### Scenario E — 年次総会 開会演奏（千代田区）
**Request ID**: `req-005`
**Organizer**: 外資系企業の総務部担当（`o-002`）
**Event**: 年次総会 開会セレモニー演奏
**Venue**: 東京国際フォーラム（千代田区）
**Date urgency**: 10日後
**Budget**: ¥50,000 / 時間
**Duration**: 1時間
**Genre preference**: クラシック限定
**Recommended musicians**: 佐藤 あかね (`m-002`), 藤原 澪 (`m-007`), 渡辺 花 (`m-009`)
**Admin shortlist status**: pending
**Demo highlight**: Shows high-budget, short-duration, formal ceremony context; admin decision-making

---

## Interview Setup Guidance

### For organizer interviews
1. Sign in as 主催者 (organizer role via role switcher)
2. Start at `/` — let them browse or use Scenario A as the entry point
3. Walk through: discovery → request form → matches → musician profile → confirm
4. Use `req-001` for a pre-populated shortlist; `req-004` for a blank-slate scenario

### For musician interviews
1. Sign in as 演奏家 (musician role via role switcher)
2. Start at `/musician/onboarding` — let them complete the form
3. Then move to `/musician/availability`
4. Show offer response at `/offer/tkn-abc123` (Scenario A, pending offer)

### For admin interviews
1. Sign in as 管理者 (admin role via role switcher)
2. Start at `/admin/requests` — show the request table
3. Dive into `req-001` for a populated shortlist view
4. Use `req-004` or `req-005` to show the shortlisting workflow from scratch

---

## Adding New Scenarios

When adding a new demo scenario:
1. Add a `BookingRequest` entry to `/lib/mock/requests.ts` with a new `req-xxx` ID
2. Verify the `organizerId` references an entry in `/lib/mock/organizers.ts`
3. Verify all `shortlistedMusicianIds` exist in `/lib/mock/musicians.ts`
4. If offers are needed, add `Offer` entries to `/lib/mock/offers.ts` with matching `requestId` and `musicianId`
5. Add the scenario description to this file
6. Check that the new `requestId` works in `/matches/[requestId]` and `/admin/requests/[id]`

---

## Output Checklist

- [ ] Scenario uses real mock IDs that exist in `/lib/mock/`
- [ ] Venue and neighborhood are Tokyo-realistic
- [ ] Budget is in JPY or explicitly `null`
- [ ] Genre preferences match available `Genre` type values
- [ ] Musician recommendations are plausible for the event type
- [ ] Demo walk completes without a 404 or empty screen
- [ ] Interview setup guidance is included
