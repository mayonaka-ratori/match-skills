import type { DemoScenario } from "@/lib/types";

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "demo-001",
    label: "企業レセプション",
    title: "港区・四半期キックオフパーティー",
    description:
      "150名規模の社内懇親会。ザ・プリンスパークタワー東京の宴会場でジャズBGMを探している主催者視点のシナリオ。",
    eventType: "corporate",
    requestId: "req-001",
    startRole: "organizer",
    contextNote:
      "候補3名がショートリスト済み（田中 誠・木村 雪・渡辺 花）。管理者ロールに切り替えると候補選定・オファー操作も確認できます。",
  },
  {
    id: "demo-002",
    label: "レストランディナー",
    title: "西麻布・特別ディナーコースの夜",
    description:
      "20名のプライベートディナー。リストランテ アルポルトがボサノバ／アコースティックギターの演奏家を当日手配するシナリオ。",
    eventType: "restaurant",
    requestId: "req-002",
    startRole: "organizer",
    contextNote:
      "オファー送付済みステータス。山田 健司が承諾・中村 はるかが辞退済み。演奏家ロールに切り替えるとオファー画面を確認できます（token: tkn-ghi789）。",
  },
  {
    id: "demo-003",
    label: "ホテルラウンジ",
    title: "千代田区・VIPラウンジ リニューアル",
    description:
      "パレスホテル東京のVIPラウンジ リニューアルオープニング。クラシックデュオが4時間演奏する確定済みシナリオ。",
    eventType: "hotel_lounge",
    requestId: "req-003",
    startRole: "organizer",
    contextNote:
      "予約確定済み（佐藤 あかね デュオ）。管理者ロールで /admin/requests/req-003 を開くと確定済みの詳細フローを見せられます。",
  },
  {
    id: "demo-004",
    label: "プライベートパーティー",
    title: "代官山・誕生日サプライズパーティー",
    description:
      "友人15名の誕生日サプライズ。リクエスト対応可能なソウル／ポップス演奏家を探す個人主催者のシナリオ。",
    eventType: "private_party",
    requestId: "req-004",
    startRole: "organizer",
    contextNote:
      "対応待ちステータス。候補未選定のため、管理者ロールでショートリストを組む操作を実演できます。",
  },
  {
    id: "demo-005",
    label: "株主総会",
    title: "千代田区・年次株主総会オープニング",
    description:
      "東京国際フォーラムでの厳粛なオープニング演奏。クラシックのみ・予算高めの企業案件シナリオ。",
    eventType: "corporate",
    requestId: "req-005",
    startRole: "admin",
    contextNote:
      "対応待ちステータス。管理者ロールで候補選定フローを最初から見せるのに最適。渡辺 花（フルート）・藤原 澪（チェロ）が候補として自然。",
  },
];
