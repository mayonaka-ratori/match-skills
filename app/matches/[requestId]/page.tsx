// /matches/[requestId] — candidate list for a booking request
// Server component: reads mock data, passes to client filter component
// TODO Phase 1: fetch request + matched musicians from Supabase

import { notFound } from "next/navigation";
import { MOCK_REQUESTS, MOCK_MUSICIANS } from "@/lib/mock";
import { PageHeader } from "@/components/common/PageHeader";
import { CandidateList } from "@/components/request/CandidateList";
import { labelEventType, formatDate, formatTime, formatDuration } from "@/lib/format";

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const req = MOCK_REQUESTS.find((r) => r.id === requestId);
  if (!req) notFound();

  // Phase 0: return all musicians (filtering happens client-side)
  const musicians = MOCK_MUSICIANS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24">
      <PageHeader
        title="候補の演奏家"
        subtitle={`${labelEventType(req.eventType)} ・ ${formatDate(req.eventDate)} ${formatTime(req.eventTime)} ・ ${formatDuration(req.durationHours)} ・ ${req.venueNeighborhood}`}
        backHref="/request/review"
        backLabel="リクエストに戻る"
      />
      <CandidateList musicians={musicians} requestId={req.id} preferredGenres={req.preferredGenres} />
    </div>
  );
}
