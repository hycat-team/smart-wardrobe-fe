"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  MapPin,
  Globe,
  Camera,
  Check,
  Sparkles,
  Info,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockBrands } from "@/lib/mock-data/b2b";
import { toast } from "sonner";

// Custom Instagram SVG icon
function Instagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function BrandProfileSettingsClient() {
  const [isSaving, setIsSaving] = useState(false);
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

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default from mock or local storage
    const defaultBrand = mockBrands.find(b => b.id === "brand_001") || mockBrands[0];

    try {
      const stored = localStorage.getItem("custom_brand_profile");
      if (stored) {
        const customProfile = JSON.parse(stored);
        setFormData({
          name: customProfile.name || defaultBrand.name,
          description: customProfile.description || defaultBrand.description,
          story: customProfile.story || defaultBrand.story,
          logoUrl: customProfile.logoUrl || defaultBrand.logoUrl,
          coverUrl: customProfile.coverUrl || defaultBrand.coverUrl || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80",
          location: customProfile.location || "TP. Hồ Chí Minh",
          website: customProfile.website || `${defaultBrand.name.toLowerCase().replace(/\s/g, '')}.vn`,
          instagram: customProfile.instagram || `@${defaultBrand.name.toLowerCase().replace(/\s/g, '')}`,
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }

    setFormData({
      name: defaultBrand.name,
      description: defaultBrand.description,
      story: defaultBrand.story,
      logoUrl: defaultBrand.logoUrl,
      coverUrl: defaultBrand.coverUrl || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80",
      location: "TP. Hồ Chí Minh",
      website: `${defaultBrand.name.toLowerCase().replace(/\s/g, '')}.vn`,
      instagram: `@${defaultBrand.name.toLowerCase().replace(/\s/g, '')}`,
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logoUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
        toast.success(`Tải lên ảnh ${fieldName === 'logoUrl' ? 'đại diện' : 'bìa'} thành công!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("custom_brand_profile", JSON.stringify(formData));
      setTimeout(() => {
        setIsSaving(false);
        toast.success("Hồ sơ thương hiệu đã được lưu thành công!");
      }, 800);
    } catch (e) {
      console.error("Error saving profile", e);
      setIsSaving(false);
      toast.error("Đã xảy ra lỗi khi lưu hồ sơ!");
    }
  };

  // Calculate profile completeness score
  const completenessChecks = [
    { label: "Tên thương hiệu", checked: !!formData.name, weight: 20 },
    { label: "Ảnh đại diện (Logo)", checked: !!formData.logoUrl, weight: 15 },
    { label: "Ảnh bìa thương hiệu", checked: !!formData.coverUrl, weight: 15 },
    { label: "Mô tả ngắn", checked: !!formData.description, weight: 20 },
    { label: "Câu chuyện thương hiệu", checked: !!formData.story, weight: 15 },
    { label: "Vị trí & Liên kết", checked: !!formData.location && (!!formData.website || !!formData.instagram), weight: 15 },
  ];

  const totalScore = completenessChecks.reduce((acc, curr) => acc + (curr.checked ? curr.weight : 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-7xl mx-auto w-full pb-16">

      {/* LEFT COLUMN: Real-time Live Preview */}
      <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
        <div className="flex flex-col gap-1.5 px-1 text-[20px] font-playfair text-2xl font-bold text-zinc-900">
          <span className=" font-mono tracking-[0.2em] uppercase text-zinc-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            Bản xem trước trực tiếp
          </span>
          <p className="text-xs text-zinc-400">Giao diện cửa hàng của bạn hiển thị với khách hàng.</p>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden relative group/preview">

          {/* Cover Preview & Trigger */}
          <div
            onClick={() => coverInputRef.current?.click()}
            className="relative aspect-[21/9] bg-zinc-50 overflow-hidden cursor-pointer group/cover"
          >
            {formData.coverUrl ? (
              <img src={formData.coverUrl} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105" />
            ) : (
              <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                Nhấn để tải lên ảnh bìa
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 group-hover/cover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                <Camera className="w-3 h-3" /> Thay đổi ảnh bìa
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="relative px-6 pb-6 pt-14">

            {/* Logo Preview & Trigger */}
            <div
              onClick={() => logoInputRef.current?.click()}
              className="absolute -top-10 left-6 w-20 h-20 rounded-full border-4 border-white bg-zinc-100 overflow-hidden shadow-md cursor-pointer group/logo z-10"
            >
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 font-bold font-playfair text-xl">
                  {formData.name ? formData.name[0] : "M"}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Name & Verification Badge */}
            <div className="flex items-center gap-2 mt-1">
              <h3 className="font-playfair text-2xl font-bold text-zinc-900 leading-tight">
                {formData.name || "Tên thương hiệu"}
              </h3>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white shrink-0" title="Đã xác thực">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
            </div>

            {/* Subtitle / Followers */}
            <div className="flex gap-4 mt-2.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400 font-medium">
              <span>12,450 Người theo dõi</span>
              <span>•</span>
              <span>582 Thành viên</span>
            </div>

            {/* Short Bio */}
            <p className="mt-4 font-sans text-sm text-zinc-500 leading-relaxed italic">
              "{formData.description || "Hãy điền mô tả ngắn cho thương hiệu của bạn..."}"
            </p>

            <div className="h-[1px] bg-zinc-100 my-5"></div>

            {/* Brand Story Snippet */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold block">
                Câu chuyện thương hiệu
              </span>
              <p className="font-sans text-xs text-zinc-500 leading-relaxed line-clamp-3">
                {formData.story || "Chia sẻ nguồn cảm hứng và hành trình sáng tạo của thương hiệu của bạn..."}
              </p>
            </div>

            <div className="h-[1px] bg-zinc-100 my-5"></div>

            {/* Details & Location Icons */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <div className="flex items-center gap-3 text-zinc-500 font-sans text-xs">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="font-medium text-zinc-600">{formData.location || "Chưa thiết lập"}</span>
              </div>
              {formData.website && (
                <div className="flex items-center gap-3 text-zinc-500 font-sans text-xs">
                  <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="underline decoration-zinc-200 underline-offset-4 text-zinc-600 hover:text-black transition-colors font-medium">
                    {formData.website}
                  </span>
                </div>
              )}
              {formData.instagram && (
                <div className="flex items-center gap-3 text-zinc-500 font-sans text-xs">
                  <Instagram className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="text-zinc-600 hover:text-black transition-colors font-medium">
                    {formData.instagram}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Brand Completeness Card */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold block">
              Độ hoàn thiện hồ sơ
            </span>
            <span className="font-mono text-sm font-bold text-black">{totalScore}%</span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-500 ease-out"
              style={{ width: `${totalScore}%` }}
            />
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
            {completenessChecks.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs font-sans text-zinc-500">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${item.checked ? 'bg-black border-black text-white' : 'border-zinc-200 text-transparent'
                  }`}>
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </span>
                <span className={item.checked ? "text-zinc-700 font-medium" : "text-zinc-400"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN: Settings Form */}
      <div className="lg:col-span-7 bg-white border border-zinc-200/80 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-8">

        {/* Title */}
        <div className="border-b border-zinc-100 pb-5">
          <h2 className="font-playfair text-2xl font-bold text-zinc-900">Chi tiết Hồ sơ</h2>
          <p className="text-zinc-400 text-xs mt-1">Cập nhật và hoàn thiện thông tin định vị thương hiệu của bạn.</p>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={logoInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'logoUrl')}
        />
        <input
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'coverUrl')}
        />

        {/* Layout Visual Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold block">
              01. Hình ảnh thương hiệu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Logo card editor */}
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border border-dashed border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-all duration-300 h-32 group"
            >
              {formData.logoUrl ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-zinc-200">
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-zinc-800">Ảnh đại diện (Logo)</p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">Đã tải lên · Sửa</p>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-zinc-800">Tải lên Logo</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Khuyên dùng hình vuông</p>
                  </div>
                </>
              )}
            </div>

            {/* Cover card editor */}
            <div
              onClick={() => coverInputRef.current?.click()}
              className="border border-dashed border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-all duration-300 h-32 group"
            >
              {formData.coverUrl ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-200 relative">
                    <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-zinc-800">Ảnh bìa (Cover)</p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">Đã tải lên · Sửa</p>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-zinc-800">Tải lên ảnh bìa</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Tỷ lệ rộng 21:9</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info Settings */}
        <section className="space-y-5">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold block">
            02. Thông tin cơ bản
          </span>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-500">Tên thương hiệu</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-11 rounded-lg border-zinc-200 bg-zinc-50/30 focus-visible:ring-black focus-visible:border-black font-medium transition-all"
                placeholder="Nhập tên thương hiệu của bạn"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-500">Mô tả ngắn (Description)</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="h-11 rounded-lg border-zinc-200 bg-zinc-50/30 focus-visible:ring-black focus-visible:border-black transition-all"
                placeholder="Nhập câu mô tả nhanh về sản phẩm hay giá trị cốt lõi"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-500">Câu chuyện thương hiệu (Story)</label>
              <textarea
                value={formData.story}
                onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                className="w-full min-h-[120px] p-3 text-sm rounded-lg border border-zinc-200 bg-zinc-50/30 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                placeholder="Câu chuyện sáng lập, tuyên ngôn thời trang, hay những giá trị đặc biệt..."
              />
            </div>
          </div>
        </section>

        {/* Links and Locations */}
        <section className="space-y-5">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold block">
            03. Liên kết & Điểm bán
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-500">Vị trí (Location)</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="h-11 rounded-lg border-zinc-200 bg-zinc-50/30 focus-visible:ring-black focus-visible:border-black text-sm transition-all"
                placeholder="Ví dụ: TP. Hồ Chí Minh"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-500">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="h-11 rounded-lg border-zinc-200 bg-zinc-50/30 focus-visible:ring-black focus-visible:border-black text-sm transition-all"
                placeholder="domain.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-500">Instagram</label>
              <Input
                value={formData.instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                className="h-11 rounded-lg border-zinc-200 bg-zinc-50/30 focus-visible:ring-black focus-visible:border-black text-sm transition-all"
                placeholder="@username"
              />
            </div>
          </div>
        </section>

        {/* Footer Action */}
        <div className="pt-4 border-t border-zinc-100 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-black hover:bg-zinc-900 text-white rounded-lg uppercase font-mono tracking-widest text-[11px] px-8 h-12 flex items-center gap-2 transition-all w-full md:w-auto"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Đang lưu hồ sơ...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
