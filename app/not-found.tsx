import { LinkButton } from "@/components/ui/link-button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-muted-foreground/30">404</p>
      <h1 className="mt-4 text-xl font-semibold">ページが見つかりません</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        お探しのページは存在しないか、URLが正しくない可能性があります。
      </p>
      <div className="mt-8">
        <LinkButton href="/" variant="outline">
          トップに戻る
        </LinkButton>
      </div>
    </div>
  );
}
