// /musicians/[slug] — musician detail page
// Server component: reads from mock data
// Accepts optional ?requestId= search param to maintain organizer flow continuity
// TODO Phase 1: fetch from Supabase by slug

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Clock, Star, Zap, Music2, Users, CheckCircle2
} from "lucide-react";
import { MOCK_MUSICIANS } from "@/lib/mock";
import {
  formatPricePerHour, labelGenre, labelInstrument, labelEventType,
} from "@/lib/format";
import { AvailabilityBadge } from "@/components/musicians/AvailabilityBadge";
import { LinkButton } from "@/components/ui/link-button";

export default async function MusicianDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ requestId?: string }>;
}) {
  const { slug } = await params;
  const { requestId } = await searchParams;
  const musician = MOCK_MUSICIANS.find((m) => m.slug === slug);
  if (!musician) notFound();

  // Back link: return to the candidate list for this request if we came from one
  const backHref = requestId ? `/matches/${requestId}` : "/";
  const backLabel = requestId ? "候補一覧に戻る" : "トップに戻る";

  // Booking CTA target: requires requestId — fall back to review so demo never 404s
  // TODO Phase 1: requestId always present (comes from real session)
  const confirmHref = requestId
    ? `/booking/confirm/${requestId}/${musician.id}`
    : `/booking/confirm/req-001/${musician.id}`;

  return (
    <div className="pb-28">
      {/* ── Hero ── */}
      <div className="relative h-64 w-full overflow-hidden bg-muted sm:h-80 lg:h-96">
        {musician.photoUrl ? (
          <Image
            src={musician.photoUrl}
            alt={musician.name}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Music2 className="size-16 text-muted-foreground" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        {/* Back link */}
        <Link
          href={backHref}
          className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1.5 text-sm backdrop-blur transition-colors hover:bg-background"
        >
          ← {backLabel}
        </Link>
        {/* Availability badge overlay */}
        <div className="absolute bottom-4 left-4">
          <AvailabilityBadge
            status={musician.availabilityStatus}
            label={musician.availabilityLabel}
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-3xl px-4">
        {/* Name + tagline */}
        <div className="mt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{musician.name}</h1>
              {musician.nameKana && (
                <p className="text-sm text-muted-foreground">{musician.nameKana}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{musician.ensembleType}</p>
            </div>
            {musician.isCurated && (
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                公認演奏家
              </div>
            )}
          </div>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">{musician.tagline}</p>
        </div>

        {/* Trust signals row */}
        <div className="mt-5 flex flex-wrap gap-3">
          {musician.responseLabel && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <Zap className="size-3" />
              {musician.responseLabel}
            </span>
          )}
          {musician.popularityLabel && (
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Users className="size-3" />
              {musician.popularityLabel}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <CheckCircle2 className="size-3" />
            予約実績 {musician.bookingCount}件
          </span>
        </div>

        {/* Divider */}
        <hr className="my-6 border-border" />

        {/* Two-column details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Left: bio + genres */}
          <div className="space-y-5">
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                プロフィール
              </h2>
              <p className="text-sm leading-relaxed">{musician.bio}</p>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                ジャンル
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {musician.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                  >
                    {labelGenre(g)}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                楽器編成
              </h2>
              <p className="text-sm">{musician.instruments.map(labelInstrument).join(" ／ ")}</p>
            </section>
          </div>

          {/* Right: price + area + events + tags */}
          <div className="space-y-5">
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                料金の目安
              </h2>
              <p className="text-xl font-bold">
                {formatPricePerHour(musician.pricePerHour)}
              </p>
              {musician.priceNote && (
                <p className="mt-1 text-xs text-muted-foreground">{musician.priceNote}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                ※ 目安料金です。正式なお見積もりは予約確定後にご案内します。
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                対応エリア
              </h2>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{musician.neighborhood}（拠点）</p>
                  <p className="mt-0.5 text-muted-foreground">
                    {musician.travelAreas.join("・")}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                対応イベント
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {musician.suitableEvents.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                  >
                    {labelEventType(e)}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                空き状況
              </h2>
              <div className="flex items-center gap-2">
                <AvailabilityBadge
                  status={musician.availabilityStatus}
                  label={musician.availabilityLabel}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                ※ 正確な日程は予約リクエスト後に担当スタッフが調整します
              </p>
            </section>
          </div>
        </div>

        {/* Tags */}
        {musician.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {musician.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Media placeholder */}
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <Music2 className="mx-auto mb-2 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">演奏サンプル・動画</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {/* TODO Phase 1: embed actual media */}
            近日公開予定
          </p>
        </div>
      </div>

      {/* ── Sticky booking CTA ── */}
      {/* bottom-20 on mobile clears the RoleSwitcher pill; bottom-16 on sm+ also clears it */}
      <div className="fixed bottom-20 left-0 right-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:bottom-16">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-medium">{musician.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatPricePerHour(musician.pricePerHour)}
            </p>
          </div>
          <LinkButton
            href={confirmHref}
            size="lg"
            className="shrink-0 min-h-[44px]"
          >
            予約を申し込む
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
