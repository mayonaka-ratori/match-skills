// Demo reset helper — clears all Phase 0 prototype state
// TODO Phase 1: delete this file entirely (no draft, no mock session)
import { clearRequestDraft } from "@/lib/request-draft";
import type { UserRole } from "@/lib/types";

export function resetDemoState(setRole: (role: UserRole) => void): void {
  clearRequestDraft();
  setRole("organizer");
}
