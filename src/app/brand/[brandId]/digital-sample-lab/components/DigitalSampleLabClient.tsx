"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Plus, X, Sparkles, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DigitalSampleLabClient() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [concept, setConcept] = useState("");
  const [variants, setVariants] = useState([{ name: "Black", color: "#1A1A1A" }]);
  const [price, setPrice] = useState("950000");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    if (variants.length < 3) {
      setVariants([...variants, { name: "", color: "#FFFFFF" }]);
    }
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newSampleId = `sample-${Date.now()}`;
    try {
      const existingStr = localStorage.getItem("digital_sample_lab_reports");
      const existing = existingStr ? JSON.parse(existingStr) : [];

      const newReport = {
        id: newSampleId,
        productName,
        concept,
        variants,
        price,
        imageUrl,
        createdAt: new Date().toISOString()
      };

      existing.push(newReport);
      localStorage.setItem("digital_sample_lab_reports", JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    // Giả lập tạo sample test
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/brand/digital-sample-lab/report/${newSampleId}`);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10">
        {/* <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground mb-2">Digital Sample Lab</h1> */}
        <p className="text-sm tracking-widest uppercase text-muted-foreground border-l-2 border-primary pl-3">
          Thử nghiệm thiết kế trên tủ đồ thực tế trước khi sản xuất
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <label className="aspect-[4/5] bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted transition-colors group relative overflow-hidden block w-full rounded-3xl">
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded Sample" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <div className="size-12 rounded-full bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <UploadCloud className="size-5 text-foreground" />
                </div>
                <p className="text-[11px] uppercase tracking-widest font-bold">Upload Bản Vẽ / 3D Render</p>
                <p className="text-[10px] mt-2">PNG, JPG up to 10MB</p>
              </>
            )}
          </label>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 border border-border shadow-sm rounded-3xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Tên Sản Phẩm</label>
                <input
                  required
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="VD: Minimal Structured Blazer"
                  className="w-full bg-muted/50 border border-border p-3 text-sm focus:outline-none focus:border-border focus:ring-1 focus:ring-ring transition-colors rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Mô tả sản phẩm</label>
                <textarea
                  required
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Mô tả ý tưởng, phom dáng, chất liệu dự kiến..."
                  className="w-full bg-muted/50 border border-border p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:border-border focus:ring-1 focus:ring-ring transition-colors rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Màu sắc</label>
                  {variants.length < 3 && (
                    <button type="button" onClick={addVariant} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                      <Plus className="size-3" /> Thêm Màu sắc
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div key={i} className="flex items-center gap-3 bg-muted/50 border border-border p-2 pr-3 rounded-xl">
                      <div className="size-8 border border-border overflow-hidden relative shrink-0 rounded-full">
                        <input
                          type="color"
                          value={v.color}
                          onChange={(e) => updateVariant(i, "color", e.target.value)}
                          className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                        />
                      </div>
                      <input
                        required
                        type="text"
                        value={v.name}
                        onChange={(e) => updateVariant(i, "name", e.target.value)}
                        placeholder="Tên variant (VD: Đen)"
                        className="flex-1 bg-transparent border-none p-2 text-sm focus:outline-none"
                      />
                      {variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground">Mức giá dự kiến (VNĐ)</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-muted/50 border border-border p-3 text-sm focus:outline-none focus:border-border focus:ring-1 focus:ring-ring transition-colors rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-[11px] uppercase tracking-widest rounded-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Đang thiết lập thử nghiệm...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4" /> Khởi Tạo thiết kế thử nghiệm
                  </div>
                )}
              </Button>
              <p className="text-center text-[10px] text-muted-foreground mt-4">
                Mẫu số này sẽ được tạm thời thêm vào tủ đồ của các user phù hợp để đánh giá Wardrobe Impact.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
