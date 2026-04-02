"use client";

// /request/review — shows a summary of the submitted request and links to candidate list.
// Reads a RequestDraft from sessionStorage written by RequestFormWizard on submit.
// Falls back to mock req-004 when no draft is present (direct nav, demo scenario entry, etc.)
// TODO Phase 1: receive a real requestId from Supabase insert; remove sessionStorage draft logic.

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, MapPin, Clock, Music2, FlaskConical } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { labelEventType, labelGenre, formatDate, formatTime, formatDuration } from "@/lib/format";
import { MOCK_REQUESTS } from "@/lib/mock";
import { readRequestDraft, clearRequestDraft } from "@/lib/request-draft";
import type { RequestDraft } from "@/lib/types";

// Fallback mock used when no draft is present
const FALLBACK_REQUEST_ID = "req-004";

// Normalise a RequestDraft into the shape the template needs
interface DisplayRequest {
  eventType: RequestDraft["eventType"];
  eventDate: string;
  eventTime: string;
  durationHours: number;
  venueName: string;
  venueNeighborhood: string;
  preferredGenres: RequestDraft["preferredGenres"];
  budgetPerHour: number | null;
  /** requestId to use for the candidates CTA link */
  candidatesRequestId: string;
}

function draftToDisplay(draft: RequestDraft): DisplayRequest {
  return {
    eventType: draft.eventType,
    eventDate: draft.eventDate,
    eventTime: draft.eventTime,
    durationHours: draft.durationHours,
    venueName: draft.venueName,
    venueNeighborhood: draft.venueNeighborhood,
    preferredGenres: draft.preferredGenres,
    budgetPerHour: draft.budgetPerHour,
    // TODO Phase 1: use the real inserted requestId returned by Supabase
    candidatesRequestId: FALLBACK_REQUEST_ID,
  };
}

export default function RequestReviewPage() {
  // null = not yet resolved (hydrating); undefined = no draft found
  const [display, setDisplay] = useState<DisplayRequest | null | undefined>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const draft = readRequestDraft();
    if (draft) {
      setDisplay(draftToDisplay(draft));
      setIsFallback(false);
      // Keep the draft alive until user navigates away from this page
    } else {
      // No draft — use mock fallback
      const mock = MOCK_REQUESTS.find((r) => r.id === FALLBACK_REQUEST_ID);
      if (mock) {
        setDisplay({
          eventType: mock.eventType,
          eventDate: mock.eventDate,
          eventTime: mock.eventTime,
          durationHours: mock.durationHours,
          venueName: mock.venueName,
          venueNeighborhood: mock.venueNeighborhood,
          preferredGenres: mock.preferredGenres,
          budgetPerHour: mock.budgetPerHour,
          candidatesRequestId: mock.id,
        });
        setIsFallback(true);
      } else {
        setDisplay(undefined);
      }
    }

    // Clear draft when the user leaves this page
    return () => {
      clearRequestDraft();
    };
  }, []);

  // Hydrating — render nothing to avoid flicker
  if (display === null) return null;

  // Draft and mock both missing — should never happen in Phase 0
  if (display === undefined) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">リクエスト情報を取得できませんでした。</p>
        <Link href="/request/new" className="mt-4 inline-block text-sm text-primary underline">
          フォームに戻る
        </Link>
      </div>
    );
  }

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

      {/* Fallback notice — only shown when no real draft exists */}
      {isFallback && (
        <div className="mt-5 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <FlaskConical className="size-3.5 shrink-0" />
          サンプルデータを表示しています。フォームから送信するとご入力内容が反映されます。
        </div>
      )}

      {/* Summary card */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 text-left">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          リクエスト内容
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-lg">🎵</span>
            <div>
              <dt className="text-xs text-muted-foreground">イベント種別</dt>
              <dd className="font-medium">{labelEventType(display.eventType)}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <div>
              <dt className="text-xs text-muted-foreground">日時・演奏時間</dt>
              <dd className="font-medium">
                {formatDate(display.eventDate)} {formatTime(display.eventTime)} ／{" "}
                {formatDuration(display.durationHours)}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-muted-foreground shrink-0" />
            <div>
              <dt className="text-xs text-muted-foreground">会場</dt>
              <dd className="font-medium">
                {display.venueName
                  ? `${display.venueName}（${display.venueNeighborhood}）`
                  : display.venueNeighborhood}
              </dd>
            </div>
          </div>
          {display.preferredGenres.length > 0 && (
            <div className="flex items-start gap-3">
              <Music2 className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <dt className="text-xs text-muted-foreground">ジャンル希望</dt>
                <dd className="font-medium">{display.preferredGenres.map(labelGenre).join("・")}</dd>
              </div>
            </div>
          )}
          {display.budgetPerHour && (
            <div className="flex items-center gap-3">
              <span className="text-lg">💴</span>
              <div>
                <dt className="text-xs text-muted-foreground">ご予算</dt>
                <dd className="font-medium">
                  〜¥{display.budgetPerHour.toLocaleString("ja-JP")} / 時間
                </dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-3">
        <LinkButton
          href={`/matches/${display.candidatesRequestId}`}
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
