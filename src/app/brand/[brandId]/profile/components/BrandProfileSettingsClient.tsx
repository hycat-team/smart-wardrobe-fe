"use client";
import React, { useState, useEffect } from "react";
import { UploadCloud, CheckCircle, MapPin, Globe, Link as LinkIcon, Pencil, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { brandPortalApi } from "@/features/brand-portal/api/brand-portal.api";
import { useUpdateBrandLogo, useGetBrandProfile } from "@/features/brand-portal/queries/brand-portal.queries";
import { toast } from "sonner";

export function BrandProfileSettingsClient() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const { mutateAsync: updateLogo } = useUpdateBrandLogo(brandId);
  const { data: brandProfile } = useGetBrandProfile(brandId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    story: "",
    logoUrl: "",
    coverUrl: "",
    location: "TP. Hồ Chí Minh",
    website: "",
    instagram: "",
  });

  useEffect(() => {
    if (brandProfile) {
      setFormData({
        name: brandProfile.name || "",
        description: brandProfile.description || "",
        story: brandProfile.story || "",
        logoUrl: brandProfile.logoUrl || "",
        coverUrl: brandProfile.backgroundUrl || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80",
        location: brandProfile.location || "TP. Hồ Chí Minh",
        website: brandProfile.website || `${brandProfile.name?.toLowerCase().replace(/\s/g, '')}.vn`,
        instagram: brandProfile.instagram || `@${brandProfile.name?.toLowerCase().replace(/\s/g, '')}`,
      });
    }
  }, [brandProfile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logoUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (fieldName === 'logoUrl') setIsUploadingLogo(true);
      else setIsUploadingCover(true);

      // 1. Get Signature
      const { signature, timestamp, folder, apiKey } = await brandPortalApi.getLogoUploadSignature();

      // 2. Upload to Cloudinary
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("api_key", apiKey);
      formDataUpload.append("timestamp", timestamp.toString());
      formDataUpload.append("signature", signature);
      formDataUpload.append("folder", folder);

      // Cần biết cloud_name, giả định là 'ddrzzofze' hoặc lấy từ môi trường
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ddrzzofze"; // Fallback to a common one if needed
      
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formDataUpload,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || "Upload failed");
      }

      const { secure_url, public_id } = uploadData;

      // 3. Update state
      setFormData(prev => ({ ...prev, [fieldName]: secure_url }));

      // 4. Update Backend if it's logo or cover
      if (brandId) {
        if (fieldName === 'logoUrl') {
          await updateLogo({ logoUrl: secure_url, logoPublicId: public_id });
        } else if (fieldName === 'coverUrl') {
          await updateLogo({ backgroundUrl: secure_url, backgroundPublicId: public_id });
        }
      }

    } catch (e: any) {
      console.error("Upload error", e);
      toast.error(e.message || "Có lỗi xảy ra khi upload ảnh");
    } finally {
      if (fieldName === 'logoUrl') setIsUploadingLogo(false);
      else setIsUploadingCover(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("custom_brand_profile", JSON.stringify(formData));
      setTimeout(() => {
        setIsSaving(false);
        toast.success("Đã lưu thông tin hồ sơ");
      }, 600);
    } catch (e) {
      console.error("Error saving profile", e);
      setIsSaving(false);
      toast.error("Không thể lưu thông tin");
    }
  };


  return (
    <div className="max-w-5xl mx-auto pb-24 relative">
      {/* Container chính bọc toàn bộ form */}
      <div className="bg-card border border-border shadow-sm rounded-3xl overflow-hidden">
        
        {/* Header - Live Profile Preview */}
        <div className="relative mb-16">
          {/* Ảnh bìa */}
          <label className="block w-full h-48 md:h-64 bg-muted cursor-pointer group relative overflow-hidden">
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverUrl')} disabled={isUploadingCover} />
            {isUploadingCover ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : formData.coverUrl ? (
              <img src={formData.coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <UploadCloud className="size-8 opacity-50" />
              </div>
            )}
            {!isUploadingCover && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="flex items-center gap-2 bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
                  <Camera className="size-4" /> Thay đổi ảnh bìa
                </span>
              </div>
            )}
          </label>

          {/* Logo đè lên ảnh bìa */}
          <div className="absolute -bottom-12 left-6 md:left-10 flex items-end">
            <label className="block w-24 h-24 md:w-32 md:h-32 rounded-full bg-card p-1 cursor-pointer group relative shrink-0 shadow-sm">
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoUrl')} disabled={isUploadingLogo} />
              <div className="w-full h-full rounded-full overflow-hidden bg-muted relative">
                {isUploadingLogo ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <UploadCloud className="size-6 opacity-50" />
                  </div>
                )}
                {!isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="size-5 text-white" />
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Nội dung bên dưới */}
        <div className="px-6 md:px-10 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Cột Trái (Main Info) */}
            <div className="lg:col-span-2 space-y-8 mt-4 md:mt-0">
              
              {/* Tên thương hiệu borderless */}
              <div className="space-y-2 group relative">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Tên thương hiệu..."
                  className="w-full bg-transparent text-3xl md:text-4xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 border-none p-0"
                />
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground pointer-events-none">
                  <Pencil className="size-4" />
                </div>
              </div>

              {/* Bento cho Text areas */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Mô tả ngắn gọn (Slogan/Tagline)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Định vị thương hiệu của bạn..."
                    className="w-full min-h-[60px] p-4 text-base rounded-2xl border border-transparent bg-muted/30 focus-visible:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none focus-visible:border-border resize-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Câu chuyện thương hiệu (Về chúng tôi)</label>
                  <textarea
                    value={formData.story}
                    onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                    placeholder="Chia sẻ hành trình hoặc giá trị cốt lõi..."
                    className="w-full min-h-[160px] p-4 text-base rounded-2xl border border-transparent bg-muted/30 focus-visible:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none focus-visible:border-border resize-none transition-all placeholder:text-muted-foreground/50 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Cột Phải (Links & Meta) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-muted/30 border border-border p-5 rounded-3xl space-y-5">
                <h3 className="text-sm font-bold text-foreground mb-4">Thông tin liên hệ</h3>
                
                <div className="space-y-4">
                  {/* Location */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <MapPin className="size-4" />
                    </div>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Vị trí..."
                      className="pl-9 h-11 rounded-xl border-border bg-card focus-visible:ring-1 focus-visible:ring-ring font-mono text-sm"
                    />
                  </div>
                  
                  {/* Website */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Globe className="size-4" />
                    </div>
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="Website..."
                      className="pl-9 h-11 rounded-xl border-border bg-card focus-visible:ring-1 focus-visible:ring-ring font-mono text-sm"
                    />
                  </div>
                  
                  {/* Instagram */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <LinkIcon className="size-4" />
                    </div>
                    <Input
                      value={formData.instagram}
                      onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="Instagram..."
                      className="pl-9 h-11 rounded-xl border-border bg-card focus-visible:ring-1 focus-visible:ring-ring font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-[calc(50%+8rem)] z-40">
        <div className="bg-background/80 backdrop-blur-md p-2 rounded-full border border-border shadow-lg flex items-center justify-between gap-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full uppercase font-bold tracking-widest text-[11px] px-8 h-12 flex items-center gap-2 transition-all min-w-[200px] justify-center"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground animate-spin" />
                Đang lưu hồ sơ...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
