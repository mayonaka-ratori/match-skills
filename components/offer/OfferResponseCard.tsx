"use client";

// TODO Phase 1: PATCH offer status in Supabase, trigger organizer notification

import { useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// labelOfferStatus available from "@/lib/format" — used in Phase 1 admin views
import type { Offer, OfferStatus } from "@/lib/types";

interface OfferResponseCardProps {
  offer: Offer;
}

const STATUS_CONFIG: Record<
  OfferStatus,
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  pending: {
    icon: <Clock className="size-5" />,
    label: "返答待ち",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  accepted: {
    icon: <CheckCircle2 className="size-5" />,
    label: "承諾済み",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  held: {
    icon: <Clock className="size-5" />,
    label: "保留中",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  declined: {
    icon: <XCircle className="size-5" />,
    label: "辞退",
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
  },
};

export function OfferResponseCard({ offer }: OfferResponseCardProps) {
  const [status, setStatus] = useState<OfferStatus>(offer.status);
  const [confirming, setConfirming] = useState<OfferStatus | null>(null);

  const config = STATUS_CONFIG[status];

  function handleResponse(next: OfferStatus) {
    // TODO Phase 1: PATCH /api/offers/[id] with new status
    setStatus(next);
    setConfirming(null);
  }

  if (status !== "pending") {
    return (
      <div className={cn("rounded-xl border p-6 text-center", config.bg)}>
        <div className={cn("mb-3 flex justify-center", config.color)}>{config.icon}</div>
        <p className={cn("text-lg font-semibold", config.color)}>{config.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {status === "accepted" && "ご承諾ありがとうございます。担当者から詳細をご連絡します。"}
          {status === "held" && "保留を承りました。開催日の3日前までに最終的なご回答をお願いします。"}
          {status === "declined" && "ご辞退の意思を受け付けました。またの機会をお待ちしております。"}
        </p>
        {(status === "held" || status === "declined") && (
          <button
            onClick={() => setStatus("pending")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            返答をやり直す
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-center text-muted-foreground">
        このオファーへの返答を選択してください
      </h2>

      {/* Accept */}
      <div className="rounded-xl border border-border p-4">
        {confirming === "accepted" ? (
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium">このオファーを承諾しますか？</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => setConfirming(null)}
              >
                キャンセル
              </Button>
              <Button
                className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleResponse("accepted")}
              >
                承諾する
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-emerald-700">承諾する</p>
              <p className="text-xs text-muted-foreground">
                担当者から詳細と会場情報をご連絡します
              </p>
            </div>
            <Button
              className="shrink-0 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setConfirming("accepted")}
            >
              <CheckCircle2 className="mr-1.5 size-4" />
              承諾する
            </Button>
          </div>
        )}
      </div>

      {/* Hold */}
      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-blue-700">保留にする</p>
            <p className="text-xs text-muted-foreground">
              検討中です。開催日の3日前までにお知らせください
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 min-h-[44px] border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => handleResponse("held")}
          >
            <Clock className="mr-1.5 size-4" />
            保留
          </Button>
        </div>
      </div>

      {/* Decline */}
      <div className="rounded-xl border border-border p-4">
        {confirming === "declined" ? (
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium">このオファーを辞退しますか？</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => setConfirming(null)}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                className="flex-1 min-h-[44px]"
                onClick={() => handleResponse("declined")}
              >
                辞退する
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-muted-foreground">お断りする</p>
              <p className="text-xs text-muted-foreground">
                この日程・条件には対応できません
              </p>
            </div>
            <Button
              variant="ghost"
              className="shrink-0 min-h-[44px] text-muted-foreground hover:text-destructive"
              onClick={() => setConfirming("declined")}
            >
              <XCircle className="mr-1.5 size-4" />
              お断り
            </Button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        ご不明点は matchskills 担当者までお気軽にお問い合わせください
      </p>
    </div>
  );
}
