"use client";

// 7-column × 3-row weekly availability grid
// No external calendar library — pure toggles stored in local state
// TODO Phase 1: persist slots to Supabase availability_slots table

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_AVAILABILITY } from "@/lib/mock";
import { useMockSession } from "@/context/mock-session";
import type { TimeSlot } from "@/lib/types";

const TIME_SLOTS: { key: TimeSlot; label: string; range: string }[] = [
  { key: "morning", label: "午前", range: "9:00〜12:00" },
  { key: "afternoon", label: "午後", range: "12:00〜18:00" },
  { key: "evening", label: "夜", range: "18:00〜23:00" },
];

const DAY_LABELS = ["今日", "明日", "2日後", "3日後", "4日後", "5日後", "6日後"];

function getDateFromOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

type SlotKey = `${string}__${TimeSlot}`;

function makeKey(date: string, slot: TimeSlot): SlotKey {
  return `${date}__${slot}`;
}

export function AvailabilityEditor() {
  const { user } = useMockSession();
  const musicianId = user.musicianId ?? "m-001";

  // Seed initial state from mock data
  const initialSlots = () => {
    const map = new Map<SlotKey, boolean>();
    MOCK_AVAILABILITY.filter((s) => s.musicianId === musicianId).forEach((s) => {
      map.set(makeKey(s.date, s.timeSlot), s.isAvailable);
    });
    // Fill remaining 7 days × 3 slots with false if not in mock
    for (let i = 0; i < 7; i++) {
      const date = getDateFromOffset(i);
      TIME_SLOTS.forEach(({ key }) => {
        const k = makeKey(date, key);
        if (!map.has(k)) map.set(k, false);
      });
    }
    return map;
  };

  const [slots, setSlots] = useState<Map<SlotKey, boolean>>(initialSlots);
  const [saved, setSaved] = useState(false);

  function toggle(date: string, slot: TimeSlot) {
    setSaved(false);
    setSlots((prev) => {
      const next = new Map(prev);
      const k = makeKey(date, slot);
      next.set(k, !next.get(k));
      return next;
    });
  }

  function handleSave() {
    // TODO Phase 1: upsert to Supabase availability_slots
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const dates = Array.from({ length: 7 }, (_, i) => ({
    offset: i,
    date: getDateFromOffset(i),
    label: DAY_LABELS[i],
    shortDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    })(),
  }));

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-4 rounded bg-foreground" />
          演奏可能
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-4 rounded border border-border bg-background" />
          対応不可
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-16 pb-2 text-left text-xs text-muted-foreground">時間帯</th>
              {dates.map(({ label, shortDate, offset }) => (
                <th key={offset} className="pb-2 text-center text-xs">
                  <span className={cn("font-medium", offset === 0 ? "text-foreground" : "text-muted-foreground")}>
                    {label}
                  </span>
                  <br />
                  <span className="text-muted-foreground/60">{shortDate}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TIME_SLOTS.map(({ key: slot, label, range }) => (
              <tr key={slot}>
                <td className="py-2 pr-3 text-xs">
                  <p className="font-medium">{label}</p>
                  <p className="text-muted-foreground/70">{range}</p>
                </td>
                {dates.map(({ date }) => {
                  const isAvail = slots.get(makeKey(date, slot)) ?? false;
                  return (
                    <td key={date} className="py-2 text-center">
                      <button
                        type="button"
                        onClick={() => toggle(date, slot)}
                        aria-label={`${label} ${date} ${isAvail ? "対応可" : "対応不可"}`}
                        aria-pressed={isAvail}
                        className={cn(
                          "mx-auto flex size-9 items-center justify-center rounded-lg transition-colors",
                          isAvail
                            ? "bg-foreground text-background hover:bg-foreground/80"
                            : "border border-border bg-background text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {isAvail ? "○" : "−"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="min-h-[44px]">
          {saved ? "保存しました" : "空き状況を保存する"}
        </Button>
        {saved && <CheckCircle2 className="size-5 text-emerald-600" />}
      </div>

      <p className="text-xs text-muted-foreground">
        ※ 更新した空き状況は主催者の検索結果に反映されます
      </p>
    </div>
  );
}
