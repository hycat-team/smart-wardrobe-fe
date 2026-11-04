'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Sparkles, Trash2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { StyleChip } from '@/features/style-profile/components/StyleChip';
import { UpgradeInvite } from '@/features/style-profile/components/UpgradeInvite';
import {
  useDeleteStyleProfile,
  useStyleProfile,
  useStyleSuggestions,
  useUpdateStyleProfile,
} from '@/features/style-profile/queries/style-profile.queries';
import {
  AVOIDED_STYLE_OPTIONS,
  LIKED_STYLE_OPTIONS,
  MAX_STYLE_LENGTH,
} from '@/features/style-profile/constants/vocabulary';
import { StyleProfile } from '@/features/style-profile/types';

type ListKey = 'styles' | 'excludedStyles';

const SUGGESTION_PAGE_SIZE = 10;

function normalise(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function sameValue(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function mergeOptions(curated: readonly string[], current: string[]) {
  const extras = current.filter((value) => !curated.some((option) => sameValue(option, value)));
  return [...curated, ...extras];
}

export function StyleProfileClient({ initialProfile }: { initialProfile?: StyleProfile | null }) {
  const { data: profile, isLoading } = useStyleProfile(initialProfile);
  const updateProfile = useUpdateStyleProfile();
  const deleteProfile = useDeleteStyleProfile();

  const locked = profile ? profile.personalizationAvailable === false : false;
  const maxStyles = profile?.maxStyles ?? 4;
  const hasExistingProfile = !!profile && (profile.styles.length > 0 || profile.excludedStyles.length > 0);

  const { data: suggestions, isLoading: isLoadingSuggestions } = useStyleSuggestions(!locked);
  const suggestionList = useMemo(
    () => (suggestions?.styles ?? []).filter((item) => item.itemCount > 0),
    [suggestions]
  );

  const [styles, setStyles] = useState<string[]>([]);
  const [excludedStyles, setExcludedStyles] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [adding, setAdding] = useState<ListKey | null>(null);
  const [draft, setDraft] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [visibleSuggestions, setVisibleSuggestions] = useState(SUGGESTION_PAGE_SIZE);

  useEffect(() => {
    if (!profile || hydrated) return;
    setStyles(profile.styles ?? []);
    setExcludedStyles(profile.excludedStyles ?? []);
    setEnabled(profile.enabled ?? true);
    setHydrated(true);
  }, [profile, hydrated]);

  const dirty =
    !!profile &&
    (enabled !== profile.enabled ||
      styles.length !== profile.styles.length ||
      styles.some((value, index) => value !== profile.styles[index]) ||
      excludedStyles.length !== profile.excludedStyles.length ||
      excludedStyles.some((value, index) => value !== profile.excludedStyles[index]));

  const likedOptions = useMemo(() => mergeOptions(LIKED_STYLE_OPTIONS, styles), [styles]);
  const avoidedOptions = useMemo(() => mergeOptions(AVOIDED_STYLE_OPTIONS, excludedStyles), [excludedStyles]);

  const summary = useMemo(() => {
    const liked = styles.slice(0, 3).join(' · ');
    const avoided = excludedStyles.slice(0, 2).join(', ');
    if (!liked && !avoided) return 'Chưa chọn phong cách nào';
    if (!avoided) return liked;
    return `${liked} — tránh ${avoided}`;
  }, [styles, excludedStyles]);

  const toggleValue = (key: ListKey, value: string) => {
    if (locked) return;
    const current = key === 'styles' ? styles : excludedStyles;
    const setter = key === 'styles' ? setStyles : setExcludedStyles;

    if (current.some((item) => sameValue(item, value))) {
      setter(current.filter((item) => !sameValue(item, value)));
      return;
    }
    if (current.length >= maxStyles) {
      toast.error(`Tối đa ${maxStyles} phong cách`);
      return;
    }
    setter([...current, value]);
  };

  const addCustom = (key: ListKey) => {
    const value = normalise(draft);
    if (!value) {
      setAdding(null);
      setDraft('');
      return;
    }
    if (value.length > MAX_STYLE_LENGTH) {
      toast.error(`Mỗi phong cách tối đa ${MAX_STYLE_LENGTH} ký tự`);
      return;
    }
    const current = key === 'styles' ? styles : excludedStyles;
    if (current.some((item) => sameValue(item, value))) {
      toast.error('Phong cách này đã có trong danh sách');
      return;
    }
    if (current.length >= maxStyles) {
      toast.error(`Tối đa ${maxStyles} phong cách`);
      return;
    }
    if (key === 'styles') setStyles([...styles, value]);
    else setExcludedStyles([...excludedStyles, value]);
    setDraft('');
    setAdding(null);
  };

  const reset = () => {
    if (!profile) return;
    setStyles(profile.styles ?? []);
    setExcludedStyles(profile.excludedStyles ?? []);
    setEnabled(profile.enabled ?? true);
  };

  const save = async () => {
    try {
      await updateProfile.mutateAsync({ styles, excludedStyles, enabled });
    } catch {
      // toast + inline banner handled by the mutation
    }
  };

  const removeProfile = async () => {
    try {
      await deleteProfile.mutateAsync();
      setStyles([]);
      setExcludedStyles([]);
      setEnabled(true);
      setConfirmingDelete(false);
    } catch {
      setConfirmingDelete(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderSection = (
    key: ListKey,
    title: string,
    options: readonly string[],
    selected: string[]
  ) => (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between border-b border-border pb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-foreground">{title}</h2>
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">
          {selected.length}/{maxStyles}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = selected.some((value) => sameValue(value, option));
          const atLimit = selected.length >= maxStyles;
          return (
            <StyleChip
              key={`${key}-${option}`}
              label={option}
              selected={isSelected}
              disabled={locked || (!isSelected && atLimit)}
              onClick={() => toggleValue(key, option)}
            />
          );
        })}

        {!locked && (
          <button
            type="button"
            onClick={() => {
              setAdding(adding === key ? null : key);
              setDraft('');
            }}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-dashed border-border px-5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Thêm
          </button>
        )}
      </div>

      {adding === key && !locked && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addCustom(key);
          }}
          className="flex max-w-md items-center gap-3"
        >
          <input
            autoFocus
            value={draft}
            maxLength={MAX_STYLE_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Nhập phong cách của bạn"
            className="h-11 flex-1 rounded-full border border-border bg-transparent px-5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/40"
          />
          <button
            type="submit"
            className="h-11 rounded-full bg-primary px-6 text-[11px] font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Thêm
          </button>
        </form>
      )}
    </section>
  );

  return (
    <div className="mx-auto w-full max-w-[1020px] px-4 pb-28 pt-8 sm:px-8 md:pt-12">
      <header className="border-b border-border pb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Hồ sơ phong cách
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Gu của tôi
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{summary}</p>
            {profile && !profile.hasEmbedding && !locked && (
              <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground/80">
                Đang so khớp theo từ khoá
              </p>
            )}
          </div>

          {!locked && (
            <label className="flex cursor-pointer items-center gap-3 rounded-full border border-border px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
                Áp dụng
              </span>
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  enabled ? 'bg-[#111111]' : 'bg-border'
                }`}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={enabled}
                  onChange={(event) => setEnabled(event.target.checked)}
                  aria-label="Áp dụng gu vào gợi ý"
                />
                <span
                  className={`absolute size-3.5 rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
                  }`}
                />
              </span>
            </label>
          )}
        </div>
      </header>

      {locked && (
        <div className="mt-8">
          <UpgradeInvite hasExistingProfile={hasExistingProfile} />
        </div>
      )}

      <div className={`mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16 ${locked ? 'opacity-60' : ''}`}>
        {renderSection('styles', 'Tôi mặc', likedOptions, styles)}
        {renderSection('excludedStyles', 'Tôi tránh', avoidedOptions, excludedStyles)}
      </div>

      {!locked && (
        <section className="mt-14 border-t border-border pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-foreground">
              <Sparkles className="size-3.5 text-[#B8A28D]" />
              Từ tủ đồ của bạn
            </h2>
            {suggestions && (
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {suggestions.sampleSize} món
              </span>
            )}
          </div>

          {isLoadingSuggestions ? (
            <div className="mt-6 flex items-center gap-2 text-[12px] text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Đang đọc tủ đồ…
            </div>
          ) : suggestionList.length === 0 ? (
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {suggestions && suggestions.sampleSize === 0
                ? 'Chưa đủ dữ liệu để gợi ý phong cách. Thêm vài món vào tủ đồ rồi quay lại nhé.'
                : 'Chưa có phong cách nào nổi bật trong tủ đồ của bạn.'}
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-border">
              {suggestionList.slice(0, visibleSuggestions).map((item) => {
                const alreadyPicked = styles.some((value) => sameValue(value, item.value));
                return (
                  <li key={item.value} className="flex items-center gap-4 py-3.5">
                    <span className="w-32 shrink-0 text-sm text-foreground">{item.value}</span>
                    <span className="hidden w-16 shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground sm:block">
                      {item.itemCount} món
                    </span>
                    <span className="h-[2px] flex-1 overflow-hidden rounded-full bg-border">
                      <span
                        className="block h-full bg-[#D9C5B2]"
                        style={{ width: `${Math.min(100, Math.round(item.ratio * 100))}%` }}
                      />
                    </span>
                    <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">
                      {Math.round(item.ratio * 100)}%
                    </span>
                    <button
                      type="button"
                      disabled={alreadyPicked || styles.length >= maxStyles}
                      onClick={() => toggleValue('styles', item.value)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40 disabled:opacity-30"
                      aria-label={`Thêm ${item.value} vào gu`}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {suggestionList.length > visibleSuggestions && (
            <button
              type="button"
              onClick={() => setVisibleSuggestions((current) => current + SUGGESTION_PAGE_SIZE)}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              <Plus className="size-3.5" />
              Thêm…
            </button>
          )}
        </section>
      )}

      {!locked && (
        <div className="mt-14 border-t border-border pt-8">
          {confirmingDelete ? (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-foreground">Xoá toàn bộ hồ sơ gu?</span>
              <button
                type="button"
                onClick={removeProfile}
                disabled={deleteProfile.isPending}
                className="text-[11px] font-bold uppercase tracking-widest text-destructive"
              >
                {deleteProfile.isPending ? 'Đang xoá…' : 'Xoá'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
              >
                Huỷ
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              <Trash2 className="size-3.5" />
              Xoá hồ sơ gu
            </button>
          )}
        </div>
      )}

      {locked && (
        <p className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <Lock className="size-3.5" />
          Chỉ đọc — gia hạn gói để chỉnh sửa
        </p>
      )}

      {dirty && !locked && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1020px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Bạn có thay đổi chưa lưu
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="h-11 rounded-full border border-border px-6 text-[11px] font-bold uppercase tracking-widest text-foreground transition-colors hover:border-foreground/40"
              >
                Hoàn tác
              </button>
              <button
                type="button"
                onClick={save}
                disabled={updateProfile.isPending}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-7 text-[11px] font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {updateProfile.isPending && <Loader2 className="size-3.5 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
