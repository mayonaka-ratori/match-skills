"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useMockSession } from "@/context/mock-session";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const roleNavLinks: Record<UserRole, { href: string; label: string }[]> = {
  organizer: [
    { href: "/", label: "トップ" },
    { href: "/request/new", label: "演奏家を探す" },
  ],
  musician: [
    { href: "/musician/availability", label: "空き状況を更新" },
    { href: "/musician/onboarding", label: "プロフィール登録" },
  ],
  admin: [
    { href: "/admin/requests", label: "リクエスト管理" },
  ],
};

export function TopNav({ className }: { className?: string }) {
  const { user } = useMockSession();
  const pathname = usePathname();
  const links = roleNavLinks[user.role];
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-semibold tracking-tight">
            match<span className="text-primary/60">skills</span>
          </span>
          <span className="hidden rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline">
            東京
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                isActive(l.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:block">
            {user.name}
          </span>
          <RolePill role={user.role} />
          {/* Mobile menu toggle */}
          <button
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted sm:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="メニュー"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-3 sm:hidden">
          <p className="mb-2 text-xs text-muted-foreground">{user.name}</p>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive(l.href)
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function RolePill({ role }: { role: UserRole }) {
  const labels: Record<UserRole, string> = {
    organizer: "主催者",
    musician: "演奏家",
    admin: "管理者",
  };
  const colors: Record<UserRole, string> = {
    organizer: "bg-blue-100 text-blue-700",
    musician: "bg-emerald-100 text-emerald-700",
    admin: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        colors[role]
      )}
    >
      {labels[role]}
    </span>
  );
}
