// Formatting utilities for match-skills

import type { EventType, Genre, Instrument, RequestStatus, OfferStatus, AvailabilityStatus } from "./types";

export function formatPrice(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP")}`;
}

export function formatPricePerHour(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP")} / 時間`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatTime(timeStr: string): string {
  // timeStr is "HH:MM"
  return timeStr;
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}時間`;
  if (h === 0) return `${m}分`;
  return `${h}時間${m}分`;
}

// Shared Tailwind class map for request status badges — use in admin pages and anywhere status is displayed
export const REQUEST_STATUS_STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  shortlisted: "bg-blue-100 text-blue-700",
  offers_sent: "bg-violet-100 text-violet-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-muted text-muted-foreground",
};

// Shared Tailwind class map for offer status badges
export const OFFER_STATUS_STYLES: Record<OfferStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  held: "bg-blue-50 text-blue-700",
  declined: "bg-muted text-muted-foreground",
};

export function labelEventType(t: EventType): string {
  const map: Record<EventType, string> = {
    corporate: "企業イベント",
    restaurant: "レストラン",
    hotel_lounge: "ホテルラウンジ",
    private_party: "プライベートパーティー",
  };
  return map[t];
}

export function labelGenre(g: Genre): string {
  const map: Record<Genre, string> = {
    jazz: "ジャズ",
    classical: "クラシック",
    bossa_nova: "ボサノバ",
    pop: "ポップス",
    acoustic: "アコースティック",
    latin: "ラテン",
    soul: "ソウル",
    flamenco: "フラメンコ",
    lounge: "ラウンジ",
  };
  return map[g];
}

export function labelInstrument(i: Instrument): string {
  const map: Record<Instrument, string> = {
    piano: "ピアノ",
    violin: "ヴァイオリン",
    guitar: "ギター",
    saxophone: "サックス",
    harp: "ハープ",
    cello: "チェロ",
    vocal: "ヴォーカル",
    bass: "ベース",
    flute: "フルート",
    keyboard: "キーボード",
    trumpet: "トランペット",
  };
  return map[i];
}

export function labelRequestStatus(s: RequestStatus): string {
  const map: Record<RequestStatus, string> = {
    pending: "対応待ち",
    shortlisted: "候補選定中",
    offers_sent: "オファー送付済み",
    confirmed: "確定済み",
    cancelled: "キャンセル",
  };
  return map[s];
}

export function labelOfferStatus(s: OfferStatus): string {
  const map: Record<OfferStatus, string> = {
    pending: "返答待ち",
    accepted: "承諾済み",
    held: "保留中",
    declined: "辞退",
  };
  return map[s];
}

export function labelAvailabilityStatus(s: AvailabilityStatus): string {
  const map: Record<AvailabilityStatus, string> = {
    available_today: "急ぎ対応可",
    available_this_week: "今週対応可",
    available_weekend: "今週末対応可",
    contact_required: "要日程相談",
  };
  return map[s];
}
