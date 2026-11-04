"use client";

import { useRef, useState } from "react";
import { Check, Copy, CreditCard, Loader2, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useAdminSubscriptionPlans,
  useAdminUserDetail,
  useAdminUserSubscription,
  useCancelUserSubscription,
  useGrantSubscription,
} from "@/features/admin/queries/admin.queries";
import { formatAdminDate } from "@/features/admin/utils/user-lookup";
import {
  planLifecycleLabel,
  resolvePlanLifecycle,
} from "@/features/admin/utils/subscription";
import type { UserDialogMode } from "./UsersTable";

const BADGE_STYLES: Record<string, string> = {
  active: "border-emerald-600/40 bg-emerald-600/10 text-emerald-700",
  expired: "border-destructive/40 bg-destructive/10 text-destructive",
  unlimited: "border-border bg-muted/60 text-muted-foreground",
  none: "border-dashed border-border bg-transparent text-muted-foreground",
};

function formatMoney(value?: number) {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="text-[12px] font-medium text-foreground">{children}</div>
    </div>
  );
}

function PlanBadge({ state }: { state: ReturnType<typeof resolvePlanLifecycle> }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest",
        BADGE_STYLES[state]
      )}
    >
      {planLifecycleLabel(state)}
    </span>
  );
}

export function UserDetailDialog({
  userId,
  initialMode,
  onClose,
}: {
  userId: string | null;
  initialMode: UserDialogMode;
  onClose: () => void;
}) {
  const detailQuery = useAdminUserDetail(userId);
  const rawQuery = useAdminUserSubscription(userId);
  const plansQuery = useAdminSubscriptionPlans(!!userId);
  const grantMutation = useGrantSubscription();
  const cancelMutation = useCancelUserSubscription();

  const [mode, setMode] = useState<UserDialogMode>(initialMode);
  const [planSlug, setPlanSlug] = useState("");
  const [copied, setCopied] = useState(false);
  const idempotencyKeyRef = useRef("");

  const user = detailQuery.data;
  const effectivePlan = user?.subscription;
  const rawRecord = rawQuery.data ?? null;
  const activePlans = (plansQuery.data ?? []).filter((plan) => plan.isActive);
  const selectedPlanSlug = planSlug || activePlans[0]?.slug || "";

  const effectiveState = resolvePlanLifecycle({
    hasPlan: !!effectivePlan?.planName,
    expiresAt: effectivePlan?.expiresAt,
  });
  const rawState = resolvePlanLifecycle({
    hasPlan: !!rawRecord,
    expiresAt: rawRecord?.expiresAt,
  });

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.username ||
      "Người dùng"
    : "Người dùng";
  const isAdmin = user?.roleSlug === "admin";
  const hasRawPaidRecord = !!rawRecord?.expiresAt;

  const copyUserId = async () => {
    if (!user?.id) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast.success("Đã sao chép mã người dùng");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không sao chép được mã người dùng");
    }
  };

  const startGrant = () => {
    idempotencyKeyRef.current = crypto.randomUUID();
    setMode("grant");
  };

  const handleGrant = async () => {
    if (!userId) return;
    if (!selectedPlanSlug) {
      toast.error("Vui lòng chọn gói cần cấp");
      return;
    }
    // Reuse the SAME key for retries of this attempt: a network retry must be
    // recognised as the same grant, not a second one.
    const idempotencyKey = idempotencyKeyRef.current || crypto.randomUUID();
    idempotencyKeyRef.current = idempotencyKey;
    try {
      const result = await grantMutation.mutateAsync({
        items: [{ userIdentifier: userId, planSlug: selectedPlanSlug }],
        idempotencyKey,
      });
      const first = result.results?.[0];
      // `duplicate_request` means this exact request already ran, so the account
      // is granted either way. Anything else left the grant unapplied: keep the
      // key so a retry is still recognised as the same attempt.
      const settled =
        first?.status === "success" || first?.reason === "duplicate_request";
      if (settled) {
        idempotencyKeyRef.current = "";
        setMode("view");
      }
    } catch {
      // handleApiError already surfaced the message; keep the key for a retry.
    }
  };

  const handleCancel = async () => {
    if (!userId) return;
    try {
      await cancelMutation.mutateAsync(userId);
      setMode("view");
    } catch {
      // handleApiError already surfaced the message.
    }
  };

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] gap-0 overflow-clip rounded-3xl border border-border bg-card p-0 shadow-xl">
        <DialogHeader className="flex flex-col items-center gap-4 border-b border-border p-6">
          <Avatar className="size-20 shrink-0">
            <AvatarImage
              src={user?.avatarUrl || undefined}
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted text-3xl font-semibold text-foreground">
              {(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <DialogTitle className="text-2xl font-medium text-foreground">
              {displayName}
            </DialogTitle>
            <DialogDescription className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {user?.email ?? "—"}
            </DialogDescription>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest",
                  isAdmin
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/50 text-muted-foreground"
                )}
              >
                {isAdmin ? "ADMIN" : "USER"}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest",
                  user.status === 0
                    ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                )}
              >
                {user.status === 0 ? "ACTIVE" : "BANNED"}
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="max-h-[65vh] space-y-6 overflow-y-auto p-6">
          {detailQuery.isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : detailQuery.isError ? (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-destructive">
              Không tải được thông tin người dùng.
            </p>
          ) : (
            user && (
              <>
                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-foreground">
                    Tài khoản
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Mã người dùng">
                      <button
                        type="button"
                        onClick={copyUserId}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                        title={user.id}
                      >
                        {copied ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        {user.id}
                      </button>
                    </Field>
                    <Field label="Tên đăng nhập">{user.username || "—"}</Field>
                    <Field label="Email">{user.email || "—"}</Field>
                    <Field label="Ngày tham gia">{formatAdminDate(user.createdAt)}</Field>
                    <Field label="Địa chỉ">{user.address || "—"}</Field>
                    <Field label="Ngày sinh">
                      {user.dateOfBirth ? formatAdminDate(user.dateOfBirth) : "—"}
                    </Field>
                  </div>

                  {user.bodyProfile && (
                    <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-muted/20 p-4">
                      <Field label="Chiều cao">
                        {user.bodyProfile.heightCm ? `${user.bodyProfile.heightCm} cm` : "—"}
                      </Field>
                      <Field label="Cân nặng">
                        {user.bodyProfile.weightKg ? `${user.bodyProfile.weightKg} kg` : "—"}
                      </Field>
                      <Field label="Dáng người">
                        {user.bodyProfile.bodyShape || "—"}
                      </Field>
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-foreground">
                      Gói hội viên
                    </h3>
                    <PlanBadge state={effectiveState} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-gradient-to-br from-stone-100/60 via-stone-50/40 to-stone-100/60 p-4 dark:from-stone-900/60 dark:via-stone-950/40 dark:to-stone-900/60">
                    <Field label="Gói hiệu lực">
                      {effectivePlan?.planName || "Chưa cấp gói"}
                      {effectivePlan?.planSlug && (
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {effectivePlan.planSlug}
                        </span>
                      )}
                    </Field>
                    <Field label="Hết hạn">
                      {effectivePlan?.planName
                        ? formatAdminDate(effectivePlan.expiresAt)
                        : "—"}
                    </Field>
                    <Field label="Tự động gia hạn">
                      {effectivePlan?.planName
                        ? effectivePlan.isAutoRenewEnabled
                          ? "Có"
                          : "Không"
                        : "—"}
                    </Field>
                    <Field label="Cá nhân hoá">
                      {effectivePlan?.planName
                        ? effectivePlan.personalizationEnabled
                          ? "Được bật"
                          : "Tắt"
                        : "—"}
                    </Field>
                  </div>

                  {effectivePlan?.planName && (
                    <>
                      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border p-4 sm:grid-cols-4">
                        <Field label="Hạn mức tủ đồ">
                          {effectivePlan.maxWardrobeItems ?? "—"}
                        </Field>
                        <Field label="Hạn mức outfit">{effectivePlan.maxOutfits ?? "—"}</Field>
                        <Field label="Hạn mức AI outfit / ngày">
                          {effectivePlan.aiOutfitDailyQuota ?? "—"}
                        </Field>
                        <Field label="Hạn mức AI chat / ngày">
                          {effectivePlan.aiChatDailyQuota ?? "—"}
                        </Field>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Đây là hạn mức/ngày của gói, không phải số lượt còn lại hôm nay. Số
                        lượt đã dùng và còn lại nằm ở API quota của chính người dùng.
                      </p>
                    </>
                  )}

                  <div className="rounded-2xl border border-dashed border-border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Bản ghi gói gốc
                      </p>
                      <PlanBadge state={rawState} />
                    </div>
                    {rawQuery.isLoading ? (
                      <Loader2 className="mt-2 size-4 animate-spin text-muted-foreground" />
                    ) : rawRecord ? (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <Field label="Gói">{rawRecord.planName}</Field>
                        <Field label="Bắt đầu">
                          {formatAdminDate(rawRecord.startedAt)}
                        </Field>
                        <Field label="Hạn thực">
                          {rawRecord.expiresAt
                            ? formatAdminDate(rawRecord.expiresAt)
                            : "Không thời hạn"}
                        </Field>
                        <Field label="Tự động gia hạn">
                          {rawRecord.isAutoRenewEnabled ? "Có" : "Không"}
                        </Field>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Chưa có bản ghi gói cho tài khoản này.
                      </p>
                    )}
                    <p className="mt-3 text-[10px] text-muted-foreground">
                      Gói hiệu lực là gói hệ thống đang áp dụng; bản ghi gốc giữ ngày hết hạn
                      thực, nên hai khối có thể khác nhau khi gói trả phí đã hết hạn.
                    </p>
                  </div>

                  {!isAdmin && mode === "view" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full text-[10px] font-bold uppercase tracking-widest"
                        onClick={startGrant}
                      >
                        <CreditCard className="mr-1.5 size-3.5" />
                        Cấp gói
                      </Button>
                      {hasRawPaidRecord && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full border-destructive/40 text-[10px] font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10"
                          onClick={() => setMode("cancel")}
                        >
                          <ShieldOff className="mr-1.5 size-3.5" />
                          Huỷ gói
                        </Button>
                      )}
                    </div>
                  )}

                  {mode === "grant" && (
                    <div className="space-y-3 rounded-2xl border border-border bg-muted/30 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
                        Cấp gói hội viên
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Gói mới sẽ thay thế gói hiện tại của tài khoản này. Hành động được ghi
                        nhật ký quản trị.
                      </p>
                      <div
                        role="radiogroup"
                        aria-label="Chọn gói cần cấp"
                        className="grid gap-2"
                      >
                        {activePlans.map((plan) => {
                          const checked = selectedPlanSlug === plan.slug;
                          return (
                            <label
                              key={plan.id}
                              className={cn(
                                "relative flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3 transition-colors",
                                checked
                                  ? "border-foreground bg-background shadow-xs"
                                  : "border-border bg-transparent hover:border-foreground/40"
                              )}
                            >
                              <span className="flex flex-col gap-1">
                                <span className="text-[12px] font-semibold text-foreground">
                                  {plan.name}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                  {formatMoney(plan.price)} ·{" "}
                                  {plan.durationDays
                                    ? `${plan.durationDays} ngày`
                                    : "Không thời hạn"}
                                </span>
                              </span>
                              <input
                                type="radio"
                                name="grant-plan"
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                checked={checked}
                                onChange={() => setPlanSlug(plan.slug)}
                                value={plan.slug}
                              />
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "pointer-events-none mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                                  checked
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border"
                                )}
                              >
                                {checked && <Check className="size-3" />}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {plansQuery.isLoading && (
                        <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Loader2 className="size-3.5 animate-spin" />
                          Đang tải danh sách gói…
                        </p>
                      )}
                      {!plansQuery.isLoading && activePlans.length === 0 && (
                        <p className="text-[11px] text-destructive">
                          Không có gói nào đang hoạt động để cấp.
                        </p>
                      )}
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => setMode("view")}
                          disabled={grantMutation.isPending}
                        >
                          Huỷ
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-full text-[10px] font-bold uppercase tracking-widest"
                          onClick={handleGrant}
                          disabled={
                            grantMutation.isPending ||
                            plansQuery.isLoading ||
                            !selectedPlanSlug
                          }
                        >
                          {grantMutation.isPending && (
                            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                          )}
                          Cấp gói
                        </Button>
                      </div>
                    </div>
                  )}

                  {mode === "cancel" && (
                    <div className="space-y-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-destructive">
                        Huỷ gói hội viên
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Tài khoản sẽ chuyển ngay về gói Free; hạn mức và quyền lợi của gói hiện
                        tại mất hiệu lực. Thao tác không hoàn tiền.
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => setMode("view")}
                          disabled={cancelMutation.isPending}
                        >
                          Giữ gói
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-full bg-destructive text-[10px] font-bold uppercase tracking-widest text-destructive-foreground hover:bg-destructive/90"
                          onClick={handleCancel}
                          disabled={cancelMutation.isPending}
                        >
                          {cancelMutation.isPending && (
                            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                          )}
                          Xác nhận huỷ
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
              </>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
