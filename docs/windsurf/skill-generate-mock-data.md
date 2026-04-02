# Skill: Generate Mock Data — match-skills
> Use this as a reusable task template whenever you need to add or expand mock data.

---

## Trigger

Use this skill when:
- A new screen needs data that doesn't exist yet
- An existing mock dataset needs more entries for a richer demo
- A new type/entity is being introduced

---

## Inputs Required

| Input | Example |
|---|---|
| Entity name | `Musician` |
| Type location | `/lib/types.ts` (single file — all types here) |
| Output file | `/lib/mock/musicians.ts` |
| Number of entries | 6–10 for a browsable list; 1–3 for detail-only |
| Special requirements | "include at least one Jazz and one Classical musician" |

---

## Rules for Mock Data Quality

### IDs
- Format: `"[prefix]-[zero-padded-number]"` — e.g., `"m-001"`, `"b-003"`, `"o-002"`
- Prefixes: `m` = musician, `b` = booking, `o` = organizer, `v` = venue

### Realism
- Use real Tokyo neighborhood names: 渋谷区, 新宿区, 港区, 中央区, 台東区, 品川区, 世田谷区, 目黒区
- Use plausible Japanese musician names (e.g., 田中 誠, 佐藤 あかね, 山田 ケンジ)
- Use real venue types: レストラン, ホテルラウンジ, 企業イベント, プライベートパーティー
- Use realistic pricing in JPY: ¥15,000–¥80,000 per hour for a musician

### Diversity
- Vary genres: Jazz, Classical, Bossa Nova, Pop, Acoustic, Latin
- Vary instruments: Piano, Violin, Guitar, Saxophone, Harp, Cello, Vocal
- Vary availability: some should be available today/this week, some not
- Vary price points: budget, mid-range, premium

### Consistency
- Every field in the mock object must match the TypeScript interface exactly
- Do not add fields that are not in the type
- If a field is optional (`?`), omit it on ~30% of entries to test edge cases

---

## Step-by-Step Procedure

### Step 1 — Read the type
- Open `/lib/types.ts` and find the relevant interface
- List every field, its type, and whether it is optional

### Step 2 — Check for existing data
- Check `/lib/mock/[entity].ts` — if it exists, append; do not overwrite
- Check for ID collisions before adding
- Ensure the new entity is re-exported from `/lib/mock/index.ts`

### Step 3 — Generate entries
- Write 6–10 entries for list screens, fewer for detail-only
- Apply the realism and diversity rules above
- Every string field that is user-facing must be in Japanese

### Step 4 — Export with explicit type annotation
```ts
import type { Musician } from "@/lib/types";

export const MOCK_MUSICIANS: Musician[] = [
  {
    id: "m-001",
    name: "田中 誠",
    // ...
  },
  // ...
];
```

Add or confirm the export in `/lib/mock/index.ts`:
```ts
export { MOCK_MUSICIANS } from "./musicians";
```

### Step 5 — Verify
- TypeScript must not show errors on this file
- Each entry should feel like a real listing a demo audience would believe

---

## Output Checklist

- [ ] File is at `/lib/mock/[entity].ts` (no `src/` prefix)
- [ ] Export name is `MOCK_[ENTITIES]` (screaming snake case)
- [ ] Re-exported from `/lib/mock/index.ts`
- [ ] Explicit type annotation on the exported array
- [ ] No TypeScript errors
- [ ] All IDs are unique and follow `"x-001"` format
- [ ] All user-facing strings are in Japanese
- [ ] Venue names and neighborhoods are Tokyo-realistic (see `agent-japan-market-realism.md`)
- [ ] At least one entry has an empty/null optional field to test edge cases
- [ ] File list summary provided

---

## Example: Musician Mock Data Skeleton

```ts
import type { Musician } from "@/lib/types";

export const MOCK_MUSICIANS: Musician[] = [
  {
    id: "m-001",
    slug: "tanaka-makoto",
    name: "田中 誠",
    nameKana: "タナカ マコト",
    tagline: "ホテルラウンジ・企業イベントを得意とするジャズピアニスト",
    bio: "東京を拠点に活動するジャズピアニスト。企業イベントやホテルラウンジの演奏を得意とする。",
    instruments: ["piano"],
    genres: ["jazz", "bossa_nova"],
    ensembleType: "ソロ",
    neighborhood: "港区",
    travelAreas: ["港区", "渋谷区"],
    pricePerHour: 25000,
    availabilityStatus: "available_today",
    availabilityLabel: "急ぎ対応可",
    bookingCount: 47,
    suitableEvents: ["corporate", "hotel_lounge"],
    photoUrl: null,
    mediaUrl: null,
    isCurated: true,
    tags: ["企業イベント向け"],
  },
  // ...
];
```
