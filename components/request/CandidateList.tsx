"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { MusicianCard } from "@/components/musicians/MusicianCard";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import { labelGenre } from "@/lib/format";
import type { Musician, Genre, AvailabilityStatus } from "@/lib/types";

interface CandidateListProps {
  musicians: Musician[];
  requestId: string;
  preferredGenres: Genre[];
}

const AVAILABILITY_FILTERS: { value: AvailabilityStatus | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "available_today", label: "急ぎ対応可" },
  { value: "available_this_week", label: "今週対応可" },
  { value: "available_weekend", label: "今週末対応可" },
];

const SORT_OPTIONS = [
  { value: "availability", label: "対応スピード順" },
  { value: "bookings", label: "予約実績順" },
  { value: "price_asc", label: "料金が安い順" },
  { value: "price_desc", label: "料金が高い順" },
] as const;

type SortKey = typeof SORT_OPTIONS[number]["value"];

const AVAILABILITY_ORDER: Record<AvailabilityStatus, number> = {
  available_today: 0,
  available_this_week: 1,
  available_weekend: 2,
  contact_required: 3,
};

export function CandidateList({ musicians, requestId, preferredGenres }: CandidateListProps) {
  const [availFilter, setAvailFilter] = useState<AvailabilityStatus | "all">("all");
  const [genreFilter, setGenreFilter] = useState<Genre | "all">("all");
  const [sort, setSort] = useState<SortKey>("availability");
  const [showFilters, setShowFilters] = useState(false);

  // Collect all genres present in the musician list
  const allGenres = useMemo(() => {
    const set = new Set<Genre>();
    musicians.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [musicians]);

  const filtered = useMemo(() => {
    let list = [...musicians];

    if (availFilter !== "all") {
      list = list.filter((m) => m.availabilityStatus === availFilter);
    }
    if (genreFilter !== "all") {
      list = list.filter((m) => m.genres.includes(genreFilter));
    }

    list.sort((a, b) => {
      if (sort === "availability") {
        return AVAILABILITY_ORDER[a.availabilityStatus] - AVAILABILITY_ORDER[b.availabilityStatus];
      }
      if (sort === "bookings") return b.bookingCount - a.bookingCount;
      if (sort === "price_asc") return a.pricePerHour - b.pricePerHour;
      if (sort === "price_desc") return b.pricePerHour - a.pricePerHour;
      return 0;
    });

    return list;
  }, [musicians, availFilter, genreFilter, sort]);

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="mb-6">
        {/* Mobile: toggle */}
        <div className="flex items-center justify-between sm:hidden mb-3">
          <span className="text-sm text-muted-foreground">{filtered.length}名が条件に一致</span>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm"
          >
            <SlidersHorizontal className="size-3.5" />
            絞り込み
          </button>
        </div>

        {/* Filter panel */}
        <div className={cn("space-y-3", !showFilters && "hidden sm:block")}>
          {/* Availability pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">空き状況:</span>
            {AVAILABILITY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setAvailFilter(f.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors min-h-[32px]",
                  availFilter === f.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Genre pills — show preferred genres first */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">ジャンル:</span>
            <button
              onClick={() => setGenreFilter("all")}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors min-h-[32px]",
                genreFilter === "all"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              すべて
            </button>
            {[...preferredGenres, ...allGenres.filter((g) => !preferredGenres.includes(g))].map((g) => (
              <button
                key={g}
                onClick={() => setGenreFilter(g)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors min-h-[32px]",
                  genreFilter === g
                    ? "border-foreground bg-foreground text-background"
                    : preferredGenres.includes(g)
                    ? "border-primary/50 text-primary bg-primary/5 hover:bg-primary/10"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {labelGenre(g)}
                {preferredGenres.includes(g) && <span className="ml-1 text-primary">★</span>}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div className="flex items-center justify-between gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {filtered.length}名が条件に一致
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-8 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="並び替え"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <EmptyState
          title="条件に合う演奏家が見つかりませんでした"
          description="絞り込み条件を変更してお試しください。"
          action={
            <button
              onClick={() => { setAvailFilter("all"); setGenreFilter("all"); }}
              className="text-sm text-primary hover:underline"
            >
              条件をリセット
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MusicianCard key={m.id} musician={m} requestId={requestId} />
          ))}
        </div>
      )}
    </div>
  );
}
