# Kế hoạch tích hợp Flow Wardrobe và Outfits từ API Swagger

Kế hoạch này chi tiết hóa quá trình tích hợp các API nghiệp vụ của **Tủ đồ (Wardrobe)** và **Bộ phối đồ (Outfits)** từ file `swagger.json` vào frontend Next.js (`smart-wardrobe-fe`). Chúng ta sẽ chuyển đổi toàn bộ dữ liệu mock hiện tại sang dữ liệu thực tế từ backend, đồng thời tích hợp pipeline **tách nền tự động và tối ưu hóa dung lượng ảnh bằng AI trên Cloudinary**.

---

## Các API cần tích hợp (từ Swagger)

### 1. Phân hệ Tủ đồ (Wardrobe Items)
*   **Lấy danh sách tủ đồ cá nhân**: `GET /api/v1/me/wardrobe-items` (có hỗ trợ hiển thị khóa động nếu hạ cấp gói cước).
*   **Lấy chữ ký tải ảnh từ Cloudinary**: `GET /api/v1/wardrobe-items/upload-signature` (để client tải trực tiếp hình ảnh lên Cloudinary).
*   **Số hóa trang phục hàng loạt (Cắt ảnh)**: `POST /api/v1/wardrobe-items/batch-crop` (sau khi upload Cloudinary thành công, gửi danh sách link ảnh sang để AI nhận diện background).
*   **Khởi tạo nhanh tủ đồ từ Catalog**: `POST /api/v1/wardrobe-items/catalog-init` (sao chép nhanh trang phục mẫu hệ thống mà không tốn quota AI).
*   **Xem chi tiết món đồ**: `GET /api/v1/wardrobe-items/{id}` (chặn xem nếu bị khóa do quá quota).
*   **Nhân bản món đồ**: `POST /api/v1/wardrobe-items/{id}/clone` (tối đa 5 bản sao).
*   **Tìm kiếm thông minh**: `GET /api/v1/wardrobe-items/search` (fuzzy search qua Elasticsearch).

### 2. Phân hệ Phối đồ (Outfits)
*   **Lấy danh sách phối đồ cá nhân**: `GET /api/v1/me/outfits`
*   **Tạo bộ phối đồ mới**: `POST /api/v1/outfits` (lưu vị trí 2D coordinates, layer order và tỉ lệ scale của từng item lên canvas).
*   **Chi tiết bộ phối đồ**: `GET /api/v1/outfits/{id}` (lấy tọa độ 2D để phục dựng lại canvas).
*   **Cập nhật bộ phối đồ**: `PUT /api/v1/outfits/{id}`
*   **Xóa bộ phối đồ**: `DELETE /api/v1/outfits/{id}`

---

## Ý Tưởng Hoàn Thiện: Pipeline Tách Nền & Tối Ưu Dung Lượng Tự Động (Cloudinary AI)

Để đảm bảo hiệu năng tải trang cực nhanh (Core Web Vitals tốt), giảm băng thông sử dụng và lưu trữ, chúng ta sẽ áp dụng một pipeline biến đổi ảnh thông minh trực tiếp qua URL của Cloudinary khi người dùng upload ảnh lên.

```mermaid
flowchart TD
    A[Chọn ảnh thiết bị] --> B[Gọi API lấy signature]
    B --> C[Tải ảnh gốc lên Cloudinary]
    C --> D{URL ảnh gốc từ Cloudinary}
    D --> E[Chèn e_background_removal,f_auto,q_auto]
    E --> F[URL tối ưu & trong suốt]
    F --> G[Gửi URL này về API batch-crop]
    G --> H[Backend AI tải ảnh sạch về phân tích]
    G --> I[Lưu vào Database]
    I --> J[Hiển thị siêu tốc WebP/AVIF trên Client]
```

### Các tham số cấu hình tối ưu hóa trong URL:
1.  **`e_background_removal`**: Kích hoạt thuật toán AI của Cloudinary để tự động tách nền của món đồ, trả lại nền trong suốt (transparent).
2.  **`f_auto` (Format Auto)**: Tự động phát hiện trình duyệt của thiết bị client để trả về định dạng tối ưu nhất (ví dụ: **WebP** hoặc **AVIF** đối với Chrome/Safari để giữ độ trong suốt với dung lượng nhỏ nhất, tự động fallback về **PNG** đối với Go backend hoặc các trình duyệt cũ hơn).
3.  **`q_auto` (Quality Auto)**: Tự động phân tích cấu trúc pixel của ảnh để nén giảm dung lượng tối đa (có thể giảm 70-80% dung lượng file) nhưng vẫn đảm bảo chất lượng hiển thị sắc nét, không bị mờ nhòe.

### Cú pháp URL biến đổi (URL Transformation Syntax):
Khi nhận được URL ảnh gốc sau khi upload:
`https://res.cloudinary.com/dzvwkngxu/image/upload/v1716382021/smart_wardrobe/items/sample_id.jpg`

Chúng ta sẽ chèn `e_background_removal,f_auto,q_auto` vào ngay sau `/upload/` để tạo URL tối ưu:
`https://res.cloudinary.com/dzvwkngxu/image/upload/e_background_removal,f_auto,q_auto/v1716382021/smart_wardrobe/items/sample_id.jpg`

---

## User Review Required

> [!IMPORTANT]
> **1. Payload gửi xuống Backend sau khi tải lên Cloudinary**
> Sau khi upload thành công lên Cloudinary và lấy URL đã tối ưu hóa, frontend **phải gửi yêu cầu xuống backend qua API `batch-crop`** dưới dạng JSON chứa đúng cấu trúc 3 trường bắt buộc của từng item:
> *   `categoryId`: ID danh mục của trang phục (VD: Áo, Quần, Giày...).
> *   `imagePublicId`: ID định danh công khai của ảnh trên Cloudinary (lấy từ response upload Cloudinary).
> *   `imageUrl`: URL đầy đủ của ảnh **sau khi đã chèn tham số tách nền & nén dung lượng** (`/upload/e_background_removal,f_auto,q_auto/...`).

> [!IMPORTANT]
> **2. Bật Add-on Cloudinary AI Background Removal**
> *   Để sử dụng tham số `e_background_removal`, tài khoản Cloudinary đăng ký tại backend (`CLOUDINARY_CLOUD_NAME=dzvwkngxu`) cần đảm bảo đã kích hoạt add-on **Cloudinary AI Background Removal** (có gói miễn phí đi kèm tài khoản mới).

> [!IMPORTANT]
> **3. Đồng bộ hóa Tọa độ Canvas (2D Coordinates System)**
> *   API `SaveOutfitItemReq` yêu cầu vị trí `position_x` và `position_y` nằm trong khoảng `[0, 1]` (đã chuẩn hóa), cùng với `scale` nằm trong khoảng `[0.1, 10]`.
> *   Màn hình Canvas hiện tại đang dùng các giá trị pixel thô hoặc scale phần trăm (`100%`). Chúng ta cần viết hàm helper để chuẩn hóa các tọa độ kéo thả thực tế trên canvas của client thành tỉ lệ `[0, 1]` tương đối trước khi gửi lên API, và ngược lại khi hiển thị.

> [!WARNING]
> **4. Quản lý trạng thái Quota và Khóa đồ (Dynamic Locking System)**
> *   Nếu tài khoản người dùng hết hạn Premium hoặc bị hạ cấp, backend sẽ trả về trường `isLocked: true` cho một số món đồ vượt quá hạn ngạch gói Free (ví dụ: Free chỉ cho phép tối đa 30 món).
> *   UI tại `wardrobe/page.tsx` và `wardrobe/item/[id]` cần xử lý hiển thị overlay "Bị khóa/Yêu cầu nâng cấp" một cách trực quan, đồng thời vô hiệu hóa các nút tương tác (Ví dụ: Thêm vào canvas phối đồ, chỉnh sửa, đăng bán).

---

## Open Questions

> [!IMPORTANT]
> **1. Polling trạng thái xử lý AI (Processing Status)**
> *   Khi upload đồ mới thông qua `batch-crop`, các item sẽ ở trạng thái `Processing` (AI đang chạy background tách nền & gán nhãn).
> *   Chúng ta nên implement cơ chế polling tự động (ví dụ: mỗi 5-10 giây refetch danh sách tủ đồ nếu có item nào đang `Processing`) hay chỉ hiển thị trạng thái tĩnh và yêu cầu người dùng F5 hoặc bấm nút Refresh thủ công?
> *   **Đề xuất**: Sử dụng cơ chế refetch định kỳ của React Query (`refetchInterval` động khi có item có status là `3` - `Processing`).

---

## Proposed Changes

Chúng ta sẽ tổ chức code thành 2 feature module mới: `src/features/wardrobe` và `src/features/outfits` tương tự như cấu trúc các module sẵn có của project.

### 1. Phân hệ Tủ đồ (Wardrobe Feature)

#### [NEW] [types/index.ts](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/wardrobe/types/index.ts)
Định nghĩa tất cả các interface kiểu dữ liệu từ Swagger:
*   `WardrobeItemRes`, `CategoryRes`, `WardrobeItemStatus` (Enum).
*   `UploadSignatureResult`, `BatchCropWardrobeItemsReq`, `BatchCropWardrobeItemReq`.
*   `CloneWardrobeItemReq`, `InitClosetFromCatalogReq`.

#### [NEW] [api/wardrobe.api.ts](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/wardrobe/api/wardrobe.api.ts)
Xây dựng lớp API gọi axios:
*   `getMyWardrobeItems()` -> `GET /me/wardrobe-items`
*   `getUploadSignature()` -> `GET /wardrobe-items/upload-signature`
*   `batchCropWardrobeItems(data)` -> `POST /wardrobe-items/batch-crop`
*   `initClosetFromCatalog(data)` -> `POST /wardrobe-items/catalog-init`
*   `getWardrobeItemDetail(id)` -> `GET /wardrobe-items/{id}`
*   `cloneWardrobeItem(id, data)` -> `POST /wardrobe-items/{id}/clone`
*   `searchWardrobeItems(query)` -> `GET /wardrobe-items/search`

#### [NEW] [queries/wardrobe.queries.ts](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/wardrobe/queries/wardrobe.queries.ts)
Cung cấp các hooks React Query cho UI:
*   `useMyWardrobe()` (hỗ trợ tự động polling khi có items ở trạng thái `Processing`).
*   `useWardrobeItemDetail(id)`.
*   `useBatchCropWardrobeItems()`.
*   `useCloneWardrobeItem()`.
*   `useSearchWardrobeItems(query)`.
*   `useInitClosetFromCatalog()`.

---

### 2. Phân hệ Bộ phối đồ (Outfits Feature)

#### [NEW] [types/index.ts](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/outfits/types/index.ts)
Định nghĩa các interface:
*   `OutfitRes`, `OutfitItemRes`, `SaveOutfitReq`, `SaveOutfitItemReq`.

#### [NEW] [api/outfits.api.ts](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/outfits/api/outfits.api.ts)
Xây dựng lớp API gọi axios:
*   `getMyOutfits()` -> `GET /me/outfits`
*   `createOutfit(data)` -> `POST /outfits`
*   `getOutfitDetail(id)` -> `GET /outfits/{id}`
*   `updateOutfit(id, data)` -> `PUT /outfits/{id}`
*   `deleteOutfit(id)` -> `DELETE /outfits/{id}`

#### [NEW] [queries/outfits.queries.ts](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/outfits/queries/outfits.queries.ts)
Cung cấp các React Query hooks:
*   `useMyOutfits()`.
*   `useOutfitDetail(id)`.
*   `useCreateOutfit()`.
*   `useUpdateOutfit()`.
*   `useDeleteOutfit()`.

---

### 3. Tái cấu trúc giao diện UI Pages (Refactoring Pages)

#### [MODIFY] [wardrobe/page.tsx](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/page.tsx)
*   Thay thế dữ liệu mock `MOCK_ITEMS` bằng dữ liệu trả về từ hook `useMyWardrobe()`.
*   Hỗ trợ hiển thị badge `Processing` cho những đồ đang được AI xử lý background.
*   Hiển thị biểu tượng ổ khóa hoặc làm mờ (grayscale) kèm thông báo đối với các item có `isLocked: true`.
*   Tích hợp thanh tìm kiếm thông minh trực tiếp với Elastic Search qua debounce query và hook `useSearchWardrobeItems()`.

#### [MODIFY] [wardrobe/upload/page.tsx](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/upload/page.tsx)
*   Tích hợp quy trình upload thật, tự động tách nền và tối ưu dung lượng:
    1. Click chọn ảnh -> Gọi `getUploadSignature()`.
    2. Gửi file ảnh lên Cloudinary direct endpoint sử dụng API signature.
    3. Nhận phản hồi từ Cloudinary, sau đó gọi hàm helper để biến đổi URL ảnh gốc thành URL đã tối ưu và tách nền (`/upload/e_background_removal,f_auto,q_auto/...`).
    4. Gọi mutate `batchCropWardrobeItems` gửi payload gồm:
       ```json
       {
         "items": [
           {
             "categoryId": "ID_danh_mục_chọn",
             "imagePublicId": "public_id_từ_cloudinary",
             "imageUrl": "url_đã_biến_đổi"
           }
         ]
       }
       ```
    5. Chuyển hướng người dùng về trang `/wardrobe` với các item đang hiển thị trạng thái `Processing` (AI xử lý ngầm ở server).

#### [MODIFY] [outfits/page.tsx](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/page.tsx)
*   Thay thế `MOCK_OUTFITS` bằng hook `useMyOutfits()`.
*   Hiển thị danh sách các bộ đồ với ảnh bìa `cover_image_url` thực tế từ backend.
*   Tích hợp chức năng xóa bộ phối đồ (`useDeleteOutfit()`).

#### [MODIFY] [outfits/create/page.tsx](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/create/page.tsx)
*   Lấy danh sách các trang phục hợp lệ từ `useMyWardrobe()` (bỏ qua các món đồ đang `Processing` hoặc bị khóa `isLocked`).
*   Chuẩn hóa vị trí tọa độ khi kéo thả thả trên canvas:
    *   `position_x = absolute_x / canvas_width` (giới hạn `[0, 1]`)
    *   `position_y = absolute_y / canvas_height` (giới hạn `[0, 1]`)
    *   `scale = current_scale_percentage / 100` (giới hạn `[0.1, 10]`)
*   Khi nhấn **Lưu Phối Đồ**, gửi request lên `useCreateOutfit()` với đúng cấu trúc `SaveOutfitReq`.
*   Khi nhận dữ liệu từ AI Tự Phối, mô phỏng sinh tự động từ các item có sẵn trong tủ đồ và chuyển đổi sang toạ độ canvas.

---

## Verification Plan

### Automated Tests
*   Chạy lệnh `npm run build` ở thư mục `smart-wardrobe-fe` để xác thực toàn bộ TypeScript compilation không gặp lỗi khai báo hoặc kiểu dữ liệu.

### Manual Verification
*   **Đăng nhập và Tải ảnh**: Đăng nhập bằng tài khoản test, thực hiện upload một món đồ tại `/wardrobe/upload`, kiểm tra API request gửi lên Cloudinary và backend `batch-crop` có thành công hay không.
*   **Tách nền & Tối ưu dung lượng Cloudinary**: Mở tab Network của trình duyệt, kiểm tra kích thước file tải xuống của ảnh trang phục (nhờ `f_auto,q_auto` dung lượng thường sẽ giảm xuống chỉ còn khoảng vài chục KB so với vài MB của ảnh gốc). Xác thực ảnh không còn nền và hiển thị trong suốt trên canvas.
*   **Trạng thái AI Processing**: Kiểm tra xem item sau khi upload có hiển thị trạng thái `Đang xử lý` trong tủ đồ và tự động chuyển sang trạng thái sẵn dùng sau khi backend/AI hoàn thành phân tích.
*   **Tạo và Xem phối đồ**: Mở canvas phối đồ, kéo thả các item, kiểm tra toạ độ tương đối gửi lên DB và đảm bảo khi mở lại chi tiết bộ phối đồ tại `/outfits/{id}` canvas được phục dựng hoàn hảo đúng vị trí.
