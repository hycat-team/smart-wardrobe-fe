'use client';

import { AlertTriangle, Bot, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AIEventList, DashboardFilters } from '@/features/admin/types';
import {
  formatDashboardDateTime,
  isNotFoundError,
} from '@/features/admin/utils/dashboard';

const visiblePages = (page: number, totalPages: number) => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
};

export function AIEventsTable({
  filters,
  data,
  isLoading,
  isFetching,
  error,
  onStatusChange,
  onPageChange,
  onRetry,
}: {
  filters: DashboardFilters;
  data?: AIEventList | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}) {
  if (isLoading && !data) {
    return <Skeleton className="h-[420px] rounded-3xl" />;
  }

  if (error && !data && !isNotFoundError(error)) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">Không thể tải sự kiện AI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bảng truy vết gặp lỗi, các số liệu tổng hợp không bị ảnh hưởng.
        </p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          <RotateCw className="size-4" />
          Thử lại
        </Button>
      </section>
    );
  }

  const items = data?.items ?? [];
  const metadata = data?.metadata;
  const totalPages = metadata?.totalPages ?? 1;
  const currentPage = metadata?.page ?? filters.aiPage;

  return (
    <section
      className="rounded-3xl border border-border bg-card shadow-sm"
      aria-labelledby="ai-events-heading"
      aria-busy={isFetching}
    >
      <div className="flex flex-col gap-4 border-b border-border p-6 md:flex-row md:items-end md:justify-between md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Traceability
          </p>
          <h2 id="ai-events-heading" className="mt-2 text-2xl font-semibold">
            Truy vết sự kiện AI
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Theo dõi request, provider, model và lỗi trả về từ dịch vụ AI.
          </p>
        </div>
        <Select
          value={filters.aiStatus || 'all'}
          onValueChange={(value) =>
            onStatusChange(value === 'all' ? '' : String(value))
          }
        >
          <SelectTrigger
            className="w-full md:w-44"
            aria-label="Lọc trạng thái sự kiện AI"
          >
            <SelectValue placeholder="Tất cả lỗi" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">Tất cả lỗi</SelectItem>
            <SelectItem value="FAILED">FAILED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <Bot className="size-9 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Không có sự kiện phù hợp</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Không tìm thấy dữ liệu truy vết cho bộ lọc hiện tại.
          </p>
        </div>
      ) : (
        <div className={isFetching ? 'opacity-60' : undefined}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 md:pl-8">Request ID</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead>Thông báo lỗi</TableHead>
                <TableHead className="pr-6 text-right md:pr-8">
                  Thời gian
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((event) => (
                <TableRow key={`${event.requestId}-${event.createdAt}`}>
                  <TableCell className="max-w-48 pl-6 font-mono text-xs md:pl-8">
                    <span className="block truncate" title={event.requestId}>
                      {event.requestId}
                    </span>
                  </TableCell>
                  <TableCell>{event.provider || '—'}</TableCell>
                  <TableCell>{event.model || '—'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.statusCode >= 400 ? 'destructive' : 'outline'
                      }
                    >
                      {event.statusCode || '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-sm whitespace-normal">
                    {event.errorMessage ? (
                      <span className="flex items-start gap-2 text-destructive">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        {event.errorMessage}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right text-xs text-muted-foreground md:pr-8">
                    {formatDashboardDateTime(event.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {metadata && metadata.totalPages > 1 && (
        <div className="border-t border-border px-4 py-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Trước"
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={
                    currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {visiblePages(currentPage, totalPages).map((page, index, pages) => {
                const previous = pages[index - 1];
                return (
                  <PaginationItem key={page} className="contents">
                    {previous && page - previous > 1 ? (
                      <PaginationEllipsis />
                    ) : null}
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        onPageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Sau"
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={
                    currentPage >= totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
}
