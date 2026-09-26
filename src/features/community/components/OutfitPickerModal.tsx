'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMyOutfits } from '@/features/outfits/queries/outfits.queries';
import { OutfitBriefRes } from '../types';
import { Loader2, Search, Shirt, Check } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OutfitPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (outfit: OutfitBriefRes) => void;
  selectedOutfitId?: string;
}

export const OutfitPickerModal: React.FC<OutfitPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedOutfitId,
}) => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMyOutfits(1);

  const outfits = data?.items || [];
  const filteredOutfits = outfits.filter((outfit: any) =>
    (outfit.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background rounded-3xl border border-border shadow-xl">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Shirt className="w-5 h-5 text-primary" />
            <span>Chọn bộ trang phục từ tủ đồ</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên bộ trang phục..."
              className="w-full bg-muted border border-border rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Outfit grid */}
          <div className="max-h-[380px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Đang tải tủ đồ của bạn...</span>
              </div>
            ) : filteredOutfits.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center text-muted-foreground">
                <Shirt className="w-10 h-10 opacity-40 mb-2 stroke-1" />
                <p className="text-sm font-medium">Không tìm thấy bộ phối đồ nào.</p>
                <p className="text-xs mt-1">Hãy tạo phối đồ trong mục "Tủ đồ" trước khi chia sẻ.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredOutfits.map((outfit: any) => {
                  const isSelected = selectedOutfitId === outfit.id;
                  const coverImage = outfit.coverImageUrl || outfit.thumbnailUrl || outfit.imageUrl;

                  return (
                    <div
                      key={outfit.id}
                      onClick={() => {
                        onSelect({
                          id: outfit.id,
                          name: outfit.name || 'Bộ trang phục',
                          coverImageUrl: coverImage,
                        });
                        onClose();
                      }}
                      className={cn(
                        'relative flex flex-col rounded-2xl border p-2 cursor-pointer transition-all group overflow-hidden bg-card hover:border-primary/60',
                        isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border'
                      )}
                    >
                      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-2">
                        {coverImage ? (
                          <Image
                            src={coverImage}
                            alt={outfit.name || 'Outfit'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Shirt className="w-8 h-8 opacity-30" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-xs text-foreground truncate px-1">
                        {outfit.name || 'Bộ phối đồ'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
