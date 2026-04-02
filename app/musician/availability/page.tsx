import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AvailabilityEditor } from "@/components/musician/AvailabilityEditor";

export default function MusicianAvailabilityPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 pb-24">
      <div className="mb-6">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          トップに戻る
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">空き状況を更新する</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          演奏可能な日程・時間帯をタップで更新できます。主催者に表示されます。
        </p>
      </div>
      <AvailabilityEditor />
    </div>
  );
}
