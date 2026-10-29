'use client';

import { MessageSquareText, RotateCw, Star } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SampleFeedbackList } from '@/features/brand-portal/types';
import {
  formatBrandDashboardDateTime,
  isBrandDashboardNotFoundError,
} from '@/features/brand-portal/utils/dashboard';

const visiblePages = (page: number, totalPages: number) => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
};

export function SampleFeedbackTable({
  sampleId,
  page,
  data,
  isLoading,
  isFetching,
  error,
  onPageChange,
  onRetry,
}: {
  sampleId: string;
  page: number;
  data?: SampleFeedbackList | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}) {
  if (!sampleId) {
    return null;
  }

  if (isLoading && !data) {
    return <Skeleton className="h-[420px] rounded-3xl" />;
  }

  if (error && !data && !isBrandDashboardNotFoundError(error)) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">
          Không thể tải phản hồi mẫu thử
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Phân tích tổng quan của mẫu vẫn được giữ nguyên.
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
  const currentPage = metadata?.page ?? page;
  const totalPages = Math.max(metadata?.totalPages ?? 1, 1);

  return (
    <section
      className="rounded-3xl border border-border bg-card shadow-sm"
      aria-labelledby="sample-feedback-heading"
      aria-busy={isFetching}
    >
      <div className="border-b border-border p-6 md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          Customer voice
        </p>
        <h2
          id="sample-feedback-heading"
          className="mt-2 text-2xl font-semibold"
        >
          Phản hồi mẫu thử
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Rating và nhận xét gần nhất của mẫu đang chọn.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <MessageSquareText className="size-9 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Chưa có phản hồi cho mẫu này
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Phản hồi sẽ xuất hiện sau khi người dùng gửi rating hoặc nhận xét.
          </p>
        </div>
      ) : (
        <div
          className={
            isFetching ? 'transition-opacity opacity-60' : 'transition-opacity'
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 md:pl-8">Mã feedback</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Nhận xét</TableHead>
                <TableHead className="pr-6 text-right md:pr-8">
                  Thời gian
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((feedback) => (
                <TableRow key={feedback.feedbackId}>
                  <TableCell className="max-w-56 pl-6 font-mono text-xs md:pl-8">
                    <span
                      className="block truncate"
                      title={feedback.feedbackId}
                    >
                      {feedback.feedbackId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {feedback.rating}/5
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-72 max-w-xl whitespace-normal">
                    {feedback.comment || (
                      <span className="text-muted-foreground">
                        Không có nhận xét
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right text-xs text-muted-foreground md:pr-8">
                    {formatBrandDashboardDateTime(feedback.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {metadata && metadata.totalPages > 1 ? (
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

              {visiblePages(currentPage, totalPages).map(
                (visiblePage, index, pages) => {
                  const previous = pages[index - 1];
                  return (
                    <PaginationItem key={visiblePage} className="contents">
                      {previous && visiblePage - previous > 1 ? (
                        <PaginationEllipsis />
                      ) : null}
                      <PaginationLink
                        href="#"
                        isActive={visiblePage === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          onPageChange(visiblePage);
                        }}
                      >
                        {visiblePage}
                      </PaginationLink>
                    </PaginationItem>
                  );
                },
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Sau"
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) {
                      onPageChange(currentPage + 1);
                    }
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
      ) : null}
    </section>
  );
}
