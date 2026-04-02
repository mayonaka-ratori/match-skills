// /offer/[token] — musician's offer response page (YES / HOLD / NO)
// TODO Phase 1: fetch offer by token from Supabase, persist response

import { notFound } from "next/navigation";
import { MOCK_OFFERS, MOCK_REQUESTS, MOCK_MUSICIANS } from "@/lib/mock";
import { OfferResponseCard } from "@/components/offer/OfferResponseCard";
import { formatDate, formatTime, formatDuration, formatPrice, labelEventType } from "@/lib/format";

export default async function OfferResponsePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const offer = MOCK_OFFERS.find((o) => o.token === token);
  if (!offer) notFound();

  const req = MOCK_REQUESTS.find((r) => r.id === offer.requestId);
  const musician = MOCK_MUSICIANS.find((m) => m.id === offer.musicianId);
  if (!req || !musician) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 pb-24">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">matchskills よりオファーが届いています</p>
        <h1 className="mt-2 text-2xl font-semibold">{musician.name} さんへ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          下記のイベントへのご出演をご検討ください
        </p>
      </div>

      {/* Event summary */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          イベント詳細
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">種別</dt>
            <dd className="font-medium">{labelEventType(req.eventType)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">開催日時</dt>
            <dd className="font-medium">{formatDate(req.eventDate)} {formatTime(req.eventTime)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">演奏時間</dt>
            <dd className="font-medium">{formatDuration(req.durationHours)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">会場</dt>
            <dd className="font-medium">{req.venueName ? `${req.venueName}（${req.venueNeighborhood}）` : req.venueNeighborhood}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="text-muted-foreground">出演料（目安）</dt>
            <dd className="text-base font-bold">{formatPrice(offer.fee)}</dd>
          </div>
        </dl>
        <p className="mt-3 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
          ※ 出演料は目安です。主催者の詳細情報は承諾後にお伝えします。
        </p>
      </div>

      {/* Response card */}
      <OfferResponseCard offer={offer} />
    </div>
  );
}
