"use client";

import { cn } from "@/lib/utils";
import type { UserSubscriptionRes } from "@/features/admin/types";
import {
  planLifecycleLabel,
  resolvePlanLifecycle,
} from "@/features/admin/utils/subscription";
import { formatAdminDate } from "@/features/admin/utils/user-lookup";

const BADGE_STYLES: Record<string, string> = {
  active: "border-emerald-600/40 bg-emerald-600/10 text-emerald-700",
  expired: "border-destructive/40 bg-destructive/10 text-destructive",
  unlimited: "border-border bg-muted/60 text-muted-foreground",
  none: "border-dashed border-border bg-transparent text-muted-foreground",
};

/**
 * Plan cell for the user table. The list projection already carries the
 * effective subscription, so this is display-only; the full breakdown lives in
 * the detail dialog.
 */
export function UserPlanCell({
  subscription,
}: {
  subscription?: UserSubscriptionRes | null;
}) {
  const planName = subscription?.planName?.trim();
  const state = resolvePlanLifecycle({
    hasPlan: !!planName,
    expiresAt: subscription?.expiresAt,
  });

  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          "text-[12px] font-semibold",
          planName ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {planName || "Chưa cấp gói"}
      </span>
      {state !== "none" && (
        <span
          className={cn(
            "inline-flex w-fit items-center border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full",
            BADGE_STYLES[state]
          )}
        >
          {planLifecycleLabel(state)}
          {state === "active" && subscription?.expiresAt
            ? ` · ${formatAdminDate(subscription.expiresAt)}`
            : ""}
        </span>
      )}
    </div>
  );
}
