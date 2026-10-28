import type { BrandItemRes } from '@/features/brand-portal/types';

function MetaChip({ label, value, swatch }: { label: string; value?: string | null; swatch?: string | null }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      <span className="text-[9px] opacity-60">{label}</span>
      {swatch ? (
        <span className="inline-block size-2.5 rounded-full border border-border" style={{ backgroundColor: swatch }} />
      ) : null}
      <span className="text-foreground">{value}</span>
    </span>
  );
}

export function BrandItemMetaChips({ item }: { item: BrandItemRes }) {
  const meta = item.fashionItem;
  return (
    <div className="flex flex-wrap gap-1.5">
      <MetaChip label="DM" value={meta?.category?.name} />
      <MetaChip label="Màu" value={meta?.color} swatch={meta?.colorHex} />
      <MetaChip label="CL" value={meta?.material} />
      <MetaChip label="Form" value={meta?.fit} />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm text-foreground">{value}</span>
    </div>
  );
}

export function BrandItemMetaPanel({ item }: { item: BrandItemRes }) {
  const meta = item.fashionItem;
  const hasMeta =
    meta?.category || meta?.color || meta?.material || meta?.style || meta?.pattern || meta?.fit || meta?.seasonality;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        Thuộc tính AI phân tích
      </h2>
      {hasMeta ? (
        <div>
          <MetaRow label="Danh mục" value={meta?.category?.name} />
          <MetaRow label="Màu sắc" value={meta?.color ? `${meta.color}${meta.colorHex ? ` (${meta.colorHex})` : ''}` : undefined} />
          <MetaRow label="Phong cách" value={meta?.style} />
          <MetaRow label="Chất liệu" value={meta?.material} />
          <MetaRow label="Họa tiết" value={meta?.pattern} />
          <MetaRow label="Kiểu dáng" value={meta?.fit} />
          <MetaRow label="Thời tiết" value={meta?.seasonality} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có dữ liệu phân tích.</p>
      )}
      {meta?.description && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Mô tả AI</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{meta.description}</p>
        </div>
      )}
    </section>
  );
}
