# Skill: Sync AI Instructions — match-skills
> Use this as a reusable task template to detect and resolve conflicts across AI instruction files.

---

## Trigger

Use this skill when:
- A new doc has been added to `/docs/windsurf/` and existing docs may need updating
- A new route, component, or architectural decision has been made that contradicts current docs
- Preparing for a new phase of work (e.g. Phase 0 → Phase 1 transition)
- Noticing inconsistent agent behavior across sessions

---

## Files to Inspect

Read all of these before making any changes:

```
/AGENTS.md
/CLAUDE.md
/docs/windsurf/engineering-rules.md
/docs/windsurf/project-memory.md
/docs/windsurf/phase0-product-brief.md
/docs/windsurf/phase0-implementation-plan.md
/docs/windsurf/agent-frontend-builder.md
/docs/windsurf/agent-product-ux.md
/docs/windsurf/agent-qa-polish.md
/docs/windsurf/agent-flow-state-guardian.md
/docs/windsurf/agent-japan-market-realism.md
/docs/windsurf/agent-instruction-sync-maintainer.md
/docs/windsurf/skill-build-screen.md
/docs/windsurf/skill-generate-mock-data.md
/docs/windsurf/skill-mobile-polish.md
/docs/windsurf/skill-non-destructive-refactor.md
/docs/windsurf/skill-wire-prototype-state.md
/docs/windsurf/skill-flow-consistency-audit.md
/docs/windsurf/skill-seed-demo-scenarios.md
/docs/windsurf/skill-sync-ai-instructions.md
```

Also read the actual source of truth files:
```
/lib/types.ts              ← canonical type definitions
/lib/mock/index.ts         ← canonical mock data exports
/app/                      ← canonical route structure
/components/               ← canonical component locations
/context/                  ← canonical context location
```

---

## Process

### Step 1 — Detect duplicated guidance

Look for the same instruction stated in multiple files. Flag when:
- The same rule appears word-for-word in 3+ files
- The same concept is explained differently in two files
- A glossary term is defined in multiple places

Common duplication hotspots:
- "no `any` types" appears in engineering-rules, agent-frontend-builder, agent-qa-polish
- Japanese copy rules appear in engineering-rules, agent-frontend-builder, agent-product-ux
- Folder structure described in engineering-rules AND agent-frontend-builder

**Decision**: Duplication is acceptable if it aids quick reference in a single agent prompt. Flag only when the copies **contradict** each other.

---

### Step 2 — Detect conflicting guidance

A conflict exists when two files give opposing instructions about the same thing. Priority order when resolving:

1. `/AGENTS.md` — always wins (injected as workspace rule)
2. Actual `/app/`, `/lib/`, `/components/` file system — ground truth for implementation facts
3. Newer docs override older docs on the same topic
4. Agent prompts (`agent-*.md`) > skill templates (`skill-*.md`) for architectural decisions

**Known conflicts to check (as of Phase 0 completion)**:

| Conflict | File A | File B | Resolution |
|---|---|---|---|
| Folder uses `src/` prefix | `engineering-rules.md`, `agent-frontend-builder.md` | Actual file system (no `src/`) | Use flat layout — no `src/` |
| Mock data path | `engineering-rules.md` (`/src/lib/mock-data/`) | Actual path (`/lib/mock/`) | Use `/lib/mock/` |
| Types path | `engineering-rules.md` (`/src/types/`) | Actual path (`/lib/types.ts`) | Use `/lib/types.ts` |
| Next.js version | Some docs say "14+" | `AGENTS.md` warns of breaking changes (actual: 16.2.2) | Trust AGENTS.md |
| Onboarding scope | `agent-product-ux.md` says out of scope | `/app/musician/onboarding/` exists | Onboarding IS in Phase 0 |
| Route inventory | `project-memory.md` lists old pre-build routes | `agent-flow-state-guardian.md` lists real routes | Use `agent-flow-state-guardian.md` |

---

### Step 3 — Identify outdated instructions

Flag content that was written before the prototype was built and is now stale:

- Checkboxes in `project-memory.md` (What Has Been Done) are all unchecked — should be updated
- Screen inventory in `project-memory.md` reflects the original plan, not the built routes
- `phase0-product-brief.md` says "Musician self-onboarding flow" is out of scope — it was built
- `skill-generate-mock-data.md` references old ID prefix conventions (`"b-001"` for booking) — actual prefix is `"req-001"`

---

### Step 4 — Propose minimum edits

For each conflict or outdated item, propose the smallest edit that resolves it. Format:

```
FILE: /docs/windsurf/engineering-rules.md
LINE RANGE: ~35-66 (folder structure block)
CHANGE: Replace all `src/` prefixes with the flat layout paths
REASON: Actual project has no src/ directory
```

Do not propose rewrites of entire files. One targeted change per conflict.

---

### Step 5 — Apply and verify

After applying edits:
- Re-read each modified file to confirm the conflict is resolved
- Confirm no new contradictions were introduced
- Confirm `/AGENTS.md` content was not altered (it is injected as a workspace rule)

---

## Output Format

```
## Conflicts Found

| # | File A | File B | Description | Severity |
|---|---|---|---|---|
| 1 | engineering-rules.md | /lib/ (actual) | src/ prefix vs flat layout | High |
| 2 | agent-product-ux.md | /app/musician/onboarding | Onboarding listed as out of scope | Medium |
| 3 | project-memory.md | agent-flow-state-guardian.md | Route inventory mismatch | Medium |

## Files Updated

- `/docs/windsurf/engineering-rules.md` — removed src/ prefix, updated paths
- `/docs/windsurf/project-memory.md` — updated route inventory, checked off completed items

## Rationale

[Brief explanation of each change]

## Deferred (needs product decision)

[Any conflicts that require a human decision before resolving]
```

---

## Constraints

- Do not change product behavior — documentation only
- Do not delete any files
- Do not alter `/AGENTS.md` content (it is a workspace rule, changes have broad effect)
- Prefer targeted line edits over full rewrites
- If two conflicting instructions are both valid in different contexts, add a note clarifying when each applies rather than deleting either
