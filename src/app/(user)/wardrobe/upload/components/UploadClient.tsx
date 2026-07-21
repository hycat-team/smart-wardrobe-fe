"use client";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  X,
  Sparkles,
  Loader2,
  ImagePlus,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useBatchUploadWardrobeItems,
  useCategories,
} from "@/features/wardrobe/queries/wardrobe.queries";
import { wardrobeApi } from "@/features/wardrobe/api/wardrobe.api";
import { toast } from "sonner";
import {
  uploadToCloudinary,
  applyCloudinaryBackgroundRemoval,
} from "@/lib/cloudinary";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

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
  const [uploadState, setUploadState] = useState<{
    status: "idle" | "uploading" | "analyzing" | "success";
    current: number;
    total: number;
  }>({
    status: "idle",
    current: 0,
    total: 0,
  });

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const defaultCategoryId = useMemo(() => {
    const otherCat = categories.find(
      (c) =>
        c.name.toLowerCase() === "khác" || c.name.toLowerCase() === "other",
    );
    return otherCat
      ? otherCat.id
      : categories.length > 0
        ? categories[0].id
        : "";
  }, [categories]);

  const batchUploadMutation = useBatchUploadWardrobeItems();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      if (files.length + selectedFiles.length > 5) {
        toast.error("Bạn chỉ được upload tối đa 5 ảnh mỗi lần!");
        return;
      }

      const newFiles = selectedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        categoryId: defaultCategoryId,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
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

    setUploadState({ status: "uploading", current: 0, total: files.length });
    try {
      // 1. Get secure upload signature
      const signatureResult = await wardrobeApi.getUploadSignature();

      const uploadedItems = [];

      // 2. Upload direct to Cloudinary sequentially to track progress accurately
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setUploadState({
          status: "uploading",
          current: i + 1,
          total: files.length,
        });

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
      setUploadState({
        status: "analyzing",
        current: files.length,
        total: files.length,
      });
      await batchUploadMutation.mutateAsync({
        items: uploadedItems,
      });

      // 5. Success redirect to wardrobe
      setUploadState({
        status: "success",
        current: files.length,
        total: files.length,
      });
      toast.success("Đã gửi ảnh cho AI phân tích thành công!");
      router.push("/wardrobe");
    } catch (err: unknown) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi trong quá trình upload.",
      );
      setUploadState({ status: "idle", current: 0, total: 0 });
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadState({ status: "idle", current: 0, total: 0 });
  };

  // GSAP Animations
  useGSAP(
    () => {
      // Entrance animation
      const tl = gsap.timeline();
      tl.from(".gsap-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      }).from(
        ".gsap-step",
        { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.15 },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  // Transition animation when preview changes
  useGSAP(
    () => {
      if (files.length > 0) {
        gsap.fromTo(
          ".gsap-preview-container",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          ".preview-card",
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
        );
      } else {
        gsap.fromTo(
          ".gsap-upload-container",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
        );
      }
    },
    { scope: containerRef, dependencies: [files.length] },
  );

  const isUploading =
    uploadState.status !== "idle" && uploadState.status !== "success";

  return (
    <div
      ref={containerRef}
      className="max-w-[1400px] mx-auto space-y-8 pb-16 px-4 sm:px-8 lg:px-12 mt-12 font-sans selection:bg-accent selection:text-accent-foreground"
    >
      {/* Editorial Header */}
      <div className="flex flex-col gap-6 border-b border-border pb-8 gsap-header">
        <Link
          href="/wardrobe"
          className="inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Trở về tủ đồ
        </Link>
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[72px]">
            DIGITAL FASHION
          </h1>
          <p className="max-w-md border-l border-border pl-4 text-[11px] font-semibold uppercase tracking-[0.1em] leading-relaxed text-muted-foreground">
            Tải lên tối đa 5 ảnh thô cùng lúc. AI sẽ tự động tách nền, tối ưu
            dung lượng, và phân tích các thông số về chất liệu & phong cách.
          </p>
        </div>
      </div>

      {files.length === 0 ? (
        // Step 1: Upload Area
        <div className="w-full max-w-4xl gsap-upload-container pt-8">
          <div className="gsap-step">
            <div className="flex items-center gap-4 border-b border-border pb-4 mb-8">
              <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                01
              </span>
              <h2 className="text-xl font-semibold uppercase tracking-[0.05em] text-foreground">
                Tải Lên Hình Ảnh
              </h2>
            </div>

            {isLoadingCategories ? (
              <div className="w-full aspect-[16/9] md:aspect-[21/9] border border-dashed border-border flex flex-col items-center justify-center">
                <Loader2 className="animate-spin size-6 text-foreground" />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border bg-card transition-all duration-200 hover:bg-accent-soft md:aspect-[21/9]"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-sm transition-all duration-200 group-hover:scale-105">
                  <UploadCloud className="size-6 stroke-[1.5]" />
                </div>
                <div className="space-y-3 text-center px-4">
                  <p className="text-2xl font-semibold tracking-[0.02em] text-foreground">
                    Thả Nhiều File Vào Đây
                  </p>
                  <p className="font-semibold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    PNG, JPG, HEIC (Tối đa 5 file, mỗi file max 5MB)
                  </p>
                </div>
              </div>
            )}

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
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-2xl font-semibold uppercase tracking-[0.05em] text-foreground">
                Đã chọn {files.length}/5 ảnh
              </h2>
              {!isUploading && files.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground transition-colors outline-none hover:text-foreground"
                >
                  <ImagePlus className="size-4 stroke-[1.5]" /> Thêm ảnh
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  className="preview-card group relative flex flex-col rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <button
                    onClick={() => removeFile(item.id)}
                    className="absolute -right-3 -top-3 z-30 flex size-8 items-center justify-center rounded-full bg-destructive text-primary-foreground shadow-md transition-all duration-200 hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    disabled={isUploading}
                  >
                    <X className="size-4" />
                  </button>
                  <div className="absolute left-2 top-2 z-20 rounded-full bg-primary px-2 py-1 text-[9px] font-semibold uppercase text-primary-foreground shadow-sm">
                    Ảnh {idx + 1}
                  </div>

                  {/* Image Area - 75% Visual Weight */}
                  <div className="image-frame relative aspect-[4/5] flex-shrink-0 p-4">
                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={item.preview}
                      alt="Preview"
                      className="h-full w-full object-contain drop-shadow-sm"
                    />

                    {/* Uploading Overlay */}
                    {isUploading &&
                      uploadState.current === idx + 1 &&
                      uploadState.status === "uploading" && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                          <div className="mb-3 size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
                          <span className="rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground shadow-sm">
                            ĐANG TẢI LÊN
                          </span>
                        </div>
                      )}
                    {isUploading &&
                      (uploadState.current > idx + 1 ||
                        uploadState.status === "analyzing") && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                          <div className="mb-2 rounded-full bg-primary p-1.5 text-primary-foreground">
                            <Sparkles className="size-4" />
                          </div>
                          <span className="rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground shadow-sm">
                            AI XỬ LÝ
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Information Area - 25% Visual Weight */}
                  <div className="flex flex-grow flex-col justify-between gap-3 border-t border-border p-4 pt-4">
                    <div>
                      <h3
                        className="line-clamp-1 text-[16px] font-semibold leading-[130%] text-foreground"
                        title={item.file.name}
                      >
                        {item.file.name.replace(/\.[^/.]+$/, "")}
                      </h3>
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
              <h2 className="text-4xl font-semibold uppercase leading-[1.1] tracking-[0.02em] text-foreground md:text-5xl lg:text-6xl">
                Sẵn sàng <br />
                <span className="text-muted-foreground italic lowercase tracking-normal">
                  trích xuất
                </span>
              </h2>

              <p className="max-w-sm border-l border-border pl-5 text-[11px] font-semibold leading-relaxed tracking-[0.05em] text-muted-foreground">
                Các hình ảnh sẽ được gửi qua nền tảng đám mây để AI loại bỏ
                phông nền, tối ưu hóa kích thước, sau đó đi qua hệ thống AI
                Stylist để phân tích dữ liệu thời trang. Danh mục mặc định sẽ là
                {`"Khác".`}
              </p>

              {isUploading && (
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground">
                    <span>
                      {uploadState.status === "uploading"
                        ? `Đang tải ảnh lên (${uploadState.current}/${uploadState.total})`
                        : `AI Đang phân tích (${uploadState.total} ảnh)`}
                    </span>
                    <span>
                      {Math.round(
                        (uploadState.current / uploadState.total) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-200"
                      style={{
                        width: `${(uploadState.current / uploadState.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col xl:flex-row gap-4 pt-4">
              <Button
                onClick={handleUploadAndAnalyze}
                disabled={isUploading || files.length === 0}
                className="flex h-12 flex-1 items-center justify-center gap-3 rounded-full bg-primary text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Phân tích tất cả
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isUploading}
                className="h-12 rounded-full border border-border bg-transparent text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:w-32"
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
