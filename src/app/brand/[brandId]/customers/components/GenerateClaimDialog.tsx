"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGenerateClaimToken, useRevokeCustomerClaimToken } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2, Copy, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  brandId: string;
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GenerateClaimDialog({ brandId, customerId, open, onOpenChange }: Props) {
  const { mutateAsync: generateToken, isPending: isGenerating } = useGenerateClaimToken(brandId);
  const { mutateAsync: revokeToken } = useRevokeCustomerClaimToken(brandId, customerId);
  
  const [tokenInfo, setTokenInfo] = useState<{ id?: string; claimToken?: string; token?: string; expiresAt: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const handleGenerate = async () => {
    try {
      const res = await generateToken(customerId);
      setTokenInfo(res);
      setTimeLeft(60);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const copyToClipboard = () => {
    if (tokenInfo) {
      navigator.clipboard.writeText(tokenInfo.claimToken || tokenInfo.token || '');
      setIsCopied(true);
      toast.success('Đã sao chép mã!');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClose = async () => {
    if (tokenInfo?.id && timeLeft > 0) {
      try {
        await revokeToken(tokenInfo.id);
        toast.info('Mã đã tự động bị thu hồi do đóng cửa sổ.');
      } catch (e) {}
    }
    onOpenChange(false);
  };

  // Timer logic
  React.useEffect(() => {
    if (!tokenInfo || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Revoke when timeout
          if (tokenInfo.id) {
            revokeToken(tokenInfo.id).then(() => {
              toast.info('Mã liên kết đã hết hạn (60s) và tự động thu hồi.');
            }).catch(() => {});
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenInfo, timeLeft, revokeToken]);

  // Reset state when opened
  React.useEffect(() => {
    if (open) {
      setTokenInfo(null);
      setTimeLeft(60);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mã liên kết tài khoản</DialogTitle>
          <DialogDescription>
            Tạo mã liên kết để khách hàng có thể liên kết tài khoản offline của họ với tài khoản ứng dụng.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center min-h-[150px]">
          {tokenInfo ? (
            <div className="flex flex-col items-center w-full gap-4">
              <p className="text-sm text-muted-foreground">Gửi mã này cho khách hàng:</p>
              <div className="flex items-center w-full gap-2 p-3 bg-muted/50 rounded-2xl border border-border">
                <code className="flex-1 text-center font-mono text-xl tracking-widest font-bold">
                  {tokenInfo.claimToken || tokenInfo.token}
                </code>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="shrink-0">
                  {isCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Hết hạn trong: <span className={`font-bold font-mono ${timeLeft < 15 ? 'text-destructive' : 'text-primary'}`}>{timeLeft}s</span>
                </p>
              </div>
              
              {timeLeft <= 0 && (
                <div className="mt-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm w-full text-center">
                  Mã này đã hết hạn và tự động bị thu hồi.
                </div>
              )}
            </div>
          ) : (
            <Button 
              size="lg" 
              className="rounded-full px-8" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang tạo...</>
              ) : (
                'Tạo mã mới'
              )}
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={handleClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
