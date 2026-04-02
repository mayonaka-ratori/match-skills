import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MusicianOnboardingForm } from "@/components/musician/MusicianOnboardingForm";

export default function MusicianOnboardingPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">演奏家として登録する</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          プロフィール情報を入力してください。登録後、スタッフが審査のうえ掲載いたします。
        </p>
      </div>
      <MusicianOnboardingForm />
    </div>
  );
}
