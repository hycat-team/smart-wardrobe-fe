import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getCampaignStatusConfig, formatCampaignStatusLabel } from '../utils/campaign-status';
import { CampaignStatus } from '../types/campaign-admin.types';
import { cn } from '@/lib/utils';

interface CampaignStatusBadgeProps {
  status: CampaignStatus | string;
  closedAt?: string | null;
  className?: string;
}

export function CampaignStatusBadge({ status, closedAt, className }: CampaignStatusBadgeProps) {
  const config = getCampaignStatusConfig(status);
  const label = formatCampaignStatusLabel(status, closedAt);

  const badgeElement = (
    <Badge
      variant="outline"
      className={cn('px-2.5 py-0.5 text-xs rounded-full border', config.badgeClassName, className)}
    >
      <span className="inline-block size-1.5 rounded-full bg-current mr-1.5 shrink-0 opacity-80" />
      {label}
    </Badge>
  );

  if (status === 'closed' && closedAt) {
    const formattedDate = new Date(closedAt).toLocaleString('vi-VN');
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-help inline-block">
            {badgeElement}
          </TooltipTrigger>
          <TooltipContent className="text-xs bg-popover text-popover-foreground border shadow-sm">
            <p className="font-semibold text-red-500">Đã đóng cưỡng bức</p>
            <p>Thời điểm: {formattedDate}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeElement;
}
