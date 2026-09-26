'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OutfitPickerModal } from './OutfitPickerModal';
import { PostRes, OutfitBriefRes, PostMediaReq } from '../types';
import { useCreatePost, useUpdatePost } from '../queries/community.queries';
import { communityApi } from '../api/community.api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { validateMediaFile } from '../utils/community.utils';
import { Loader2, Shirt, Image as ImageIcon, Video, X, Sparkles, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPost?: PostRes | null;
}

interface LocalMediaItem {
  file?: File;
  previewUrl: string;
  mediaType: 'image' | 'video';
  publicId?: string;
  isExisting?: boolean;
}

export const PostComposerModal: React.FC<PostComposerModalProps> = ({
  isOpen,
  onClose,
  editingPost,
}) => {
  const isEditing = !!editingPost;
  const [postType, setPostType] = useState<'outfit' | 'media'>('outfit');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitBriefRes | null>(null);
  const [isOutfitPickerOpen, setIsOutfitPickerOpen] = useState(false);
  const [mediaList, setMediaList] = useState<LocalMediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  // Populate state when editing
  useEffect(() => {
    if (editingPost) {
      setPostType(editingPost.postType);
      setTitle(editingPost.title || '');
      setContent(editingPost.content || '');
      setSelectedOutfit(editingPost.outfit || null);
      if (editingPost.media && editingPost.media.length > 0) {
        setMediaList(
          editingPost.media.map((m) => ({
            previewUrl: m.mediaUrl,
            mediaType: m.mediaType,
            publicId: m.publicId,
            isExisting: true,
          }))
        );
      } else {
        setMediaList([]);
      }
    } else {
      setPostType('outfit');
      setTitle('');
      setContent('');
      setSelectedOutfit(null);
      setMediaList([]);
    }
  }, [editingPost, isOpen]);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const availableSlots = 10 - mediaList.length;

    if (availableSlots <= 0) {
      toast.error('Mỗi bài viết chỉ được đính kèm tối đa 10 tệp media.');
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    const newItems: LocalMediaItem[] = [];

    for (const file of filesToProcess) {
      const validation = await validateMediaFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || 'Tệp không hợp lệ.');
        continue;
      }
      newItems.push({
        file,
        previewUrl: URL.createObjectURL(file),
        mediaType: validation.mediaType || 'image',
      });
    }

    setMediaList((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 150) {
      toast.error('Tiêu đề không được vượt quá 150 ký tự.');
      return;
    }

    if (trimmedContent.length > 5000) {
      toast.error('Nội dung bài viết không được vượt quá 5000 ký tự.');
      return;
    }

    if (postType === 'outfit') {
      if (!selectedOutfit?.id) {
        toast.error('Vui lòng chọn một bộ trang phục từ tủ đồ của bạn.');
        return;
      }
    } else {
      if (!trimmedContent && mediaList.length === 0) {
        toast.error('Bài viết phải có ít nhất nội dung chia sẻ hoặc 1 hình ảnh/video.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const uploadedMedia: PostMediaReq[] = [];

      // 1. Process media uploads
      for (let i = 0; i < mediaList.length; i++) {
        const item = mediaList[i];
        if (item.isExisting) {
          uploadedMedia.push({
            mediaType: item.mediaType,
            mediaUrl: item.previewUrl,
            publicId: item.publicId,
            sortOrder: i,
          });
        } else if (item.file) {
          // Get signature for resourceType
          const sig = await communityApi.getPostUploadSignature({
            resourceType: item.mediaType,
          });

          const cloudRes = await uploadToCloudinary({
            file: item.file,
            signatureParams: {
              apiKey: sig.apiKey,
              timestamp: sig.timestamp,
              signature: sig.signature,
              folder: sig.folder,
              publicId: sig.publicId,
              resourceType: sig.resourceType,
            },
            resourceType: item.mediaType,
          });

          uploadedMedia.push({
            mediaType: item.mediaType,
            mediaUrl: cloudRes.secure_url,
            publicId: cloudRes.public_id,
            sortOrder: i,
          });
        }
      }

      // 2. Submit post
      if (isEditing && editingPost) {
        updatePost(
          {
            postPublicID: editingPost.publicId,
            data: {
              title: trimmedTitle || undefined,
              content: trimmedContent,
              outfitId: postType === 'outfit' ? selectedOutfit?.id : undefined,
              media: postType === 'media' ? uploadedMedia : undefined,
            },
          },
          {
            onSuccess: () => {
              onClose();
            },
            onSettled: () => {
              setIsSubmitting(false);
            },
          }
        );
      } else {
        createPost(
          {
            postType,
            title: trimmedTitle || undefined,
            content: trimmedContent,
            outfitId: postType === 'outfit' ? selectedOutfit?.id : undefined,
            media: postType === 'media' ? uploadedMedia : undefined,
          },
          {
            onSuccess: () => {
              onClose();
            },
            onSettled: () => {
              setIsSubmitting(false);
            },
          }
        );
      }
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi tải ảnh/video lên.');
      setIsSubmitting(false);
    }
  };

  const isPending = isCreating || isUpdating || isSubmitting;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
        <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden bg-background rounded-3xl border border-border shadow-2xl">
          <DialogHeader className="px-6 py-4 border-b border-border flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">
              {isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết thời trang'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Post Type Selector (Disabled in Edit mode as postType cannot be changed) */}
            {!isEditing && (
              <div className="px-6 pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPostType('outfit')}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all',
                    postType === 'outfit'
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Shirt className="w-4 h-4" />
                  <span>Trang phục (Outfit)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('media')}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all',
                    postType === 'media'
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Hình ảnh / Video</span>
                </button>
              </div>
            )}

            <div className="px-6 py-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Title input */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tiêu đề bài viết (không bắt buộc, tối đa 150 ký tự)..."
                  maxLength={150}
                  className="w-full bg-transparent border-b border-border/60 focus:border-primary text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none py-2 transition-colors"
                />
              </div>

              {/* Content textarea */}
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Chia sẻ cảm hứng, cách phối đồ, chất liệu hoặc mẹo phong cách của bạn..."
                  rows={4}
                  maxLength={5000}
                  className="w-full bg-transparent border border-border rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none transition-colors"
                />
              </div>

              {/* Outfit Attachment Section */}
              {postType === 'outfit' && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Bộ trang phục đính kèm <span className="text-destructive">*</span>
                  </span>
                  {selectedOutfit ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl border border-primary/40 bg-primary/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-14 rounded-lg relative overflow-hidden bg-muted shrink-0">
                          {selectedOutfit.coverImageUrl ? (
                            <Image
                              src={selectedOutfit.coverImageUrl}
                              alt={selectedOutfit.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Shirt className="w-6 h-6 m-auto opacity-30" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs text-foreground truncate">
                            {selectedOutfit.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">Đã chọn từ tủ đồ</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsOutfitPickerOpen(true)}
                        className="text-xs rounded-full h-8"
                      >
                        Đổi bộ khác
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsOutfitPickerOpen(true)}
                      className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all group bg-muted/20"
                    >
                      <Shirt className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Chọn bộ trang phục từ tủ đồ của bạn
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Media Attachment Section */}
              {postType === 'media' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Hình ảnh hoặc Video (Tối đa 10 tệp)
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {mediaList.length}/10
                    </span>
                  </div>

                  {/* Media preview grid */}
                  {mediaList.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                      {mediaList.map((item, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group"
                        >
                          {item.mediaType === 'video' ? (
                            <div className="relative w-full h-full bg-black flex items-center justify-center">
                              <video src={item.previewUrl} className="w-full h-full object-cover opacity-80" />
                              <Video className="w-6 h-6 text-white absolute" />
                            </div>
                          ) : (
                            <Image src={item.previewUrl} alt="preview" fill className="object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {mediaList.length < 10 && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFilesSelected}
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                        multiple
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all bg-muted/20"
                      >
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span>Thêm ảnh hoặc video (Ảnh ≤ 10MB, Video ≤ 100MB/60s)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isPending}
                className="rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-full px-6 text-xs font-bold uppercase tracking-wider gap-2 shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isSubmitting ? 'Đang tải tệp...' : 'Đang xử lý...'}</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Cập nhật' : 'Đăng bài'}</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Outfit Picker Nested Modal */}
      <OutfitPickerModal
        isOpen={isOutfitPickerOpen}
        onClose={() => setIsOutfitPickerOpen(false)}
        onSelect={(outfit) => setSelectedOutfit(outfit)}
        selectedOutfitId={selectedOutfit?.id}
      />
    </>
  );
};
