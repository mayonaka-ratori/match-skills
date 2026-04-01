# Skill: Non-Destructive Refactor — match-skills
> Use this as a reusable task template when refactoring existing code without changing behavior.

---

## Trigger

Use this skill when:
- A component has grown too large and needs to be split
- Duplicate logic needs to be extracted into a shared util or hook
- Types need to be tightened (e.g., removing `any`, adding missing annotations)
- A file needs to be moved to a better location without breaking imports
- Code style needs to be brought in line with engineering rules

---

## Core Principle

> **A non-destructive refactor changes structure, not behavior.**
> The UI must look and function identically before and after.
> If behavior changes, it is not a refactor — stop and clarify.

---

## Inputs Required

| Input | Example |
|---|---|
| Scope | `MusicianCard.tsx` component |
| Reason | "Too long (200+ lines), mixes layout and data logic" |
| Constraint | "Do not change any props interface or visual output" |

---

## Step-by-Step Procedure

### Step 1 — Understand before touching
- Read the full file(s) in scope
- Identify: what does each block do? What are the boundaries?
- List the proposed changes as a numbered plan before writing any code

### Step 2 — Confirm the plan
- State explicitly: "These changes will not alter component output or public API"
- If any change *does* alter the public API or behavior, flag it and ask before proceeding

### Step 3 — Make changes in the smallest possible increments

**For component splits:**
1. Extract inner JSX blocks into new sub-components in the same file first
2. Verify it still renders correctly
3. Then move sub-components to their own files if warranted
4. Update all imports

**For extracting logic to hooks:**
1. Identify the state + effects that belong together
2. Create `src/[feature]/use[FeatureName].ts`
3. Move logic there with proper types
4. Replace inline logic in the component with the hook call
5. Verify TypeScript still passes

**For extracting utils:**
1. Identify pure functions (no side effects, no component state)
2. Move to `src/lib/utils/[name].ts`
3. Add explicit input/output types
4. Export and update import in source file

**For tightening types:**
1. Replace `any` with the most specific type possible
2. Add return types to functions that are missing them
3. Replace `object` or `{}` with proper interfaces
4. Do not change field names or shapes — only add precision

**For moving files:**
1. Create the file at the new path
2. Update all imports across the codebase
3. Delete the old file last
4. Verify no broken imports remain

### Step 4 — Verify no regressions
- TypeScript: no new errors (run `tsc --noEmit` if possible)
- All props/exports that existed before still exist after
- Visual output is unchanged
- No `console.log` left behind

### Step 5 — Document the change
Provide a summary in this format:

```
Refactor: [short description]

Before:
  src/components/musicians/MusicianCard.tsx  (210 lines)

After:
  src/components/musicians/MusicianCard.tsx  (90 lines)
  src/components/musicians/MusicianMeta.tsx  (60 lines)
  src/components/musicians/MusicianMedia.tsx (50 lines)

No behavioral changes. Props interface unchanged.
```

---

## Anti-Patterns to Avoid

- Do not rename public-facing props unless there is a strong reason (and ask first)
- Do not change the order of JSX elements (affects layout)
- Do not remove `className` props
- Do not add new features inside a refactor task — open a separate task
- Do not "simplify" logic that has subtle edge-case handling without confirming it

---

## Output Checklist

- [ ] Plan was stated before code was written
- [ ] Public API (props, exports) is unchanged
- [ ] TypeScript has no new errors
- [ ] No visual regressions
- [ ] No new behavior introduced
- [ ] File list summary with before/after line counts provided
