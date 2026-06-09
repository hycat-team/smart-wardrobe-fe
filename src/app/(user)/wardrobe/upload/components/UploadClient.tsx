"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Sparkles, Check, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBatchUploadWardrobeItems, useCategories } from "@/features/wardrobe/queries/wardrobe.queries";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Seeded categories removed, using API instead

export function UploadClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const batchUploadMutation = useBatchUploadWardrobeItems();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Helper to transform URL with Cloudinary AI background removal + compression
  function getOptimizedBackgroundRemovedUrl(url: string): string {
    if (!url || !url.includes("cloudinary.com")) return url;
    let newUrl = url;
    // Đổi đuôi file thành .png để giữ nền trong suốt
    newUrl = newUrl.replace(/\.[^/.]+$/, ".png");
    if (newUrl.includes("/upload/")) {
      // Bắt buộc dùng f_png thay vì f_auto để đảm bảo Cloudinary trả về định dạng hỗ trợ trong suốt
      return newUrl.replace("/upload/", "/upload/e_background_removal,f_png,q_auto/");
    }
    return newUrl;
  }

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh trước!");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get secure upload signature
      const signatureResult = await wardrobeApi.getUploadSignature();

      // 2. Upload direct to Cloudinary
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzvwkngxu";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureResult.apiKey);
      formData.append("timestamp", signatureResult.timestamp.toString());
      formData.append("signature", signatureResult.signature);
      formData.append("folder", signatureResult.folder);
      if (signatureResult.publicId) {
        formData.append("public_id", signatureResult.publicId);
      }

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary upload error details:", errorText);
        throw new Error("Không thể upload ảnh lên Cloudinary");
      }

      const uploadResData = await response.json();
      const originalUrl = uploadResData.secure_url;
      const publicId = uploadResData.public_id;

      // 3. Apply background removal & format/quality optimization transformations
      const optimizedUrl = getOptimizedBackgroundRemovedUrl(originalUrl);

      // 4. Send crop & analysis request to backend
      await batchUploadMutation.mutateAsync({
        items: [
          {
            categoryId: selectedCategory,
            imagePublicId: publicId,
            imageUrl: optimizedUrl,
          },
        ],
      });

      // 5. Success redirect to wardrobe
      toast.success("Upload ảnh và bắt đầu số hóa AI thành công!");
      router.push("/wardrobe");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Đã xảy ra lỗi trong quá trình upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100dvh-150px)] flex flex-col items-center justify-center animate-in fade-in duration-500 py-8">
      {!preview ? (
        // Step 1: Upload Area
        <div className="w-full text-center space-y-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink mb-2">Thêm Đồ Mới</h1>
            <p className="text-ink-muted">Tải ảnh lên và để AI tự động phân loại, tách nền & tối ưu dung lượng.</p>
          </div>

          {/* Category Selector */}
          <div className="max-w-md mx-auto space-y-3 bg-cream-dark/20 p-6 rounded-2xl border border-cream-dark">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink font-semibold">
              Chọn danh mục trước khi tải lên
            </label>
            <div className="grid grid-cols-3 gap-2">
              {isLoadingCategories ? (
                <div className="col-span-3 flex justify-center py-4">
                  <Loader2 className="animate-spin size-6 text-muted-foreground" />
                </div>
              ) : categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-medium border transition-all truncate",
                    selectedCategory === cat.id
                      ? "border-ink bg-ink text-cream font-semibold"
                      : "border-cream-dark bg-transparent text-ink-muted hover:bg-cream-dark/50"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-xl mx-auto aspect-[4/3] border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 hover:bg-primary/5 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
          >
            <div className="size-20 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <UploadCloud className="size-10" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-ink">Kéo thả ảnh hoặc click để chọn</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, HEIC (Max 5MB)</p>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        // Step 2: Preview & Send Action
        <div className="w-full h-full grid md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full aspect-[4/5] bg-muted rounded-3xl overflow-hidden shadow-lg border border-border">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            
            {/* Uploading Animation Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white space-y-4">
                 <Loader2 className="size-10 text-primary animate-spin" />
                 <p className="font-heading font-bold text-xl animate-pulse">Đang tải lên và phân tích...</p>
                 <span className="text-xs opacity-75 font-mono text-center px-4">
                   (Tự động xóa nền & tối ưu dung lượng qua Cloudinary AI)
                 </span>
              </div>
            )}
            
            <button 
              onClick={handleReset}
              className="absolute top-4 right-4 size-10 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center text-ink hover:bg-background transition-colors z-20"
              disabled={isUploading}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-dark text-ink text-xs font-mono border border-cream-dark/50">
                Danh mục: {categories.find(x => x.id === selectedCategory)?.name || "Đang tải..."}
              </div>
              <h2 className="text-3xl font-heading font-bold text-ink">Bắt đầu phân tích AI</h2>
              <p className="text-ink-muted leading-relaxed">
                Hệ thống sẽ tải ảnh lên Cloudinary bảo mật, tự động kích hoạt **Cloudinary AI Background Removal** để xóa sạch nền và nén dung lượng, sau đó đẩy về backend để AI phân tích chất liệu, màu sắc và phong cách.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleReset} 
                  disabled={isUploading}
                  className="flex-1 h-12 rounded-xl border-cream-dark hover:bg-cream-dark/50"
                >
                  Chọn lại
                </Button>
                <Button 
                  onClick={handleUploadAndAnalyze} 
                  disabled={isUploading}
                  className="flex-1 h-12 rounded-xl bg-ink text-cream hover:bg-ink/90 shadow-lg shadow-ink/20 group flex items-center justify-center gap-2"
                >
                  <Sparkles className="size-5" /> Tải lên tủ đồ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
