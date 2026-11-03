'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BENEFITS = [
  { index: '01', text: 'Hệ thống nhớ gu giữa các lần phối' },
  { index: '02', text: 'Tự học từ những bộ đồ bạn đã lưu' },
  { index: '03', text: 'Gợi ý bù món còn thiếu trong tủ' },
];

interface UpgradeInviteProps {
  /** True when the account used to have an active entitlement, so the copy explains data is kept. */
  hasExistingProfile?: boolean;
}

/**
 * In-place paywall. Never redirects: the page frame stays visible so the user can see what the
 * entitlement unlocks, and the only action is a link to the public pricing page.
 */
export function UpgradeInvite({ hasExistingProfile = false }: UpgradeInviteProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E5E2DE] bg-gradient-to-br from-[#F7F1EA] via-[#FBF8F5] to-transparent p-8 md:p-12">
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#D9C5B2]/25 blur-3xl" />
      <div className="relative max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {hasExistingProfile ? 'Gói của bạn đã hết hạn' : 'Đặc quyền hội viên'}
        </p>
        <h2 className="mt-4 font-heading text-3xl md:text-4xl font-bold text-foreground">
          {hasExistingProfile ? 'Gu vẫn được giữ, chỉ chưa được áp dụng' : 'Gu của bạn, được nhớ mỗi lần phối'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {hasExistingProfile
            ? 'Gia hạn để hệ thống dùng lại gu đã lưu và tiếp tục học từ những bộ đồ mới.'
            : 'Cá nhân hoá phối đồ là đặc quyền của gói hội viên. Gu đã khai vẫn hiển thị để bạn xem lại.'}
        </p>

        <ul className="mt-8 divide-y divide-[#E5E2DE] border-y border-[#E5E2DE]">
          {BENEFITS.map((benefit) => (
            <li key={benefit.index} className="flex items-center gap-5 py-3.5">
              <span className="font-mono text-[11px] tracking-widest text-[#B8A28D]">{benefit.index}</span>
              <span className="text-sm text-foreground">{benefit.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Xem các gói
            <ArrowRight className="size-3.5" />
          </Link>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Không tự động trừ tiền
          </span>
        </div>
      </div>
    </div>
  );
}
