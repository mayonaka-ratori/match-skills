// /booking/confirm/[requestId]/[musicianId]
// Phase 0: mocked confirmation — no real payment or API call
// TODO Phase 1: create booking record in Supabase, trigger offer notification

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, MapPin, Music2 } from "lucide-react";
import { MOCK_MUSICIANS, MOCK_REQUESTS } from "@/lib/mock";
import { formatDate, formatTime, formatDuration, formatPricePerHour, formatPrice, labelEventType } from "@/lib/format";
import { AvailabilityBadge } from "@/components/musicians/AvailabilityBadge";
import { LinkButton } from "@/components/ui/link-button";

export default async function BookingConfirmPage({
  params,
}: {
  params: Promise<{ requestId: string; musicianId: string }>;
}) {
  const { requestId, musicianId } = await params;
  const musician = MOCK_MUSICIANS.find((m) => m.id === musicianId);
  const req = MOCK_REQUESTS.find((r) => r.id === requestId);
  if (!musician || !req) notFound();

  const estimatedTotal = musician.pricePerHour * req.durationHours;

  return (
    <div className="mx-auto max-w-lg px-4 py-10 pb-24">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-8" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold">予約リクエストを受け付けました</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          担当スタッフが内容を確認し、24時間以内にご連絡します。
        </p>
      </div>

      {/* Musician card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {musician.photoUrl ? (
              <Image
                src={musician.photoUrl}
                alt={musician.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Music2 className="size-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold">{musician.name}</p>
            <p className="text-sm text-muted-foreground">{musician.ensembleType} · {musician.neighborhood}</p>
            <div className="mt-1">
              <AvailabilityBadge status={musician.availabilityStatus} label={musician.availabilityLabel} />
            </div>
          </div>
        </div>

        {/* Event details */}
        <div className="p-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            ご予約内容
          </h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-base">🎪</span>
              <div>
                <dt className="text-xs text-muted-foreground">イベント種別</dt>
                <dd className="font-medium">{labelEventType(req.eventType)}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 text-muted-foreground shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">日時</dt>
                <dd className="font-medium">
                  {formatDate(req.eventDate)} {formatTime(req.eventTime)}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base shrink-0">⏱</span>
              <div>
                <dt className="text-xs text-muted-foreground">演奏時間</dt>
                <dd className="font-medium">{formatDuration(req.durationHours)}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">会場</dt>
                <dd className="font-medium">{req.venueName ? `${req.venueName}（${req.venueNeighborhood}）` : req.venueNeighborhood}</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Estimated price */}
        <div className="border-t border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">料金の目安（税別）</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatPricePerHour(musician.pricePerHour)} × {formatDuration(req.durationHours)}
              </p>
            </div>
            <p className="text-lg font-bold">{formatPrice(estimatedTotal)}</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            ※ 目安金額です。正式なお見積もりは予約確定後にご案内します。
            {/* TODO Phase 1: Stripe payment link shown after musician accepts */}
          </p>
        </div>
      </div>

      {/* Next steps */}
      <div className="mt-6 rounded-xl border border-border bg-muted/20 p-4">
        <h2 className="mb-3 text-sm font-semibold">次のステップ</h2>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">1</span>
            担当スタッフが演奏家へオファーを送ります（通常24時間以内）
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">2</span>
            演奏家が承諾後、担当者より正式なご連絡とお見積もりをお送りします
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">3</span>
            内容をご確認いただき、予約を確定してください
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        <LinkButton href="/" size="lg" className="w-full min-h-[44px]">
          トップに戻る
        </LinkButton>
        <Link
          href={`/matches/${requestId}`}
          className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          他の演奏家も見る
        </Link>
      </div>
    </div>
  );
}
