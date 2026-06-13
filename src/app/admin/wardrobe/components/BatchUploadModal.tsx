"use client";
import { useState, useRef } from "react";
import { X, UploadCloud, AlertCircle, Loader2 } from "lucide-react";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { adminApi } from "@/features/admin/api/admin.api";
import { useCategories } from "@/features/wardrobe/queries/wardrobe.queries";
import { useBatchUploadSystemWardrobeItems } from "@/features/admin/queries/admin.queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadToCloudinary, applyCloudinaryBackgroundRemoval } from "@/lib/cloudinary";

interface BatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BatchUploadModal({ isOpen, onClose }: BatchUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const batchUploadMutation = useBatchUploadSystemWardrobeItems();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles.filter(f => f.type.startsWith('image/'))]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles.filter(f => f.type.startsWith('image/'))]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    if (!selectedCategory) {
      toast.error("Vui lòng chọn danh mục cho batch upload!");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get secure upload signature
      const signatureResult = await adminApi.getUploadSignature();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzvwkngxu";

      const uploadPromises = files.map(async (file) => {
        const uploadResData = await uploadToCloudinary({
          file,
          signatureParams: {
            apiKey: signatureResult.apiKey,
            timestamp: signatureResult.timestamp,
            signature: signatureResult.signature,
            folder: signatureResult.folder,
            // Do not use publicId for batch since it needs to be unique per file.
          },
        });

        const originalUrl = uploadResData.secure_url;
        const publicId = uploadResData.public_id;

        const optimizedUrl = applyCloudinaryBackgroundRemoval(originalUrl);

        return {
          categoryId: selectedCategory,
          imagePublicId: publicId,
          imageUrl: optimizedUrl,
        };
      });

      const uploadedItems = await Promise.all(uploadPromises);

      // Call Admin Batch Upload API
      batchUploadMutation.mutate({ items: uploadedItems }, {
        onSuccess: () => {
          setFiles([]);
          onClose();
        },
        onError: () => {
          setIsUploading(false);
        }
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Đã xảy ra lỗi trong quá trình upload.");
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={!isUploading ? onClose : undefined} />
      
      <div className="relative w-full max-w-3xl bg-white border border-black shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 bg-green-500 animate-pulse"></span>
            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-tighter">Batch Data Ingestion</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="size-8 flex items-center justify-center border border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Category Selector */}
          <div className="mb-6">
            <label className="block text-xs font-mono uppercase tracking-wider text-black font-bold mb-3">
              Assign Classification (Category)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {isLoadingCategories ? (
                <div className="col-span-full py-2">
                  <Loader2 className="animate-spin size-4 text-gray-500" />
                </div>
              ) : categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-2 text-[10px] font-mono uppercase tracking-widest border transition-colors truncate",
                    selectedCategory === cat.id
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:border-black hover:text-black"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-black bg-gray-50 transition-colors p-12 flex flex-col items-center justify-center min-h-[200px] cursor-pointer group"
          >
            <UploadCloud className="size-12 text-gray-400 group-hover:text-black transition-colors mb-4" />
            <p className="font-mono text-xs text-black font-bold uppercase tracking-widest mb-2">Initialize Data Transfer</p>
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em] text-center max-w-sm">
              Drag and drop payloads or click to browse. Max 10 files per batch recommended.
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              multiple
              className="hidden" 
            />
          </div>

          {files.length > 0 && (
            <div className="mt-6 border border-black">
              <div className="p-3 border-b border-black bg-gray-50 font-mono text-[10px] uppercase tracking-[0.2em] text-black font-bold">
                Queued Payloads ({files.length})
              </div>
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-3 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border border-gray-300 bg-white group">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-black truncate max-w-[200px] sm:max-w-[400px]">{file.name}</span>
                      <span className="font-mono text-[10px] text-gray-500 uppercase">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      disabled={isUploading}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 border border-gray-300">
            <AlertCircle className="size-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest leading-relaxed">
              System requires manual attribute validation post-upload. Ensure batch homogeneity. Background removal AI will automatically process payloads.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-black bg-gray-50 flex justify-end gap-4">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="px-6 py-3 border border-black text-black font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            Abort
          </button>
          <button 
            onClick={handleSubmit}
            disabled={files.length === 0 || isUploading}
            className="px-6 py-3 bg-black text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <><Loader2 className="size-4 animate-spin" /> Transmitting...</>
            ) : "Execute Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
