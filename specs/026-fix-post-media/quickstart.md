# Quickstart Validation Guide: 026 Fix Post Media

**Feature**: `026-fix-post-media`
**Created**: 2026-09-28
**Purpose**: Hướng dẫn các bước xác thực luồng bài đăng `media` (ảnh/video) sau khi triển khai mã nguồn.

Tham chiếu:
- Render rules: [`data-model.md`](./data-model.md) §2
- Component contract: [`contracts/post-media-ui-contract.md`](./contracts/post-media-ui-contract.md)
- Giới hạn backend: `specs/022-community-social/contracts/frontend-integration.md` §3.12

---

## 1. Điều kiện tiên quyết (Prerequisites)

1. Máy chủ Backend đang chạy tại `http://localhost:8080/api/v1` (hoặc proxy qua `npm run dev`).
2. Tài khoản User A: `test_user_a` — đã đăng nhập, có tệp ảnh (jpg/png/webp < 10MB) và video (mp4/webm < 100MB, < 60s) để test.
3. Dựng frontend: `npm run dev` (truy cập `http://localhost:3000`).
4. Kiểm tra biên dịch: `npx tsc --noEmit` và chạy unit tests `npm test` phải sạch.

---

## 2. Kịch bản xác thực 1: Hiển thị toàn bộ media trên trang chi tiết

- **Mục tiêu**: Bài `media` nhiều tệp hiển thị đầy đủ, không chỉ tệp đầu (FR-001 / SC-001).
- **Thực hiện**:
  1. Tạo (hoặc có sẵn) một bài `media` có 3-5 tệp (hỗn hợp ảnh + video).
  2. Mở trang chi tiết `/posts/{publicId}`.
  3. Kiểm tra gallery hiển thị tệp đầu làm ảnh chính, các tệp còn lại trong lưới.
  4. Bấm vào một tệp → lightbox mở, có nút prev/next và chỉ số `{i}/{N}`; video phát được trong lightbox.
- **Kết quả kỳ vọng**: 100% tệp hiển thị theo `sortOrder`; không mất tệp; video phát mượt.

## 3. Kịch bản xác thực 2: Video trong feed điều hướng được

- **Mục tiêu**: Bấm video trên thẻ feed vào được trang chi tiết (FR-004 / SC-004).
- **Thực hiện**:
  1. Trên feed `/community`, tìm bài `media` có tệp đầu tiên là video.
  2. Bấm vào vùng video (không phải nút điều khiển) → chuyển tới `/posts/{publicId}`.
  3. Bấm nút play/pause hoặc mute trong video (feed) → chỉ phát/tắt tiếng, KHÔNG điều hướng.
- **Kết quả kỳ vọng**: Điều hướng đúng khi bấm vùng video; nút điều khiển hoạt động độc lập.

## 4. Kịch bản xác thực 3: Dấu hiệu số lượng tệp trên feed

- **Mục tiêu**: Thẻ bài `media` nhiều tệp hiển thị badge số lượng (FR-003 / SC-003).
- **Thực hiện**:
  1. Trên feed, kiểm tra bài `media` có ≥ 2 tệp hiển thị badge `+{N-1}` (hoặc icon kèm số).
  2. Bài `media` chỉ 1 tệp không hiển thị badge.
- **Kết quả kỳ vọng**: Badge xuất hiện chính xác theo số tệp.

## 5. Kịch bản xác thực 4: Validation MIME & giới hạn client-side

- **Mục tiêu**: Chặn tệp sai định dạng/kích thước trước khi gọi API (FR-005/006, SC-005).
- **Thực hiện** (mở composer → tab "Hình ảnh / Video"):
  1. Chọn ảnh `image/gif` hoặc `image/svg` → bị chặn, toast "Ảnh chỉ hỗ trợ định dạng jpg, png, webp.".
  2. Chọn ảnh jpg > 10MB → bị chặn "ảnh vượt quá dung lượng tối đa 10MB".
  3. Chọn video `video/avi` hoặc `video/quicktime` → bị chặn "Video chỉ hỗ trợ định dạng mp4, webm".
  4. Chọn video mp4 > 100MB hoặc > 60s → bị chặn tương ứng.
  5. Chọn 11 tệp → chỉ nhận 10 tệp, toast vượt giới hạn.
- **Kết quả kỳ vọng**: 0 yêu cầu vượt giới hạn gửi lên backend (SC-005).

## 6. Kịch bản xác thực 5: Tải lên song song & cô lập lỗi tệp

- **Mục tiêu**: Một tệp lỗi không hủy cả bài; bài vẫn tạo được với tệp thành công (FR-009).
- **Thực hiện**:
  1. Chọn 2 ảnh hợp lệ + 1 file giả (đổi đuôi `.mp4` nhưng nội dung không phải video) — mô phỏng tệp lỗi khi upload.
  2. Nhập nội dung chữ, nhấn Đăng bài.
  3. Kiểm tra: 2 ảnh thành công, toast cảnh báo tệp lỗi, bài được tạo với 2 ảnh.
  4. Thử lần 2: chọn toàn bộ tệp lỗi, KHÔNG nhập nội dung → bị chặn submit với toast lỗi.
- **Kết quả kỳ vọng**: Bài tạo thành công khi còn ≥1 tệp/nội dung; không tạo bài trống.

## 7. Kịch bản xác thực 6: Media lỗi hiển thị placeholder

- **Mục tiêu**: Ảnh/video URL lỗi hiển thị placeholder, không vỡ layout (FR-011).
- **Thực hiện**:
  1. Sửa thủ công URL của một tệp trong response (hoặc dùng mock) thành URL lỗi.
  2. Mở feed và chi tiết bài đó.
- **Kết quả kỳ vọng**: Ô tệp lỗi hiển thị icon placeholder; các tệp khác và layout bình thường.

## 8. Kịch bản xác thực 7: Chỉnh sửa bài `media`

- **Mục tiêu**: Sửa bài `media` giữ nguyên tệp cũ, thêm/xóa tệp mới, không đổi `postType` (FR-008).
- **Thực hiện**:
  1. Mở bài `media` của chính mình → Chỉnh sửa.
  2. Xóa 1 ảnh, thêm 1 video mới, đổi nội dung, nhấn Lưu.
  3. Kiểm tra: tệp giữ nguyên không bị tải lại; tệp mới xuất hiện; loại bài vẫn `media`; tab chọn loại bị khóa.
  4. Xóa hết tệp, để trống nội dung → bị chặn khi Lưu.
- **Kết quả kỳ vọng**: Bài cập nhật đúng; không mất tệp; không đổi loại; chặn bài rỗng.

## 9. Kịch bản xác thực 8: Lỗi hệ thống (400/401/429)

- **Mục tiêu**: Thông báo tiếng Việt cho các mã lỗi (FR-010).
- **Thực hiện**:
  1. Đăng xuất rồi thử tạo bài → thông báo yêu cầu đăng nhập (401).
  2. Nhập nội dung > 5000 ký tự → chặn client-side.
  3. (Tùy chọn) Dùng tài khoản spam để vượt rate limit → thông báo 429 "thao tác quá nhanh, thử lại sau".
- **Kết quả kỳ vọng**: Toàn bộ thông báo tiếng Việt rõ ràng, không crash. (SC-007)