"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Sparkles, Check, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBatchUploadWardrobeItems, useCategories } from "@/features/wardrobe/queries/wardrobe.queries";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadToCloudinary, applyCloudinaryBackgroundRemoval } from "@/lib/cloudinary";

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
      const uploadResData = await uploadToCloudinary({
        file,
        signatureParams: {
          apiKey: signatureResult.apiKey,
          timestamp: signatureResult.timestamp,
          signature: signatureResult.signature,
          folder: signatureResult.folder,
          publicId: signatureResult.publicId,
        },
      });

      const originalUrl = uploadResData.secure_url;
      const publicId = uploadResData.public_id;

      // 3. Apply background removal & format/quality optimization transformations
      const optimizedUrl = applyCloudinaryBackgroundRemoval(originalUrl);

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
    // <div className="w-full flex flex-col animate-in fade-in duration-500 pt-6 md:pt-[105px] pb-8 px-4 md:px-[160px] font-sans selection:bg-ink selection:text-cream">
    <div className="max-w-[1400px] mx-auto space-y-8 pb-16 px-4 sm:px-8 lg:px-12 mt-12 font-sans selection:bg-ink selection:text-cream">
      
      {/* Editorial Header */}
      <div className="flex flex-col gap-8 border-b border-ink/10 pb-6">
      
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-[100px] font-heading font-medium tracking-tighter text-ink leading-[0.85] uppercase">
            Digitize <span className="text-[#D03027]">Item</span>
          </h1>
          <p className="text-sm text-ink-muted font-mono uppercase tracking-[0.1em] max-w-md leading-relaxed border-l border-ink/20 pl-4">
            Upload raw photos. AI will automatically remove backgrounds, compress files, and extract material & style metadata.
          </p>
        </div>
      </div>

      {!preview ? (
        // Step 1: Upload Area
        <div className="w-full grid md:grid-cols-12 gap-12 items-start">
          
          {/* Category Selector */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-ink/20 pb-4">
              <span className="bg-ink text-cream font-mono text-[10px] uppercase px-2 py-1 tracking-widest font-bold">01</span>
              <h2 className="font-heading text-2xl uppercase tracking-tight text-ink">Select Category</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {isLoadingCategories ? (
                <div className="col-span-2 flex justify-center py-12 border-2 border-dashed border-ink/20">
                  <Loader2 className="animate-spin size-6 text-ink" />
                </div>
              ) : categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-3 rounded-none text-[11px] font-mono font-bold uppercase tracking-widest transition-all text-left border-2",
                    selectedCategory === cat.id
                      ? "border-ink bg-ink text-cream shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] translate-x-[-2px] translate-y-[-2px]"
                      : "border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink/5"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dropzone */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-4 border-b-2 border-ink/20 pb-4 mb-6">
              <span className="bg-ink text-cream font-mono text-[10px] uppercase px-2 py-1 tracking-widest font-bold">02</span>
              <h2 className="font-heading text-2xl uppercase tracking-tight text-ink">Upload Image</h2>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square md:aspect-[4/3] border-2 border-dashed border-ink bg-[#F3F0EA] hover:bg-ink/5 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all group shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              <div className="size-20 border-2 border-ink bg-cream flex items-center justify-center text-ink group-hover:rotate-12 transition-transform duration-300">
                <UploadCloud className="size-8" />
              </div>
              <div className="space-y-2 text-center">
                <p className="font-heading text-2xl uppercase tracking-tight text-ink group-hover:text-[#D03027] transition-colors">Drop File Here</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">PNG, JPG, HEIC (Max 5MB)</p>
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
        </div>
      ) : (
        // Step 2: Preview & Send Action
        <div className="w-full grid md:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          <div className="md:col-span-5 relative w-full aspect-[3/4] bg-cream border-2 border-ink shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] p-2 mx-auto max-w-sm md:max-w-none">
            <div className="w-full h-full border border-ink/20 relative overflow-hidden bg-cream-dark/50">
              <img src={preview} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
              
              {/* Uploading Animation Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-[#F3F0EA]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-6">
                   <div className="size-16 border-4 border-ink border-t-transparent rounded-full animate-spin" />
                   <div className="text-center">
                     <p className="font-heading font-bold text-3xl text-ink uppercase tracking-tighter animate-pulse">Processing</p>
                     <p className="font-mono text-[10px] uppercase tracking-widest text-[#D03027] mt-2">AI Background Removal</p>
                   </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleReset}
              className="absolute -top-4 -right-4 size-10 bg-[#D03027] border-2 border-ink text-cream flex items-center justify-center hover:bg-ink transition-all z-20 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] outline-none"
              disabled={isUploading}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="md:col-span-7 flex flex-col justify-center h-full space-y-10 pt-8 md:pt-0">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Selected Category</span>
                <span className="font-mono text-xs uppercase tracking-widest text-ink font-bold border-b-2 border-[#D03027] pb-1">
                  {categories.find(x => x.id === selectedCategory)?.name || "Loading..."}
                </span>
              </div>
              
              <h2 className="text-5xl font-heading uppercase tracking-tighter text-ink leading-[0.9]">
                Ready for <br/> Extraction
              </h2>
              
              <p className="font-mono text-[11px] text-ink/80 leading-relaxed uppercase tracking-widest border-l-2 border-ink pl-4 max-w-md">
                Image will be securely sent to Cloudinary for AI-powered background removal and compression, then passed to our styling engine for metadata analysis.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button 
                onClick={handleUploadAndAnalyze} 
                disabled={isUploading}
                className="flex-1 h-14 rounded-none bg-ink text-cream font-mono text-sm tracking-[0.15em] uppercase hover:bg-[#F3F0EA] hover:text-ink border-2 border-ink shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex items-center justify-center gap-3"
              >
                {isUploading ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
                Analyze Image
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset} 
                disabled={isUploading}
                className="sm:w-32 h-14 rounded-none bg-transparent border-2 border-ink text-ink font-mono text-xs tracking-widest uppercase hover:bg-ink hover:text-cream transition-colors"
              >
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
