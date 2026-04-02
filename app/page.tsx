import Link from "next/link";
import { ArrowRight, Clock, Star, Users, Zap } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { MusicianCard } from "@/components/musicians/MusicianCard";
import { DemoScenarioPicker } from "@/components/common/DemoScenarioPicker";
import { MOCK_MUSICIANS } from "@/lib/mock";

export default function HomePage() {
  const featured = MOCK_MUSICIANS.filter((m) =>
    ["m-001", "m-002", "m-003"].includes(m.id)
  );

  return (
    <div className="pb-20">
      {/* ── Hero ── */}
      <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            東京限定 · 審査済みのプロ演奏家が即日対応
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            今夜の演奏家が、
            <br className="sm:hidden" />
            <span className="text-primary/80">すぐ見つかる。</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            企業イベント・レストラン・ホテルラウンジ・プライベートパーティー。
            <br />
            スタッフ審査済みのプロ演奏家を、最短当日でご手配します。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/request/new" size="lg" className="w-full sm:w-auto min-h-[44px] px-8 text-base">
              演奏家を探す
              <ArrowRight className="ml-2 size-4" />
            </LinkButton>
            <LinkButton href="/musician/onboarding" variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px] px-8 text-base">
              演奏家として登録する
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── Demo scenario picker ── */}
      <DemoScenarioPicker />

      {/* ── How it works ── */}
      <section className="border-b border-border py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-xl font-semibold">ご利用の流れ</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: <Clock className="size-6" />,
                step: "01",
                title: "条件を入力",
                desc: "イベント種別・日時・エリア・ご予算を2〜3分で入力。",
              },
              {
                icon: <Users className="size-6" />,
                step: "02",
                title: "候補を確認",
                desc: "条件に合った演奏家のプロフィールと空き状況を確認できます。",
              },
              {
                icon: <Zap className="size-6" />,
                step: "03",
                title: "予約を申し込む",
                desc: "気に入った演奏家を選んで予約リクエストを送信。担当者が調整します。",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-foreground">
                  {item.icon}
                </div>
                <span className="mb-1 text-xs font-medium text-muted-foreground">
                  ステップ {item.step}
                </span>
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured musicians ── */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">注目の演奏家</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">審査済みの人気演奏家をピックアップ</p>
            </div>
            <Link
              href="/request/new"
              className="hidden text-sm text-primary underline-offset-4 hover:underline sm:block"
            >
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m) => (
              <MusicianCard key={m.id} musician={m} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <LinkButton href="/request/new" variant="outline" className="w-full">
              すべての演奏家を見る
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-t border-border bg-muted/30 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "審査済み", label: "全演奏家スタッフ確認済み" },
              { value: "最短当日", label: "手配スピード" },
              { value: "東京23区", label: "対応エリア" },
              { value: "24時間", label: "返答目安" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event types ── */}
      <section className="border-t border-border py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-xl font-semibold">こんなシーンで使われています</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { emoji: "🏢", label: "企業イベント", desc: "懇親会・周年記念・キックオフ" },
              { emoji: "�️", label: "レストラン", desc: "特別ディナー・記念日コース" },
              { emoji: "🏨", label: "ホテルラウンジ", desc: "VIPレセプション・ロビー演奏" },
              { emoji: "🎉", label: "プライベートパーティー", desc: "誕生日・ホームパーティー" },
            ].map((ev) => (
              <Link
                key={ev.label}
                href="/request/new"
                className="flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-shadow hover:shadow-sm"
              >
                <span className="mb-2 text-3xl">{ev.emoji}</span>
                <span className="text-sm font-medium">{ev.label}</span>
                <span className="mt-1 text-xs text-muted-foreground">{ev.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-border bg-foreground py-14 text-background">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <Star className="mx-auto mb-4 size-8 fill-amber-400 text-amber-400" />
          <h2 className="text-2xl font-bold sm:text-3xl">
            すべての演奏家はスタッフ審査済みです
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-background/70">
            matchskillsに登録するすべての演奏家は、スタッフが直接確認・審査したプロフェッショナルです。はじめてのご利用でも安心してお任せください。
          </p>
          <LinkButton
            href="/request/new"
            variant="secondary"
            size="lg"
            className="mt-8 min-h-[44px] px-8 text-base"
          >
            今すぐ演奏家を探す
            <ArrowRight className="ml-2 size-4" />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
