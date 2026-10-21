'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export function PaymentResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const code = searchParams.get('code');
  const cancel = searchParams.get('cancel');
  const status = searchParams.get('status');
  const orderCode = searchParams.get('orderCode');
  const flow = searchParams.get('flow');
  const next = searchParams.get('next');

  const isSuccess = code === '00' && cancel !== 'true';
  const isCancelled = cancel === 'true' || status === 'CANCELLED';

  const [isUpdating, setIsUpdating] = useState(isSuccess);
  const [countdown, setCountdown] = useState(5);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!isSuccess) return;

    let pollCount = 0;
    const maxPolls = 5;

    const performRefetch = async () => {
      try {
        await Promise.allSettled([
          queryClient.invalidateQueries({ queryKey: ['me'] }),
          queryClient.invalidateQueries({ queryKey: ['wallet'] }),
          queryClient.invalidateQueries({ queryKey: ['subscription'] }),
          queryClient.refetchQueries({ queryKey: ['me'] }),
          queryClient.refetchQueries({ queryKey: ['wallet', 'balance'] }),
          queryClient.refetchQueries({ queryKey: ['wallet', 'statements'] }),
          queryClient.refetchQueries({ queryKey: ['subscription', 'me'] }),
          queryClient.refetchQueries({ queryKey: ['subscription', 'daily-quota'] }),
        ]);
      } catch {
        // ignore
      }
    };

    performRefetch();

    const intervalId = setInterval(async () => {
      pollCount += 1;
      await performRefetch();
      if (pollCount >= maxPolls) {
        clearInterval(intervalId);
        setIsUpdating(false);
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isSuccess, queryClient]);

  const getTargetUrl = useCallback(() => {
    if (next && next.startsWith('/') && !next.startsWith('//')) {
      return next;
    }
    return flow === 'purchase' ? '/pricing' : '/profile?tab=wallet';
  }, [flow, next]);

  const navigateToTarget = useCallback(() => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    router.replace(getTargetUrl());
  }, [router, getTargetUrl]);

  useEffect(() => {
    if (!isSuccess || isUpdating) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigateToTarget();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isSuccess, isUpdating, navigateToTarget]);

  const handleContinue = () => {
    navigateToTarget();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-border bg-card">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500 ring-8 ring-emerald-500/5">
                <CheckCircle2 className="h-12 w-12" />
              </div>
            ) : isCancelled ? (
              <div className="rounded-full bg-amber-500/10 p-3 text-amber-500 ring-8 ring-amber-500/5">
                <XCircle className="h-12 w-12" />
              </div>
            ) : (
              <div className="rounded-full bg-destructive/10 p-3 text-destructive ring-8 ring-destructive/5">
                <AlertCircle className="h-12 w-12" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSuccess
              ? 'Thanh toán thành công!'
              : isCancelled
                ? 'Giao dịch đã bị hủy'
                : 'Thanh toán không thành công'}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm pt-1">
            {isSuccess
              ? flow === 'topup'
                ? 'Số tiền nạp đã được ghi nhận vào ví của bạn.'
                : 'Gói hội viên của bạn đã được kích hoạt thành công.'
              : isCancelled
                ? 'Bạn đã hủy yêu cầu thanh toán trên PayOS. Chưa có khoản tiền nào bị trừ.'
                : 'Không thể xử lý giao dịch hoặc hệ thống chưa nhận được phản hồi hợp lệ.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2 pb-6">
          {orderCode && (
            <div className="flex justify-between items-center px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-sm">
              <span className="text-muted-foreground">Mã đơn hàng:</span>
              <span className="font-mono font-semibold">{orderCode}</span>
            </div>
          )}

          {isSuccess && isUpdating && (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Đang cập nhật dữ liệu tài khoản...</span>
            </div>
          )}

          {isSuccess && !isUpdating && (
            <div className="flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground">
              <span>Tự động chuyển tiếp sau {countdown} giây...</span>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleContinue}
            disabled={isUpdating}
            className="w-full font-semibold"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : isSuccess ? (
              <>
                Tiếp tục ({countdown}s)
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Tiếp tục
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
