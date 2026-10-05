import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { campaignAdminApi } from '../api/campaign-admin.api';
import { EligibilityRes } from '../types/campaign-admin.types';
import { CustomerEligibilityResult } from './CustomerEligibilityResult';

interface CustomerEligibilityCardProps {
  campaigns?: Array<{ code: string; planName: string }>;
  defaultCampaignCode?: string;
}

export function CustomerEligibilityCard({
  campaigns = [],
  defaultCampaignCode = '',
}: CustomerEligibilityCardProps) {
  const [campaignCode, setCampaignCode] = useState(defaultCampaignCode);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityRes | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCampaign = campaignCode.trim();
    const cleanUser = userId.trim();

    if (!cleanCampaign || !cleanUser) {
      setErrorMessage('Vui lòng nhập đầy đủ mã chiến dịch và mã tài khoản (User ID).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const data = await campaignAdminApi.getAccountEligibility(cleanCampaign, cleanUser);
      setResult(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        const serverMsg = err.response.data?.message || '';
        if (serverMsg.toLowerCase().includes('chiến dịch') || serverMsg.toLowerCase().includes('campaign')) {
          setErrorMessage(`Không tìm thấy chiến dịch với mã: "${cleanCampaign}". Vui lòng kiểm tra lại.`);
        } else if (serverMsg.toLowerCase().includes('tài khoản') || serverMsg.toLowerCase().includes('user')) {
          setErrorMessage(`Không tìm thấy tài khoản người dùng với mã: "${cleanUser}". Vui lòng kiểm tra lại.`);
        } else {
          setErrorMessage(serverMsg || 'Không tìm thấy dữ liệu tra cứu.');
        }
      } else if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.message || 'Có lỗi xảy ra khi tra cứu điều kiện tài khoản. Vui lòng thử lại.'
        );
      } else {
        setErrorMessage('Có lỗi xảy ra khi tra cứu điều kiện tài khoản. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" />
          <CardTitle className="text-base font-semibold">
            Tra Cứu Điều Kiện Tặng Gói Khách Hàng
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Hỗ trợ nhân viên CS giải đáp câu hỏi &ldquo;Tôi có được tặng gói không?&rdquo; cho từng tài khoản đăng ký mới.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleLookup} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 1. Mã chiến dịch */}
            <div className="space-y-1.5">
              <Label htmlFor="eligibility-campaign" className="text-xs font-medium">
                Mã chiến dịch
              </Label>
              <div className="relative">
                <Input
                  id="eligibility-campaign"
                  placeholder="Ví dụ: launch-2026-10"
                  value={campaignCode}
                  onChange={(e) => setCampaignCode(e.target.value)}
                  className="text-xs font-mono"
                  list="available-campaigns"
                />
                {campaigns.length > 0 && (
                  <datalist id="available-campaigns">
                    {campaigns.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.planName}
                      </option>
                    ))}
                  </datalist>
                )}
              </div>
            </div>

            {/* 2. User ID */}
            <div className="space-y-1.5">
              <Label htmlFor="eligibility-userid" className="text-xs font-medium">
                Mã tài khoản khách hàng (User ID UUID)
              </Label>
              <Input
                id="eligibility-userid"
                placeholder="Ví dụ: b1c2d3e4-aaaa-bbbb-cccc-111122223333"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isLoading} className="gap-1.5">
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Đang tra cứu...
                </>
              ) : (
                <>
                  <Search className="size-3.5" />
                  Tra cứu điều kiện
                </>
              )}
            </Button>
          </div>
        </form>

        {/* 3. Error Alert */}
        {errorMessage && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* 4. Result Card */}
        {result && <CustomerEligibilityResult result={result} />}
      </CardContent>
    </Card>
  );
}
