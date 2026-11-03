'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * One selectable style. Selected chips use the warm sand accent instead of the charcoal primary so the
 * section reads as a curated swatch wall rather than a form of buttons.
 */
export function StyleChip({ label, selected, disabled, onClick }: StyleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[13px] tracking-wide transition-all duration-200',
        selected
          ? 'border-[#D9C5B2] bg-[#D9C5B2] text-[#111111]'
          : 'border-border bg-transparent text-foreground hover:border-foreground/40',
        disabled && !selected && 'opacity-40 cursor-not-allowed',
        !disabled && 'active:scale-[0.98]'
      )}
    >
      {selected && <Check className="size-3.5" strokeWidth={2.5} />}
      {label}
    </button>
  );
}
