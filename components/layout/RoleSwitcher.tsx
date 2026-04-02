"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useMockSession } from "@/context/mock-session";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { resetDemoState } from "@/lib/demo-reset";

const roles: { role: UserRole; label: string; emoji: string }[] = [
  { role: "organizer", label: "主催者", emoji: "🏢" },
  { role: "musician", label: "演奏家", emoji: "🎵" },
  { role: "admin", label: "管理者", emoji: "⚙️" },
];

export function RoleSwitcher({ className }: { className?: string }) {
  const { user, setRole } = useMockSession();
  const router = useRouter();

  function handleReset() {
    resetDemoState(setRole);
    router.push("/");
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        className
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur">
        <span className="mr-1 text-xs text-muted-foreground pl-1 hidden sm:inline">デモ切替:</span>
        {roles.map(({ role, label, emoji }) => (
          <button
            key={role}
            onClick={() => setRole(role)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              user.role === role
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </button>
        ))}
        <div className="mx-1 h-3.5 w-px bg-border" />
        <button
          type="button"
          onClick={handleReset}
          title="デモをリセット"
          className="rounded-full p-1 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
          aria-label="デモをリセット"
        >
          <RotateCcw className="size-3" />
        </button>
      </div>
    </div>
  );
}
