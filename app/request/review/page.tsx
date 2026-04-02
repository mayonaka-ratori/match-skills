"use client";

// /request/review — shows a summary of the submitted request and links to candidate list.
// In Phase 0 this uses a hardcoded mock request (req-004 = just-submitted/pending).
// TODO Phase 1: read real request id from session/URL and fetch from Supabase.

import Link from "next/link";
import { CheckCircle2, ArrowRight, MapPin, Clock, Music2 } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { labelEventType, labelGenre, formatDate, formatTime, formatDuration } from "@/lib/format";
import { MOCK_REQUESTS } from "@/lib/mock";

export default function RequestReviewPage() {
  // Phase 0: always show req-004 (just submitted, pending state)
  const req = MOCK_REQUESTS.find((r) => r.id === "req-004")!;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 pb-24 text-center">
      {/* Success icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold">リクエストを受け付けました</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        内容を確認して、ご希望の演奏家を選んでください。
      </p>

      {/* Summary card */}
      <div className="mt-8 rounded-xl border border-border bg-card p-5 text-left">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          リクエスト内容
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-lg">�</span>
            <div>
              <dt className="text-xs text-muted-foreground">イベント種別</dt>
              <dd className="font-medium">{labelEventType(req.eventType)}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <div>
              <dt className="text-xs text-muted-foreground">日時・演奏時間</dt>
              <dd className="font-medium">
                {formatDate(req.eventDate)} {formatTime(req.eventTime)} ／{" "}
                {formatDuration(req.durationHours)}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-muted-foreground shrink-0" />
            <div>
              <dt className="text-xs text-muted-foreground">会場</dt>
              <dd className="font-medium">
                {req.venueName ? `${req.venueName}（${req.venueNeighborhood}）` : req.venueNeighborhood}
              </dd>
            </div>
          </div>
          {req.preferredGenres.length > 0 && (
            <div className="flex items-start gap-3">
              <Music2 className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <dt className="text-xs text-muted-foreground">ジャンル希望</dt>
                <dd className="font-medium">{req.preferredGenres.map(labelGenre).join("・")}</dd>
              </div>
            </div>
          )}
          {req.budgetPerHour && (
            <div className="flex items-center gap-3">
              <span className="text-lg">💴</span>
              <div>
                <dt className="text-xs text-muted-foreground">ご予算</dt>
                <dd className="font-medium">〜¥{req.budgetPerHour.toLocaleString("ja-JP")} / 時間</dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-3">
        <LinkButton
          href={`/matches/${req.id}`}
          size="lg"
          className="w-full min-h-[44px] text-base"
        >
          候補の演奏家を見る
          <ArrowRight className="ml-2 size-4" />
        </LinkButton>
        <Link
          href="/request/new"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 条件を変更する
        </Link>
      </div>
    </div>
  );
}
