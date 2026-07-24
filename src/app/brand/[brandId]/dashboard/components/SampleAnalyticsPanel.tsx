import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart3,
  ExternalLink,
  MessageSquareText,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  BrandSampleOption,
  DigitalSampleLabAnalytics,
  FeedbackSentiment,
} from '@/features/brand-portal/types';
import {
  formatBrandNumber,
  isBrandDashboardNotFoundError,
} from '@/features/brand-portal/utils/dashboard';

const sentimentLabels: Record<
  FeedbackSentiment,
  { label: string; className: string }
> = {
  positive: {
    label: 'Tích cực',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  neutral: {
    label: 'Trung tính',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  negative: {
    label: 'Tiêu cực',
    className: 'bg-red-500/10 text-red-700 dark:text-red-300',
  },
  '': {
    label: 'Chưa xác định',
    className: 'bg-muted text-muted-foreground',
  },
};

export function SampleAnalyticsPanel({
  brandId,
  samples,
  selectedSampleId,
  data,
  isLoadingSamples,
  isLoadingAnalytics,
  samplesError,
  analyticsError,
  onSampleChange,
  onRetrySamples,
  onRetryAnalytics,
}: {
  brandId: string;
  samples: BrandSampleOption[];
  selectedSampleId: string;
  data?: DigitalSampleLabAnalytics | null;
  isLoadingSamples: boolean;
  isLoadingAnalytics: boolean;
  samplesError: unknown;
  analyticsError: unknown;
  onSampleChange: (sampleId: string) => void;
  onRetrySamples: () => void;
  onRetryAnalytics: () => void;
}) {
  if (isLoadingSamples && samples.length === 0) {
    return <Skeleton className="h-[430px] rounded-3xl" />;
  }

  if (samplesError && samples.length === 0) {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-card p-8">
        <h2 className="text-xl font-semibold">Không thể tải danh sách mẫu</h2>
        <Button className="mt-5" variant="outline" onClick={onRetrySamples}>
          Thử lại
        </Button>
      </section>
    );
  }

  if (samples.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <MessageSquareText className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">
          Chưa có mẫu thử Digital Sample
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Tạo mẫu thử đầu tiên để thu thập vote, rating và phản hồi phối đồ.
        </p>
        <Button className="mt-6" render={<Link href={`/brand/${brandId}/digital-sample-lab`} />}>
          Tạo mẫu thử
        </Button>
      </section>
    );
  }

  const selectedSample =
    samples.find((sample) => sample.id === selectedSampleId) ?? samples[0];
  const selectedData = data?.itemId === selectedSampleId ? data : null;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Digital Sample Lab
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Hiệu quả mẫu thử</h2>
        </div>
        <Select
          value={selectedSample?.name}
          onValueChange={(value) => {
            if (value) onSampleChange(value);
          }}
        >
          <SelectTrigger
            className="w-full md:w-80"
            aria-label="Chọn mẫu thử để phân tích"
          >
            <SelectValue placeholder="Chọn mẫu thử" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {samples.map((sample) => (
              <SelectItem key={sample.id} value={sample.id}>
                {sample.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
            {selectedSample?.imageUrl ? (
              <Image
                src={selectedSample.imageUrl}
                alt={selectedSample.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BarChart3 className="size-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold">{selectedSample?.name}</p>
            <p className="mt-1 break-all text-xs text-muted-foreground">
              {selectedSampleId}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            render={
              <Link
                href={`/brand/${brandId}/digital-sample-lab/report/${selectedSampleId}`}
              />
            }
          >
            Xem báo cáo
            <ExternalLink className="size-4" />
          </Button>
        </div>

        {isLoadingAnalytics && !selectedData ? (
          <Skeleton className="min-h-72 rounded-3xl" />
        ) : analyticsError &&
          !selectedData &&
          !isBrandDashboardNotFoundError(analyticsError) ? (
          <div className="rounded-3xl border border-destructive/30 p-8">
            <h3 className="font-semibold">Không thể tải phân tích mẫu thử</h3>
            <Button
              className="mt-5"
              variant="outline"
              onClick={onRetryAnalytics}
            >
              Thử lại
            </Button>
          </div>
        ) : !selectedData ? (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center">
            <h3 className="font-semibold">Mẫu chưa có dữ liệu phân tích</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Kết quả sẽ xuất hiện sau khi người dùng bắt đầu đánh giá mẫu.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-muted/50 p-5">
                <p className="text-xs text-muted-foreground">Lượt vote</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {formatBrandNumber(selectedData.votesCount)}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-5">
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  {formatBrandNumber(selectedData.avgRating)}
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                </p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-5">
                <p className="text-xs text-muted-foreground">Sentiment</p>
                <Badge
                  variant="ghost"
                  className={`mt-3 ${sentimentLabels[selectedData.feedbackSentiment]?.className ?? sentimentLabels[''].className}`}
                >
                  {sentimentLabels[selectedData.feedbackSentiment]?.label ??
                    sentimentLabels[''].label}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Danh mục thường phối kèm
              </h3>
              {selectedData.topPairedCategories?.length ? (
                <div className="mt-4 space-y-3">
                  {selectedData.topPairedCategories.map((category) => {
                    const max = Math.max(
                      ...selectedData.topPairedCategories.map(
                        (item) => item.pairCount,
                      ),
                      1,
                    );
                    return (
                      <div key={category.categoryName}>
                        <div className="mb-1 flex items-center justify-between gap-4 text-xs">
                          <span>{category.categoryName}</span>
                          <span className="font-mono text-muted-foreground">
                            {formatBrandNumber(category.pairCount)}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${(category.pairCount / max) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Chưa có dữ liệu danh mục phối kèm.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
