"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { DEMO_SCENARIOS } from "@/lib/mock";
import { useMockSession } from "@/context/mock-session";
import { labelEventType } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DemoScenario } from "@/lib/types";

const EVENT_TYPE_COLORS = {
  corporate: "bg-blue-50 text-blue-700 border-blue-200",
  restaurant: "bg-amber-50 text-amber-700 border-amber-200",
  hotel_lounge: "bg-violet-50 text-violet-700 border-violet-200",
  private_party: "bg-emerald-50 text-emerald-700 border-emerald-200",
} as const;

export function DemoScenarioPicker() {
  const [open, setOpen] = useState(false);
  const { setRole } = useMockSession();
  const router = useRouter();

  function enter(scenario: DemoScenario) {
    setRole(scenario.startRole);
    if (scenario.startRole === "admin") {
      router.push(`/admin/requests/${scenario.requestId}`);
    } else {
      router.push(`/matches/${scenario.requestId}`);
    }
  }

  return (
    <div className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Toggle row */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-3 text-left"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary/40 inline-block" />
            デモシナリオから始める
          </span>
          {open ? (
            <ChevronUp className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Scenario cards */}
        {open && (
          <div className="grid grid-cols-1 gap-2 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => enter(scenario)}
                className={cn(
                  "group flex flex-col items-start gap-2 rounded-xl border bg-background p-4 text-left transition-shadow hover:shadow-sm",
                  "border-border"
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs font-medium",
                      EVENT_TYPE_COLORS[scenario.eventType]
                    )}
                  >
                    {labelEventType(scenario.eventType)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {scenario.startRole === "admin" ? "管理者視点" : "主催者視点"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium leading-snug">{scenario.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {scenario.description}
                  </p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  このシナリオで始める
                  <ArrowRight className="size-3" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
