export interface CloudinaryUploadParams {
  file: File | Blob;
  signatureParams: {
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
    publicId?: string;
  };
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

export async function uploadToCloudinary({
  file,
  signatureParams,
}: CloudinaryUploadParams): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzvwkngxu";
  const formData = new FormData();
  
  // Set a default filename for blobs if not provided
  if (file instanceof File) {
    formData.append("file", file);
  } else {
    formData.append("file", file, "upload.png");
  }

  formData.append("api_key", signatureParams.apiKey);
  formData.append("timestamp", signatureParams.timestamp.toString());
  formData.append("signature", signatureParams.signature);
  formData.append("folder", signatureParams.folder);
  if (signatureParams.publicId) {
    formData.append("public_id", signatureParams.publicId);
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

  return response.json();
}

/**
 * Transforms a Cloudinary URL to request background removal and optimal formatting.
 */
export function applyCloudinaryBackgroundRemoval(url: string): string {
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
