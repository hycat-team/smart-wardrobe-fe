"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAdminUsers, useAdminSubscriptionPlans, useUpdateUserStatus } from "@/features/admin/queries/admin.queries";
import { isUuid } from "@/features/admin/utils/user-lookup";
import {
  UsersToolbar,
  type RoleFilter,
  type StatusFilter,
} from "./UsersToolbar";
import { UsersTable, type UserDialogMode } from "./UsersTable";
import { UserDetailDialog } from "./UserDetailDialog";

export function UsersClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("user");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    mode: UserDialogMode;
  } | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const isSearchingById = isUuid(debouncedSearch);

  // Gói hội viên: nguồn option là danh mục gói của BE (không hard-code), giữ cả
  // gói Free/default. Bộ lọc chạy ở BE theo GÓI HIỆU LỰC của từng tài khoản —
  // đúng cột "Gói" trong bảng — nên phải gửi planId, không lọc ở FE.
  const { data: subscriptionPlans } = useAdminSubscriptionPlans(true);
  const planOptions = (subscriptionPlans ?? [])
    .filter((plan) => plan.isActive !== false)
    .map((plan) => ({ value: plan.id, label: plan.name }));

  const { data, isLoading, isError } = useAdminUsers({
    page,
    limit: 10,
    ...(debouncedSearch
      ? isSearchingById
        ? { userId: debouncedSearch }
        : { q: debouncedSearch }
      : {}),
    ...(roleFilter !== "all" ? { roleSlug: roleFilter } : {}),
    ...(statusFilter !== "all" ? { isActive: statusFilter === "active" } : {}),
    ...(planFilter !== "all" ? { planId: planFilter } : {}),
  });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  const users = data?.items ?? [];
  const metadata = data?.metadata;

  const toggleBan = (id: string, currentStatus: number | string) => {
    const isCurrentlyActive = currentStatus === 0 || currentStatus === "ACTIVE";
    updateStatus({ id, data: { status: isCurrentlyActive ? 1 : 0 } });
  };

  const openUser = (id: string, mode: UserDialogMode) => {
    setSelectedUser({ id, mode });
  };

  const emptyHint =
    isSearchingById && roleFilter !== "all"
      ? "Không thấy tài khoản với mã này trong nhóm đang lọc. Thử đổi bộ lọc vai trò sang “Tất cả vai trò”."
      : undefined;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 pb-24 pt-6 text-foreground animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 border-b border-border pb-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground border-l-2 border-border pl-4 leading-relaxed max-w-md">
              Quản lý tài khoản, gói hội viên và quyền truy cập hệ thống.
            </p>
            {metadata && (
              <p className="pl-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                {metadata.totalItems} tài khoản
              </p>
            )}
          </div>
        </div>

        <UsersToolbar
          search={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          role={roleFilter}
          onRoleChange={(value) => {
            setRoleFilter(value);
            setPage(1);
          }}
          status={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          plan={planFilter}
          onPlanChange={(value) => {
            setPlanFilter(value);
            setPage(1);
          }}
          planOptions={planOptions}
          isSearchingById={isSearchingById}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
        <UsersTable
          users={users}
          isLoading={isLoading}
          isError={isError}
          isUpdating={isUpdating}
          emptyHint={emptyHint}
          onOpenUser={openUser}
          onToggleStatus={toggleBan}
        />

        {metadata && metadata.totalPages > 1 && (
          <Pagination className="mt-12 pb-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (page > 1) setPage((current) => current - 1);
                  }}
                  className={
                    page <= 1
                      ? "pointer-events-none text-[11px] font-semibold uppercase tracking-widest opacity-50"
                      : "text-[11px] font-semibold uppercase tracking-widest"
                  }
                  text="TRƯỚC"
                />
              </PaginationItem>

              {[...Array(metadata.totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === metadata.totalPages ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNumber}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage(pageNumber);
                        }}
                        className="rounded-full border-border text-[11px] font-semibold uppercase tracking-widest"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (page < metadata.totalPages) setPage((current) => current + 1);
                  }}
                  className={
                    page >= metadata.totalPages
                      ? "pointer-events-none text-[11px] font-semibold uppercase tracking-widest opacity-50"
                      : "text-[11px] font-semibold uppercase tracking-widest"
                  }
                  text="SAU"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {isUpdating && (
          <p className="mt-4 flex items-center justify-end gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Đang cập nhật
          </p>
        )}
      </div>

      {selectedUser && (
        <UserDetailDialog
          key={`${selectedUser.id}-${selectedUser.mode}`}
          userId={selectedUser.id}
          initialMode={selectedUser.mode}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
