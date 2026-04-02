"use client";

// TODO Phase 1: persist shortlist to Supabase, trigger offer emails

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Send, MapPin, Zap, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPricePerHour, labelGenre } from "@/lib/format";
import { AvailabilityBadge } from "@/components/musicians/AvailabilityBadge";
import type { Musician, RequestStatus, Genre, AvailabilityStatus } from "@/lib/types";

const AVAILABILITY_ORDER: Record<AvailabilityStatus, number> = {
  available_today: 0,
  available_this_week: 1,
  available_weekend: 2,
  contact_required: 3,
};

interface AdminShortlistPanelProps {
  requestId: string;
  initialShortlisted: string[];
  allMusicians: Musician[];
  requestStatus: RequestStatus;
  preferredGenres?: Genre[];
}

export function AdminShortlistPanel({
  requestId,
  initialShortlisted,
  allMusicians,
  requestStatus,
  preferredGenres = [],
}: AdminShortlistPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialShortlisted));
  const [sent, setSent] = useState(requestStatus === "offers_sent" || requestStatus === "confirmed");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Sort: shortlisted first, then preferred-genre matches, then by availability speed
  const sortedMusicians = [...allMusicians].sort((a, b) => {
    const aShortlisted = initialShortlisted.includes(a.id) ? 0 : 1;
    const bShortlisted = initialShortlisted.includes(b.id) ? 0 : 1;
    if (aShortlisted !== bShortlisted) return aShortlisted - bShortlisted;
    const aGenreMatch = preferredGenres.length > 0 && a.genres.some((g) => preferredGenres.includes(g)) ? 0 : 1;
    const bGenreMatch = preferredGenres.length > 0 && b.genres.some((g) => preferredGenres.includes(g)) ? 0 : 1;
    if (aGenreMatch !== bGenreMatch) return aGenreMatch - bGenreMatch;
    return AVAILABILITY_ORDER[a.availabilityStatus] - AVAILABILITY_ORDER[b.availabilityStatus];
  });

  const displayMusicians = showAvailableOnly
    ? sortedMusicians.filter((m) => m.availabilityStatus !== "contact_required")
    : sortedMusicians;

  function toggle(musicianId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(musicianId)) next.delete(musicianId);
      else next.add(musicianId);
      return next;
    });
  }

  function handleSendOffers() {
    // TODO Phase 1: POST /api/offers — create offer records, send emails via Resend
    setSent(true);
  }

  const selectedCount = selected.size;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <h2 className="font-semibold">ショートリスト管理</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          オファーを送る演奏家にチェックを入れてください
        </p>
      </div>

      {/* Filter row */}
      <div className="border-b border-border px-4 py-2 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {displayMusicians.length}名表示中
          {preferredGenres.length > 0 && (
            <span className="ml-1 text-primary">
              · {preferredGenres.map(labelGenre).join("・")}希望
            </span>
          )}
        </span>
        <button
          onClick={() => setShowAvailableOnly((v) => !v)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs transition-colors",
            showAvailableOnly
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          空きありのみ表示
        </button>
      </div>

      {/* Musician list */}
      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
        {displayMusicians.map((musician) => {
          const isChecked = selected.has(musician.id);
          return (
            <div
              key={musician.id}
              className={cn(
                "flex items-start gap-3 p-3 transition-colors cursor-pointer",
                isChecked ? "bg-primary/5" : "hover:bg-muted/40"
              )}
              onClick={() => !sent && toggle(musician.id)}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                  isChecked
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background"
                )}
                aria-hidden="true"
              >
                {isChecked && <span className="text-[10px] font-bold">✓</span>}
              </div>

              {/* Photo */}
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                {musician.photoUrl ? (
                  <Image
                    src={musician.photoUrl}
                    alt={musician.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Music2 className="size-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{musician.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {musician.ensembleType}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  <span>{musician.neighborhood}</span>
                  {musician.responseLabel && (
                    <>
                      <span>·</span>
                      <Zap className="size-3 text-emerald-600" />
                      <span className="text-emerald-600">{musician.responseLabel}</span>
                    </>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <AvailabilityBadge
                    status={musician.availabilityStatus}
                    label={musician.availabilityLabel}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatPricePerHour(musician.pricePerHour)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {musician.genres.slice(0, 2).map((g) => (
                    <span key={g} className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {labelGenre(g)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: send button */}
      <div className="border-t border-border bg-muted/30 p-4">
        {sent ? (
          <div className="flex flex-col items-center gap-1 text-emerald-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              <span className="text-sm font-medium">
                {selectedCount}名にオファーを送付しました
              </span>
            </div>
            <p className="text-xs text-muted-foreground">演奏家の返答をお待ちください</p>
          </div>
        ) : (
          <>
            <Button
              onClick={handleSendOffers}
              disabled={selectedCount === 0}
              className="w-full min-h-[44px] gap-2"
            >
              <Send className="size-4" />
              {selectedCount > 0
                ? `${selectedCount}名にオファーを送る`
                : "演奏家を選択してください"}
            </Button>
            {selectedCount > 0 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                選択中: {[...selected].map(
                  (id) => allMusicians.find((m) => m.id === id)?.name
                ).filter(Boolean).join("、")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
