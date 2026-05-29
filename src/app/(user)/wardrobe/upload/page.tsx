"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Sparkles, Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Upload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ category: string, color: string, style: string } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsScanning(true);
    
    // Simulate AI scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        category: "Áo thun",
        color: "Trắng",
        style: "Minimalist"
      });
    }, 3000);
  };

  const handleSave = () => {
    // Navigate to wardrobe dashboard
    router.push("/wardrobe");
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100dvh-150px)] flex flex-col items-center justify-center animate-in fade-in duration-500 py-8">
      
      {!preview ? (
        // Step 1: Upload Area
        <div className="w-full text-center space-y-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink mb-2">Thêm Đồ Mới</h1>
            <p className="text-ink-muted">Tải ảnh lên và để AI tự động phân loại, gắn tag cho bạn.</p>
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
        // Step 2 & 3: Preview & Scan Result
        <div className="w-full h-full grid md:grid-cols-2 gap-8 items-center">
          
          <div className="relative w-full aspect-[4/5] bg-muted rounded-3xl overflow-hidden shadow-lg border border-border">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            
            {/* Scanning Animation Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10">
                <div className="absolute top-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(201,113,74,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
                   <Sparkles className="size-8 animate-pulse text-primary" />
                   <p className="font-heading font-bold text-xl animate-pulse">AI đang phân tích ảnh...</p>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => { setFile(null); setPreview(null); setScanResult(null); }}
              className="absolute top-4 right-4 size-10 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center text-ink hover:bg-background transition-colors z-20"
              disabled={isScanning}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-8 flex flex-col justify-center">
            {isScanning ? (
               <div className="space-y-6">
                 <h2 className="text-2xl font-heading font-bold text-ink">Đang xử lý hình ảnh</h2>
                 <div className="space-y-3">
                   <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
                   </div>
                   <p className="text-sm text-ink-muted">Đang bóc tách màu sắc & phong cách...</p>
                 </div>
               </div>
            ) : !scanResult ? (
              <div className="space-y-6 text-center md:text-left">
                <h2 className="text-3xl font-heading font-bold text-ink">Bắt đầu phân tích</h2>
                <p className="text-ink-muted">AI sẽ tự động nhận diện loại quần áo, màu sắc và phong cách để thêm vào tủ đồ của bạn.</p>
                <Button onClick={handleUpload} className="w-full md:w-auto h-12 rounded-full px-8 bg-primary text-primary-foreground text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  <Sparkles className="size-5 mr-2" /> Dùng AI Phân Tích
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <Check className="size-4" /> Phân tích thành công
                </div>
                
                <h2 className="text-3xl font-heading font-bold text-ink">Kết Quả AI</h2>
                
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-ink-muted font-medium">Danh mục</span>
                    <span className="font-bold text-ink">{scanResult.category}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-ink-muted font-medium">Màu sắc chủ đạo</span>
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-full bg-white border border-border" />
                      <span className="font-bold text-ink">{scanResult.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-ink-muted font-medium">Phong cách</span>
                    <span className="font-bold text-ink">{scanResult.style}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground pb-4">
                  *Bạn có thể chỉnh sửa lại các thông tin này nếu AI nhận diện chưa chính xác.
                </div>

                <div className="flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-xl">Sửa thủ công</Button>
                   <Button onClick={handleSave} className="flex-1 h-12 rounded-xl bg-ink text-cream hover:bg-ink/90 shadow-lg shadow-ink/20 group">
                     Lưu vào Tủ <ChevronRight className="size-5 ml-1 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}



