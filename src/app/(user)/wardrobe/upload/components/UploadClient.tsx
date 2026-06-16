"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Sparkles, Loader2, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBatchUploadWardrobeItems, useCategories } from "@/features/wardrobe/queries/wardrobe.queries";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadToCloudinary, applyCloudinaryBackgroundRemoval } from "@/lib/cloudinary";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

gsap.registerPlugin(useGSAP);

interface SelectedFile {
  id: string;
  file: File;
  preview: string;
  categoryId: string;
}

export function UploadClient() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [uploadState, setUploadState] = useState<{ status: 'idle' | 'uploading' | 'analyzing' | 'success', current: number, total: number }>({
    status: 'idle', current: 0, total: 0
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const batchUploadMutation = useBatchUploadWardrobeItems();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      if (files.length + selectedFiles.length > 5) {
        toast.error("Bạn chỉ được upload tối đa 5 ảnh mỗi lần!");
        return;
      }

      const newFiles = selectedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        categoryId: selectedCategory || (categories.length > 0 ? categories[0].id : ""),
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileCategory = (id: string, newCategoryId: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, categoryId: newCategoryId } : f));
  };

  const handleUploadAndAnalyze = async () => {
    if (files.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }

    if (files.length > 5) {
      toast.error("Chỉ được upload tối đa 5 ảnh!");
      return;
    }

    setUploadState({ status: 'uploading', current: 0, total: files.length });
    try {
      // 1. Get secure upload signature
      const signatureResult = await wardrobeApi.getUploadSignature();
      
      const uploadedItems = [];

      // 2. Upload direct to Cloudinary sequentially to track progress accurately
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setUploadState({ status: 'uploading', current: i + 1, total: files.length });
        
        const uploadResData = await uploadToCloudinary({
          file: item.file,
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
        
        uploadedItems.push({
          categoryId: item.categoryId,
          imagePublicId: publicId,
          imageUrl: optimizedUrl,
        });
      }

      // 4. Send crop & analysis request to backend
      setUploadState({ status: 'analyzing', current: files.length, total: files.length });
      await batchUploadMutation.mutateAsync({
        items: uploadedItems,
      });

      // 5. Success redirect to wardrobe
      setUploadState({ status: 'success', current: files.length, total: files.length });
      toast.success("Đã gửi ảnh cho AI phân tích thành công!");
      router.push("/wardrobe");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Đã xảy ra lỗi trong quá trình upload.");
      setUploadState({ status: 'idle', current: 0, total: 0 });
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadState({ status: 'idle', current: 0, total: 0 });
  };

  // GSAP Animations
  useGSAP(() => {
    // Entrance animation
    const tl = gsap.timeline();
    tl.from(".gsap-header", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 })
      .from(".gsap-step", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.15 }, "-=0.4");
  }, { scope: containerRef });

  // Transition animation when preview changes
  useGSAP(() => {
    if (files.length > 0) {
      gsap.fromTo(".gsap-preview-container", {
        opacity: 0,
        y: 20,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      });
      gsap.fromTo(".preview-card", {
        opacity: 0,
        scale: 0.9,
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.5)"
      });
    } else {
      gsap.from(".gsap-upload-container", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  }, { scope: containerRef, dependencies: [files.length] });

  const isUploading = uploadState.status !== 'idle' && uploadState.status !== 'success';

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto space-y-8 pb-16 px-4 sm:px-8 lg:px-12 mt-12 font-sans selection:bg-ink selection:text-cream">
      
      {/* Editorial Header */}
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 gsap-header">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-[72px] font-['Playfair_Display'] font-medium tracking-tight text-[#111] leading-[1.1]">
            Số hóa Trang phục
          </h1>
          <p className="text-[11px] text-[#666] font-['IBM_Plex_Mono'] uppercase tracking-[0.1em] max-w-md leading-relaxed border-l border-black/20 pl-4">
            Tải lên tối đa 5 ảnh thô cùng lúc. AI sẽ tự động tách nền, tối ưu dung lượng, và phân tích các thông số về chất liệu & phong cách.
          </p>
        </div>
      </div>

      {files.length === 0 ? (
        // Step 1: Upload Area
        <div className="w-full grid md:grid-cols-12 gap-12 items-start gsap-upload-container">
          
          {/* Category Selector */}
          <div className="md:col-span-5 space-y-8 gsap-step">
            <div className="flex items-center gap-4 border-b border-black/10 pb-4">
              <span className="bg-[#111] text-white font-['IBM_Plex_Mono'] text-[10px] uppercase px-2 py-1 tracking-widest font-bold">01</span>
              <h2 className="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#111] uppercase">Chọn Danh Mục</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {isLoadingCategories ? (
                <div className="col-span-2 flex justify-center py-12 border border-dashed border-black/10">
                  <Loader2 className="animate-spin size-6 text-[#111]" />
                </div>
              ) : categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-4 rounded-none text-[11px] font-['IBM_Plex_Mono'] font-medium uppercase tracking-[0.1em] transition-colors text-left border",
                    selectedCategory === cat.id
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-black/10 bg-white text-[#333] hover:border-black/30 hover:bg-[#F8F7F5]"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dropzone */}
          <div className="md:col-span-7 gsap-step">
            <div className="flex items-center gap-4 border-b border-black/10 pb-4 mb-8">
              <span className="bg-[#111] text-white font-['IBM_Plex_Mono'] text-[10px] uppercase px-2 py-1 tracking-widest font-bold">02</span>
              <h2 className="font-['Playfair_Display'] text-xl tracking-[0.05em] text-[#111] uppercase">Tải Lên Hình Ảnh</h2>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square md:aspect-[4/3] border border-dashed border-black/30 bg-[#F8F7F5] hover:bg-[#F4F3F0] flex flex-col items-center justify-center gap-6 cursor-pointer transition-colors group"
            >
              <div className="size-16 border border-black/10 bg-white flex items-center justify-center text-[#111] transition-transform duration-500 ease-out group-hover:scale-110 shadow-sm">
                <UploadCloud className="size-6 stroke-[1.5]" />
              </div>
              <div className="space-y-3 text-center px-4">
                <p className="font-['Playfair_Display'] text-2xl tracking-[0.02em] text-[#111]">Thả Nhiều File Vào Đây</p>
                <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#666]">PNG, JPG, HEIC (Tối đa 5 file, mỗi file max 5MB)</p>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              multiple
              className="hidden" 
            />
          </div>
        </div>
      ) : (
        // Step 2: Preview & Send Action
        <div className="w-full grid md:grid-cols-12 gap-12 items-start gsap-preview-container">
          
          <div className="md:col-span-7 flex flex-col h-full space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
               <h2 className="font-['Playfair_Display'] text-2xl tracking-[0.05em] text-[#111] uppercase">Đã chọn {files.length}/5 ảnh</h2>
               {!isUploading && files.length < 5 && (
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="text-[10px] font-['IBM_Plex_Mono'] font-medium uppercase tracking-[0.1em] text-[#666] hover:text-[#111] flex items-center gap-2 transition-colors"
                 >
                   <ImagePlus className="size-4 stroke-[1.5]" /> Thêm ảnh
                 </button>
               )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((item, idx) => (
                <div key={item.id} className="preview-card group flex flex-col relative bg-[#F8F7F5] border border-black/5 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out">
                  
                  <button 
                    onClick={() => removeFile(item.id)}
                    className="absolute -top-3 -right-3 size-8 bg-[#D03027] text-white flex items-center justify-center hover:bg-black transition-all z-30 outline-none rounded-full shadow-md"
                    disabled={isUploading}
                  >
                    <X className="size-4" />
                  </button>
                  <div className="absolute top-2 left-2 bg-black text-white font-['IBM_Plex_Mono'] text-[9px] px-2 py-1 uppercase font-bold z-20 shadow-sm">
                    Ảnh {idx + 1}
                  </div>

                  {/* Image Area - 75% Visual Weight */}
                  <div className="relative aspect-[4/5] bg-[#F7F6F4] p-[16px] overflow-hidden flex-shrink-0">
                    <img src={item.preview} alt="Preview" className="w-full h-full object-contain drop-shadow-sm" />
                    
                    {/* Uploading Overlay */}
                    {isUploading && uploadState.current === idx + 1 && uploadState.status === 'uploading' && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                         <div className="size-8 border-2 border-black/20 border-t-black rounded-full animate-spin mb-3" />
                         <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold text-black bg-white/90 px-3 py-1.5 shadow-sm tracking-widest">ĐANG TẢI LÊN</span>
                      </div>
                    )}
                    {isUploading && (uploadState.current > idx + 1 || uploadState.status === 'analyzing') && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                         <div className="bg-black text-white p-1.5 rounded-full mb-2"><Sparkles className="size-4" /></div>
                         <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold text-black bg-white/90 px-3 py-1.5 shadow-sm tracking-widest">AI XỬ LÝ</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Information Area - 25% Visual Weight */}
                  <div className="flex flex-col p-4 pt-4 flex-grow justify-between gap-3 bg-white border-t border-black/5">
                    <div>
                      <h3 className="font-['Playfair_Display'] text-[16px] font-medium leading-[130%] text-[#111] line-clamp-1 mb-3" title={item.file.name}>
                        {item.file.name.replace(/\.[^/.]+$/, "")}
                      </h3>
                      {/* Individual Category Selector */}
                      <Select 
                        disabled={isUploading}
                        value={item.categoryId} 
                        onValueChange={(val) => updateFileCategory(item.id, val)}
                      >
                        <SelectTrigger className="w-full h-8 bg-[#F7F6F4] border border-black/10 text-[10px] font-['IBM_Plex_Mono'] font-medium uppercase tracking-widest rounded-none shadow-none outline-none focus:ring-0">
                          <SelectValue placeholder="Danh mục">
                            {categories.find(c => c.id === item.categoryId)?.name || "Danh mục"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent 
                          alignItemWithTrigger={false} 
                          side="bottom" 
                          sideOffset={4}
                          className="bg-white border border-black/10 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1 z-50"
                        >
                          {categories.map(cat => (
                            <SelectItem 
                              key={cat.id} 
                              value={cat.id} 
                              className="font-['IBM_Plex_Mono'] text-[10px] uppercase font-medium tracking-[0.05em] py-2 px-3 text-[#333] cursor-pointer rounded-none focus:bg-[#F4F4F4] focus:text-black data-[state=checked]:bg-[#111] data-[state=checked]:text-white transition-colors duration-150"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              multiple
              className="hidden" 
            />
          </div>

          <div className="md:col-span-5 flex flex-col h-full space-y-10 sticky top-24 pt-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.1em] text-[#666]">Danh mục chung (Mặc định)</span>
                <Select 
                  disabled={isUploading}
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-40 h-8 bg-transparent border-b border-t-0 border-l-0 border-r-0 border-black/20 text-[11px] font-['IBM_Plex_Mono'] font-medium uppercase tracking-[0.1em] rounded-none shadow-none focus:ring-0 px-0 data-[state=open]:border-black transition-colors text-[#111]">
                    <SelectValue placeholder="Chọn danh mục">
                      {categories.find(c => c.id === selectedCategory)?.name || "Chọn danh mục"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent 
                    alignItemWithTrigger={false} 
                    side="bottom" 
                    sideOffset={4}
                    className="bg-white border border-black/10 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1 z-50"
                  >
                    {categories.map(cat => (
                      <SelectItem 
                        key={cat.id} 
                        value={cat.id} 
                        className="font-['IBM_Plex_Mono'] text-[11px] uppercase font-medium tracking-[0.05em] py-2 px-3 text-[#333] cursor-pointer rounded-none focus:bg-[#F4F4F4] focus:text-black data-[state=checked]:bg-[#111] data-[state=checked]:text-white transition-colors duration-150"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] tracking-[0.02em] text-[#111] leading-[1.1] uppercase">
                Sẵn sàng <br/><span className="text-[#666] italic lowercase tracking-normal">trích xuất</span>
              </h2>
              
              <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#666] leading-relaxed tracking-[0.05em] border-l border-black/20 pl-5 max-w-sm">
                Các hình ảnh sẽ được gửi qua nền tảng đám mây để AI loại bỏ phông nền, tối ưu hóa kích thước, sau đó đi qua hệ thống AI Stylist để phân tích dữ liệu thời trang.
              </p>

              {isUploading && (
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-[0.1em] text-[#333] font-medium">
                    <span>{uploadState.status === 'uploading' ? `Đang tải ảnh lên (${uploadState.current}/${uploadState.total})` : `AI Đang phân tích (${uploadState.total} ảnh)`}</span>
                    <span>{Math.round((uploadState.current / uploadState.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-[3px] bg-[#F4F3F0] overflow-hidden">
                    <div 
                      className="h-full bg-[#111] transition-all duration-300 ease-out"
                      style={{ width: `${(uploadState.current / uploadState.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col xl:flex-row gap-4 pt-4">
              <Button 
                onClick={handleUploadAndAnalyze} 
                disabled={isUploading || files.length === 0}
                className="flex-1 h-12 rounded-none bg-[#111] text-white font-['IBM_Plex_Mono'] text-[11px] tracking-[0.15em] uppercase hover:bg-black/80 transition-colors flex items-center justify-center gap-3 shadow-sm"
              >
                {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Phân tích tất cả
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset} 
                disabled={isUploading}
                className="xl:w-32 h-12 rounded-none bg-transparent border border-black/10 text-[#666] font-['IBM_Plex_Mono'] text-[11px] tracking-[0.1em] uppercase hover:bg-[#F8F7F5] hover:text-[#111] transition-colors"
              >
                Hủy bỏ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
