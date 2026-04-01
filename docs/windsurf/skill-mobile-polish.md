# Skill: Mobile Polish — match-skills
> Use this as a reusable task template to make an existing screen production-quality on mobile.

---

## Trigger

Use this skill when:
- A screen has been built but not yet reviewed for mobile
- A screen looks broken or cramped below 640px
- Pre-demo polish pass on any screen

---

## Inputs Required

| Input | Example |
|---|---|
| Screen / component to polish | `MusicianCard` |
| File path | `src/components/musicians/MusicianCard.tsx` |
| Known issues | "Text overflows on small names, button is too small" |

---

## Target Breakpoints

| Breakpoint | Width | Priority |
|---|---|---|
| Mobile S | 375px | **Critical** — primary target |
| Mobile L | 430px | High |
| Tablet | 768px | Medium |
| Desktop | 1280px | Low (prototype only) |

---

## Step-by-Step Procedure

### Step 1 — Audit the component at 375px
Check for the following issues:

**Layout**
- [ ] Does the component overflow horizontally?
- [ ] Do flex/grid children shrink correctly?
- [ ] Are paddings/margins appropriate (not too large, not zero)?
- [ ] Does the card/container have `min-w-0` to prevent flex blowout?

**Text**
- [ ] Does text truncate or wrap correctly? (`truncate` or `line-clamp-*`)
- [ ] Is font size readable (minimum 14px / `text-sm`)?
- [ ] Are headings not too large for mobile (`text-lg` max for card headings)?

**Touch targets**
- [ ] Are all buttons/links at least 44px tall? (`min-h-[44px]`)
- [ ] Is tap target spacing adequate? (`gap-2` minimum between interactive elements)

**Images/Media**
- [ ] Does the image have a defined aspect ratio? (`aspect-video`, `aspect-square`)
- [ ] Does it scale with `object-cover`?
- [ ] Is there a placeholder/fallback for missing images?

**Forms**
- [ ] Are inputs full-width on mobile? (`w-full`)
- [ ] Are labels above inputs (not side-by-side) on mobile?
- [ ] Is the submit button full-width on mobile?

### Step 2 — Apply Tailwind fixes
- Use mobile-first classes (no prefix = mobile base)
- Add `sm:` modifier for tablet overrides, `md:` for desktop
- Common fixes:
  - `flex-col sm:flex-row` for stacked → horizontal layout
  - `w-full sm:w-auto` for buttons
  - `text-sm sm:text-base` for body text
  - `gap-2 sm:gap-4` for spacing
  - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for card grids
  - `truncate` or `line-clamp-2` for long text
  - `min-w-0` on flex children to prevent overflow

### Step 3 — Check Japanese text specifically
- Japanese characters are wider than Latin — check for overflow at 375px with actual Japanese strings
- Long Japanese compound words do not break with `break-words` — use `break-all` only as a last resort
- Verify all badge/tag text fits within its container

### Step 4 — Verify empty states on mobile
- Empty state illustrations or icons should scale down gracefully
- Empty state copy should wrap correctly

### Step 5 — Verify interactive states on mobile
- Hover states are not the only visual feedback — add active/focus states
- Use `active:scale-95` or `active:opacity-80` for tap feedback on buttons

---

## Output Checklist

- [ ] Renders correctly at 375px with no horizontal overflow
- [ ] All touch targets are ≥ 44px
- [ ] Text does not overflow its container
- [ ] Images have defined aspect ratios
- [ ] Forms are full-width on mobile
- [ ] Empty states look correct on mobile
- [ ] Japanese text wraps/truncates correctly
- [ ] No regressions at 768px or 1280px
- [ ] File list summary provided

---

## Common Tailwind Patterns for This Project

```tsx
// Card grid — responsive columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Button — full width on mobile, auto on desktop
<Button className="w-full sm:w-auto">今すぐ予約</Button>

// Flex row — stacks on mobile
<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

// Truncated musician name
<h3 className="text-base font-semibold truncate min-w-0">田中 誠</h3>

// Price badge — no overflow
<span className="whitespace-nowrap text-sm font-medium">¥25,000 / 時間</span>

// Aspect-ratio image container
<div className="relative aspect-square w-full overflow-hidden rounded-md">
  <Image src={...} alt={...} fill className="object-cover" />
</div>
```
