// Request draft helpers — sessionStorage persistence for the organizer form flow
// TODO Phase 1: remove this file entirely; replace with a Supabase insert on form submit

import type { RequestDraft } from "@/lib/types";

const STORAGE_KEY = "ms_request_draft";

/** Persist the draft. Silently no-ops in SSR or if storage is unavailable. */
export function saveRequestDraft(draft: RequestDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

/**
 * Read and validate the stored draft.
 * Returns `null` when:
 *  - called server-side
 *  - no draft exists
 *  - stored JSON is malformed or missing required fields
 */
export function readRequestDraft(): RequestDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidDraft(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Remove the draft — call after the user navigates away from the review screen. */
export function clearRequestDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ─── Internal validation ─────────────────────────────────────────────────────
// Lightweight structural guard — enough to catch truncated / stale data.
// Does NOT do deep enum validation; Phase 1 will use Zod.

function isValidDraft(v: unknown): v is RequestDraft {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  return (
    typeof d.eventType === "string" && d.eventType.length > 0 &&
    typeof d.eventDate === "string" && d.eventDate.length > 0 &&
    typeof d.eventTime === "string" && d.eventTime.length > 0 &&
    typeof d.durationHours === "number" && d.durationHours > 0 &&
    typeof d.venueNeighborhood === "string" && d.venueNeighborhood.length > 0 &&
    typeof d.venueName === "string" &&
    Array.isArray(d.preferredGenres) &&
    (d.budgetPerHour === null || typeof d.budgetPerHour === "number") &&
    (d.notes === null || typeof d.notes === "string")
  );
}
