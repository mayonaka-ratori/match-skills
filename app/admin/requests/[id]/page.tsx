// /admin/requests/[id] — admin request detail + shortlist
// Server component shell, passes data to client shortlist component
// TODO Phase 1: fetch from Supabase, persist shortlist to booking_requests table

import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_REQUESTS, MOCK_MUSICIANS, MOCK_ORGANIZERS, MOCK_OFFERS } from "@/lib/mock";
import { PageHeader } from "@/components/common/PageHeader";
import { AdminShortlistPanel } from "@/components/admin/AdminShortlistPanel";
import {
  formatDate, formatTime, formatDuration, labelEventType,
  labelRequestStatus, labelGenre, labelOfferStatus,
  REQUEST_STATUS_STYLES, OFFER_STATUS_STYLES,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const req = MOCK_REQUESTS.find((r) => r.id === id);
  if (!req) notFound();

  const organizer = MOCK_ORGANIZERS.find((o) => o.id === req.organizerId);
  const offers = MOCK_OFFERS.filter((o) => o.requestId === req.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24">
      <PageHeader
        title={`${labelEventType(req.eventType)} — ${req.venueNeighborhood}`}
        subtitle={`${req.id} · ${formatDate(req.eventDate)} ${formatTime(req.eventTime)}`}
        backHref="/admin/requests"
        backLabel="リクエスト一覧"
      />

      {/* ── Two-column layout on desktop ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

        {/* Left: request detail */}
        <div className="space-y-5">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                REQUEST_STATUS_STYLES[req.status]
              )}
            >
              {labelRequestStatus(req.status)}
            </span>
            {req.confirmedMusicianId && (
              <span className="text-sm text-muted-foreground">
                確定演奏家: {MOCK_MUSICIANS.find((m) => m.id === req.confirmedMusicianId)?.name}
              </span>
            )}
          </div>

          {/* Event info card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              イベント詳細
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">種別</dt>
                <dd className="font-medium">{labelEventType(req.eventType)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">開催日</dt>
                <dd className="font-medium">{formatDate(req.eventDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">開始時刻</dt>
                <dd className="font-medium">{formatTime(req.eventTime)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">演奏時間</dt>
                <dd className="font-medium">{formatDuration(req.durationHours)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">会場エリア</dt>
                <dd className="font-medium">{req.venueNeighborhood}</dd>
              </div>
              {req.venueName && (
                <div>
                  <dt className="text-xs text-muted-foreground">会場名</dt>
                  <dd className="font-medium">{req.venueName}</dd>
                </div>
              )}
              {req.preferredGenres.length > 0 && (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-xs text-muted-foreground">ジャンル希望</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {req.preferredGenres.map((g) => (
                      <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {labelGenre(g)}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {req.budgetPerHour && (
                <div>
                  <dt className="text-xs text-muted-foreground">ご予算</dt>
                  <dd className="font-medium">〜¥{req.budgetPerHour.toLocaleString("ja-JP")}/時間</dd>
                </div>
              )}
              {req.notes && (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-xs text-muted-foreground">備考</dt>
                  <dd className="mt-1 rounded-lg bg-muted/40 p-2 text-sm">{req.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Organizer info */}
          {organizer && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                主催者情報
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">{organizer.name}</p>
                <p className="text-muted-foreground">{organizer.companyName}</p>
                <p className="text-muted-foreground">{organizer.email}</p>
                {organizer.phone && <p className="text-muted-foreground">{organizer.phone}</p>}
              </div>
            </div>
          )}

          {/* Offers sent */}
          {offers.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                送付済みオファー ({offers.length}件)
              </h2>
              <div className="space-y-2">
                {offers.map((offer) => {
                  const musician = MOCK_MUSICIANS.find((m) => m.id === offer.musicianId);
                  return (
                    <div key={offer.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium">{musician?.name ?? offer.musicianId}</p>
                        <p className="text-xs text-muted-foreground">出演料目安: ¥{offer.fee.toLocaleString("ja-JP")}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", OFFER_STATUS_STYLES[offer.status])}>
                          {labelOfferStatus(offer.status)}
                        </span>
                        <Link
                          href={`/offer/${offer.token}`}
                          className="text-xs text-primary hover:underline"
                        >
                          詳細を見る
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: shortlist panel */}
        <div>
          <AdminShortlistPanel
            requestId={req.id}
            initialShortlisted={req.shortlistedMusicianIds}
            allMusicians={MOCK_MUSICIANS}
            requestStatus={req.status}
            preferredGenres={req.preferredGenres}
          />
        </div>
      </div>
    </div>
  );
}
