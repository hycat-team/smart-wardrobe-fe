"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGenerateClaimToken, useRevokeClaimToken } from '@/features/brand-portal/queries/brand-portal.queries';
import { Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  brandId: string;
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GenerateClaimDialog({ brandId, customerId, open, onOpenChange }: Props) {
  const { mutateAsync: generateToken, isPending: isGenerating } = useGenerateClaimToken(brandId);
  const { mutateAsync: revokeToken, isPending: isRevoking } = useRevokeClaimToken(brandId);
  
  const [tokenInfo, setTokenInfo] = useState<{ claimToken: string; expiresAt: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      const res = await generateToken(customerId);
      setTokenInfo(res);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRevoke = async () => {
    try {
      await revokeToken(customerId);
      setTokenInfo(null);
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const copyToClipboard = () => {
    if (tokenInfo) {
      navigator.clipboard.writeText(tokenInfo.claimToken);
      setIsCopied(true);
      toast.success('Đã sao chép mã!');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Reset state when opened
  React.useEffect(() => {
    if (open) setTokenInfo(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <p className="text-sm text-muted-foreground text-center">Gửi mã này cho khách hàng:</p>
              <div className="w-full flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-border">
                <span className="font-mono text-2xl font-bold tracking-widest">{tokenInfo.claimToken}</span>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="shrink-0">
                  {isCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Hết hạn lúc: {new Date(tokenInfo.expiresAt).toLocaleString('vi-VN')}
              </p>
              
              <Button 
                variant="destructive" 
                className="mt-4 w-full rounded-full" 
                onClick={handleRevoke}
                disabled={isRevoking}
              >
                {isRevoking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Thu hồi mã
              </Button>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-6">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
