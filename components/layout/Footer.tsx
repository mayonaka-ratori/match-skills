import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm font-semibold">matchskills</span>
            <p className="mt-0.5 text-xs text-muted-foreground">
              東京限定・プロ演奏家の即日手配サービス
            </p>
          </div>
          <nav className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              トップ
            </Link>
            <Link
              href="/request/new"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              演奏家を探す
            </Link>
            <Link
              href="/musician/onboarding"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              演奏家登録
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © 2025 matchskills — 対応エリア：東京都内全域
        </p>
      </div>
    </footer>
  );
}
