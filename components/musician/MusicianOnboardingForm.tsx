"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { labelGenre, labelInstrument } from "@/lib/format";
import type { Genre, Instrument } from "@/lib/types";

// TODO Phase 1: POST form data to Supabase musicians table (pending_review status)

const ALL_INSTRUMENTS: Instrument[] = [
  "piano", "violin", "guitar", "saxophone", "harp",
  "cello", "vocal", "bass", "flute", "keyboard", "trumpet",
];
const ALL_GENRES: Genre[] = [
  "jazz", "classical", "bossa_nova", "pop", "acoustic",
  "latin", "soul", "flamenco", "lounge",
];
const ENSEMBLE_TYPES = ["ソロ", "デュオ", "トリオ", "カルテット", "その他"];
const NEIGHBORHOODS = [
  "港区", "渋谷区", "新宿区", "千代田区", "中央区",
  "品川区", "目黒区", "世田谷区", "台東区", "墨田区",
  "江東区", "文京区", "豊島区", "中野区", "杉並区",
];
const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=200&h=200&fit=crop",
];

interface OnboardingForm {
  name: string;
  nameKana: string;
  tagline: string;
  bio: string;
  instruments: Instrument[];
  genres: Genre[];
  ensembleType: string;
  neighborhood: string;
  pricePerHour: string;
  avatarUrl: string;
}

function ChipMulti<T extends string>({
  options,
  selected,
  onToggle,
  labelFn,
}: {
  options: T[];
  selected: T[];
  onToggle: (v: T) => void;
  labelFn: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors min-h-[36px]",
            selected.includes(opt)
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

export function MusicianOnboardingForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingForm, string>>>({});
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    nameKana: "",
    tagline: "",
    bio: "",
    instruments: [],
    genres: [],
    ensembleType: "",
    neighborhood: "",
    pricePerHour: "",
    avatarUrl: "",
  });

  function update<K extends keyof OnboardingForm>(key: K, value: OnboardingForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function toggleArr<T>(key: "instruments" | "genres", val: T) {
    const arr = form[key] as T[];
    const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
    update(key, next as OnboardingForm[typeof key]);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof OnboardingForm, string>> = {};
    if (!form.name.trim()) e.name = "お名前を入力してください";
    if (!form.tagline.trim()) e.tagline = "キャッチコピーを入力してください";
    if (!form.bio.trim()) e.bio = "プロフィール文を入力してください";
    if (form.instruments.length === 0) e.instruments = "楽器を1つ以上選択してください";
    if (form.genres.length === 0) e.genres = "ジャンルを1つ以上選択してください";
    if (!form.ensembleType) e.ensembleType = "編成を選択してください";
    if (!form.neighborhood) e.neighborhood = "拠点エリアを選択してください";
    if (!form.pricePerHour) e.pricePerHour = "料金の目安を入力してください";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // TODO Phase 1: POST to Supabase
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-xl font-semibold">登録申請を受け付けました</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          スタッフが内容を確認し、3営業日以内にメールでご連絡します。審査通過後にプロフィールが公開されます。
        </p>
        <button
          className="mt-6 text-sm text-primary hover:underline"
          onClick={() => router.push("/")}
        >
          トップに戻る
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar picker */}
      <Field label="プロフィール写真（プリセットから選択）">
        <div className="flex flex-wrap gap-3">
          {AVATAR_PRESETS.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => update("avatarUrl", url)}
              className={cn(
                "relative overflow-hidden rounded-full transition-all",
                form.avatarUrl === url
                  ? "ring-2 ring-foreground ring-offset-2"
                  : "ring-1 ring-border hover:ring-foreground/50"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="アバター候補" className="size-16 object-cover" />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {/* TODO Phase 1: real file upload via Supabase Storage */}
          ※ 本番では実際の写真をアップロードできます
        </p>
      </Field>

      {/* Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="お名前" required error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="田中 誠"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
        <Field label="フリガナ">
          <input
            type="text"
            value={form.nameKana}
            onChange={(e) => update("nameKana", e.target.value)}
            placeholder="タナカ マコト"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
      </div>

      {/* Tagline */}
      <Field label="キャッチコピー（40文字以内）" required error={errors.tagline}>
        <input
          type="text"
          value={form.tagline}
          maxLength={40}
          onChange={(e) => update("tagline", e.target.value)}
          placeholder="ホテルラウンジを得意とするジャズピアニスト"
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-right text-xs text-muted-foreground">{form.tagline.length}/40</span>
      </Field>

      {/* Bio */}
      <Field label="プロフィール文" required error={errors.bio}>
        <textarea
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          rows={4}
          placeholder="経歴・得意なジャンル・対応できるイベント種別などをご記入ください"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </Field>

      {/* Instruments */}
      <Field label="楽器編成" required error={errors.instruments}>
        <ChipMulti
          options={ALL_INSTRUMENTS}
          selected={form.instruments}
          onToggle={(v) => toggleArr("instruments", v)}
          labelFn={labelInstrument}
        />
      </Field>

      {/* Genres */}
      <Field label="ジャンル" required error={errors.genres}>
        <ChipMulti
          options={ALL_GENRES}
          selected={form.genres}
          onToggle={(v) => toggleArr("genres", v)}
          labelFn={labelGenre}
        />
      </Field>

      {/* Ensemble type + Neighborhood */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="編成" required error={errors.ensembleType}>
          <select
            value={form.ensembleType}
            onChange={(e) => update("ensembleType", e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">選択してください</option>
            {ENSEMBLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="拠点エリア" required error={errors.neighborhood}>
          <select
            value={form.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">選択してください</option>
            {NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
      </div>

      {/* Price */}
      <Field label="料金の目安（1時間あたり・円）" required error={errors.pricePerHour}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">¥</span>
          <input
            type="number"
            value={form.pricePerHour}
            onChange={(e) => update("pricePerHour", e.target.value)}
            min={5000}
            step={1000}
            placeholder="20000"
            className="h-10 w-full rounded-lg border border-border bg-background pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <p className="text-xs text-muted-foreground">正式な料金はご予約後に個別でご相談いただけます</p>
      </Field>

      <Button type="submit" className="w-full min-h-[44px] text-base">
        登録申請を送る
      </Button>
    </form>
  );
}
