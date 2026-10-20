'use client';

import { useState } from 'react';
import {
  Activity,
  Check,
  Copy,
  RotateCw,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ActivityEventList } from '@/features/admin/types/activity';
import {
  getActivityTypeConfig,
  getUserDisplayName,
} from '@/features/admin/utils/activity';
import {
  formatVNDateTime,
  isNotFoundError,
} from '@/features/admin/utils/dashboard';

const visiblePages = (page: number, totalPages: number) => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
};

export function ActivityEventsTable({
  data,
  isLoading,
  isFetching,
  error,
  onPageChange,
  onClearFilters,
  onRetry,
}: {
  data?: ActivityEventList | null;
  isLoading: boolean;
  isFetching: boolean;
  error?: unknown;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 2000);
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data && !isNotFoundError(error)) {
    return (
      <section className="rounded-2xl border border-destructive/30 bg-card p-8 text-center">
        <h2 className="text-xl font-semibold text-destructive">
          Không thể tải nhật ký hoạt động
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Đã xảy ra lỗi khi truy vấn nhật ký người dùng từ máy chủ.
        </p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          <RotateCw className="mr-2 size-4" />
          Thử lại
        </Button>
      </section>
    );
  }

  const items = data?.items ?? [];
  const metadata = data?.metadata;
  const totalPages = metadata?.totalPages ?? 1;
  const currentPage = metadata?.page ?? 1;
  const totalItems = metadata?.totalItems ?? 0;

  if (items.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <Activity className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold">
          Không tìm thấy nhật ký hoạt động phù hợp
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
          Không có sự kiện xác thực nào phù hợp với bộ lọc hiện tại. Thử thay đổi mã người dùng hoặc khoảng ngày tìm kiếm.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="mt-5 text-xs"
        >
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-border bg-card shadow-sm transition-opacity duration-200 ${
        isFetching ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] pl-6">Thời điểm (VN)</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead className="w-[200px]">Mã người dùng</TableHead>
              <TableHead className="w-[160px]">Loại hoạt động</TableHead>
              <TableHead className="pr-6 text-right">Mã sự kiện</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((event) => {
              const displayName = getUserDisplayName(event);
              const typeConfig = getActivityTypeConfig(event.activityType);
              const isUserIdCopied = copiedId === `user-${event.id}`;
              const isEventIdCopied = copiedId === `event-${event.id}`;

              return (
                <TableRow key={event.id} className="hover:bg-muted/40">
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                    {formatVNDateTime(event.occurredAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <User className="size-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs text-foreground">
                          {displayName}
                        </span>
                        {event.userEmail && displayName !== event.userEmail && (
                          <span className="text-[11px] text-muted-foreground">
                            {event.userEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="truncate max-w-[140px]" title={event.userId}>
                        {event.userId}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(event.userId, `user-${event.id}`)}
                        title="Sao chép UUID người dùng"
                      >
                        {isUserIdCopied ? (
                          <Check className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal ${typeConfig.className}`}
                    >
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                      <span className="truncate max-w-[120px]" title={event.id}>
                        {event.id}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(event.id, `event-${event.id}`)}
                        title="Sao chép ID sự kiện"
                      >
                        {isEventIdCopied ? (
                          <Check className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Hiển thị{' '}
          <span className="font-medium text-foreground">
            {items.length > 0 ? (currentPage - 1) * (metadata?.limit ?? 20) + 1 : 0}
          </span>{' '}
          đến{' '}
          <span className="font-medium text-foreground">
            {Math.min(currentPage * (metadata?.limit ?? 20), totalItems)}
          </span>{' '}
          trong tổng số{' '}
          <span className="font-medium text-foreground">{totalItems}</span> hoạt động
        </p>

        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  scrollToTop={false}
                  text="Trước"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {visiblePages(currentPage, totalPages).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    scrollToTop={false}
                    isActive={p === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(p);
                    }}
                    className="cursor-pointer text-xs"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  scrollToTop={false}
                  text="Sau"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={
                    currentPage >= totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
