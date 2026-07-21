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

// /**
//  * Transforms a Cloudinary URL to request background removal and optimal formatting.
//  */
// export function applyCloudinaryBackgroundRemoval(url: string): string {
//   if (!url || !url.includes("cloudinary.com")) return url;
//   let newUrl = url;

//   // Đổi đuôi file thành .png để giữ nền trong suốt
//   newUrl = newUrl.replace(/\.[^/.]+$/, ".png");

//   if (newUrl.includes("/upload/")) {
//     // Bắt buộc dùng f_png thay vì f_auto để đảm bảo Cloudinary trả về định dạng hỗ trợ trong suốt
//     // Thêm e_trim:10 để tự động cắt bỏ khoảng trắng và shadow thừa. Lưu ý: e_background_removal phải đứng riêng rẽ bằng dấu /
//     return newUrl.replace("/upload/", "/upload/e_background_removal/e_trim:10,f_png,q_auto/");
//   }

//   return newUrl;
// }

/**
 * Transforms a Cloudinary URL to request background removal and optimal formatting.
 * Sử dụng Named Transformation: t_bg_remove
 */
export function applyCloudinaryBackgroundRemoval(url: string): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  let newUrl = url.replace(/\.[^/.]+$/, ".png");

  if (newUrl.includes("/upload/")) {
    // Đã thay thế e_background_removal/e_trim:10,f_png,q_auto thành t_bg_remove
    return newUrl.replace("/upload/", "/upload/t_bg_remove/");
  }

  return newUrl;
}

// /**
//  * Thêm e_trim:10 vào một URL Cloudinary đã có sẵn để cắt ảnh trên giao diện.
//  * Hỗ trợ cả URL bên ngoài bằng Cloudinary Fetch API.
//  */
// export function applyCloudinaryTrim(url: string | undefined): string {
//   if (!url) return "";

//   // Nếu là URL nội bộ, giữ nguyên
//   if (url.startsWith("/")) return url;

//   if (url.includes("cloudinary.com")) {
//     // Nếu đã có e_trim rồi thì bỏ qua
//     if (url.includes("e_trim")) return url;

//     // Nếu là URL chuẩn của Cloudinary có chứa /upload/
//     if (url.includes("/upload/")) {
//       // Chèn e_trim:10 vào ngay sau /upload/
//       return url.replace("/upload/", "/upload/e_trim:10/");
//     }
//     return url;
//   }

//   // Nếu là URL bên ngoài (http/https), sử dụng Cloudinary Fetch API để tự động trim
//   if (url.startsWith("http")) {
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||;
//     // Thêm f_png và e_trim:20 để xử lý triệt để các URL không có đuôi mở rộng và bóng mờ
//     return `https://res.cloudinary.com/${cloudName}/image/fetch/f_png,e_trim:20/${encodeURIComponent(url)}`;
//   }

//   return url;
// }

/**
 * Thêm transformation cắt lề vào URL Cloudinary hoặc URL ngoài (Fetch API).
 * Sử dụng Named Transformation: t_trim_10 và t_fetch_trim
 */
export function applyCloudinaryTrim(url: string | undefined): string {
  if (!url) return "";

  if (url.startsWith("/")) return url;

  if (url.includes("cloudinary.com")) {
    // Bỏ qua nếu đã có sẵn trim hoặc named transformation trim
    if (url.includes("t_bg_remove") || url.includes("e_trim") || url.includes("t_trim") || url.includes("t_fetch_trim")) {
      return url;
    }

    if (url.includes("/upload/")) {
      // Đã thay thế e_trim:10/ thành t_trim_10/
      return url.replace("/upload/", "/upload/t_trim_10/");
    }
    return url;
  }

  // Đối với URL bên ngoài (http/https) qua Cloudinary Fetch API
  if (url.startsWith("http")) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    // Đã thay thế f_png,e_trim:20 thành t_fetch_trim
    return `https://res.cloudinary.com/${cloudName}/image/fetch/t_fetch_trim/${encodeURIComponent(url)}`;
  }

  return url;
}
