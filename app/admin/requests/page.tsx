// /admin/requests — admin view of all booking requests
// Server component
// TODO Phase 1: fetch from Supabase with admin-level RLS

import Link from "next/link";
import { MOCK_REQUESTS, MOCK_ORGANIZERS } from "@/lib/mock";
import { PageHeader } from "@/components/common/PageHeader";
import { labelEventType, labelRequestStatus, formatDate, formatTime, REQUEST_STATUS_STYLES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";


export default function AdminRequestsPage() {
  // Phase 0: show all requests sorted newest first
  // TODO Phase 1: filter by status via searchParams (make async, await searchParams)
  const sorted = [...MOCK_REQUESTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-24">
      <PageHeader
        title="リクエスト管理"
        subtitle={`全${sorted.length}件`}
      />

      {/* Status overview cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { status: "pending" as RequestStatus, label: "対応待ち" },
          { status: "shortlisted" as RequestStatus, label: "候補選定中" },
          { status: "offers_sent" as RequestStatus, label: "オファー送付済み" },
          { status: "confirmed" as RequestStatus, label: "確定済み" },
        ].map(({ status, label }) => {
          const count = sorted.filter((r) => r.status === status).length;
          return (
            <div key={status} className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Request table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID / 種別</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">日時 / エリア</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-muted-foreground md:table-cell">主催者</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ステータス</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((req) => {
              const organizer = MOCK_ORGANIZERS.find((o) => o.id === req.organizerId);
              return (
                <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{labelEventType(req.eventType)}</p>
                    <p className="text-xs text-muted-foreground">{req.id}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <p className="font-medium">{formatDate(req.eventDate)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(req.eventTime)} · {req.venueNeighborhood}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <p className="font-medium">{organizer?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{organizer?.companyName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        REQUEST_STATUS_STYLES[req.status]
                      )}
                    >
                      {labelRequestStatus(req.status)}
                    </span>
                    {req.shortlistedMusicianIds.length > 0 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        候補 {req.shortlistedMusicianIds.length}名
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/requests/${req.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
