"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventType, Genre } from "@/lib/types";
import { labelEventType, labelGenre } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  eventType: EventType | "";
  eventDate: string;
  eventTime: string;
  durationHours: number | "";
  venueNeighborhood: string;
  budgetPerHour: number | "";
  preferredGenres: Genre[];
  notes: string;
}

const INITIAL: FormData = {
  eventType: "",
  eventDate: "",
  eventTime: "",
  durationHours: "",
  venueNeighborhood: "",
  budgetPerHour: "",
  preferredGenres: [],
  notes: "",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES: EventType[] = ["corporate", "restaurant", "hotel_lounge", "private_party"];

const NEIGHBORHOODS = [
  "港区", "渋谷区", "新宿区", "千代田区", "中央区",
  "品川区", "目黒区", "世田谷区", "台東区", "墨田区",
  "江東区", "文京区", "豊島区", "中野区", "杉並区",
];

const GENRES: Genre[] = ["jazz", "classical", "bossa_nova", "pop", "acoustic", "latin", "soul", "flamenco", "lounge"];

const DURATIONS = ["1", "1.5", "2", "2.5", "3", "4"] as const;
type DurationStr = typeof DURATIONS[number];

const BUDGET_OPTIONS = [
  { label: "指定なし", value: "" },
  { label: "〜¥15,000/h", value: 15000 },
  { label: "〜¥20,000/h", value: 20000 },
  { label: "〜¥30,000/h", value: 30000 },
  { label: "〜¥40,000/h", value: 40000 },
  { label: "¥40,000/h〜", value: 40001 },
];

// ─── Step indicators ──────────────────────────────────────────────────────────

const STEPS = ["イベント情報", "日時・場所", "ご希望・予算"] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i < current
                  ? "bg-foreground text-background"
                  : i === current
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span className={cn("hidden text-xs sm:block", i === current ? "text-foreground font-medium" : "text-muted-foreground")}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("mb-4 h-px w-8 sm:w-12", i < current ? "bg-foreground" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Chip selector ────────────────────────────────────────────────────────────

function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  labelFn,
  multi = false,
  className,
}: {
  options: T[];
  selected: string | string[];
  onToggle: (v: T) => void;
  labelFn: (v: T) => string;
  multi?: boolean;
  className?: string;
}) {
  const isSelected = (v: T) =>
    multi
      ? (selected as string[]).includes(v)
      : selected === v;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors min-h-[36px]",
            isSelected(opt)
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground hover:bg-muted"
          )}
        >
          {labelFn(opt)}
        </button>
      ))}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export function RequestFormWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleGenre(g: Genre) {
    setForm((prev) => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(g)
        ? prev.preferredGenres.filter((x) => x !== g)
        : [...prev.preferredGenres, g],
    }));
  }

  function validateStep(s: number): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 0) {
      if (!form.eventType) errs.eventType = "イベント種別を選択してください";
    }
    if (s === 1) {
      if (!form.eventDate) errs.eventDate = "日付を入力してください";
      if (!form.eventTime) errs.eventTime = "開始時刻を入力してください";
      if (!form.durationHours) errs.durationHours = "演奏時間を選択してください";
      if (!form.venueNeighborhood) errs.venueNeighborhood = "エリアを選択してください";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
  }

  function handleSubmit() {
    // TODO Phase 1: POST to Supabase booking_requests table
    router.push("/request/review");
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">演奏家を探す</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          条件を入力すると、対応可能な演奏家の候補が表示されます
        </p>
      </div>

      <StepIndicator current={step} />

      {/* ─── Step 0: Event type ─── */}
      {step === 0 && (
        <div className="space-y-6">
          <Field label="イベント種別" required error={errors.eventType}>
            <ChipGroup
              options={EVENT_TYPES}
              selected={form.eventType}
              onToggle={(v) => update("eventType", v)}
              labelFn={labelEventType}
            />
          </Field>
        </div>
      )}

      {/* ─── Step 1: Date, time, venue ─── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="開催日" required error={errors.eventDate}>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="開催日"
              />
            </Field>
            <Field label="開始時刻" required error={errors.eventTime}>
              <input
                type="time"
                value={form.eventTime}
                onChange={(e) => update("eventTime", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="開始時刻"
              />
            </Field>
          </div>

          <Field label="演奏時間" required error={errors.durationHours}>
            <ChipGroup<DurationStr>
              options={[...DURATIONS]}
              selected={form.durationHours === "" ? "" : String(form.durationHours)}
              onToggle={(v) => update("durationHours", Number(v))}
              labelFn={(v) => `${v}時間`}
            />
          </Field>

          <Field label="会場エリア（東京都内）" required error={errors.venueNeighborhood}>
            <select
              value={form.venueNeighborhood}
              onChange={(e) => update("venueNeighborhood", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="会場エリア"
            >
              <option value="">エリアを選択</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {/* ─── Step 2: Genre, budget, notes ─── */}
      {step === 2 && (
        <div className="space-y-5">
          <Field label="ジャンルのご希望（複数選択可）">
            <ChipGroup
              options={GENRES}
              selected={form.preferredGenres}
              onToggle={toggleGenre}
              labelFn={labelGenre}
              multi
            />
            <p className="text-xs text-muted-foreground">選択しない場合はすべてのジャンルが対象になります</p>
          </Field>

          <Field label="ご予算（1時間あたり）">
            <select
              value={String(form.budgetPerHour)}
              onChange={(e) => update("budgetPerHour", e.target.value === "" ? "" : Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="ご予算"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
              ))}
            </select>
          </Field>

          <Field label="その他ご要望（任意）">
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="雰囲気や曲のご要望、その他ご注意点などをご記入ください"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              aria-label="その他ご要望"
            />
          </Field>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="outline" onClick={handleBack} className="min-h-[44px] gap-1">
            <ChevronLeft className="size-4" />
            戻る
          </Button>
        ) : (
          <div />
        )}

        {step < 2 ? (
          <Button onClick={handleNext} className="min-h-[44px] gap-1.5">
            次へ
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="min-h-[44px] px-6">
            候補を確認する
            <ArrowRight className="size-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Progress hint */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        ステップ {step + 1} / {STEPS.length}
      </p>
    </div>
  );
}
