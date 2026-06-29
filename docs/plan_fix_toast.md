Dưới đây là bản plan hoàn chỉnh hơn.

# Kế hoạch điều chỉnh Toast Notification toàn dự án

## Mục tiêu

Chuẩn hóa cách xử lý lỗi và toast trong toàn bộ frontend Next.js.

Backend đã trả về `message` thân thiện cho người dùng, vì vậy frontend sẽ ưu tiên sử dụng `message` từ backend. Tuy nhiên, frontend vẫn phải quyết định message đó nên hiển thị bằng cách nào: toast, inline error, error state, hay im lặng.

Nguyên tắc chính:

> Backend cung cấp nội dung lỗi thân thiện. Frontend quyết định trải nghiệm hiển thị lỗi.

---

## 1. Chiến lược tổng thể

### 1.1 Axios không phải nơi duy nhất bắn toast

`axios.ts` chỉ xử lý các lỗi mang tính hệ thống hoặc session:

- Network error
- Timeout
- Refresh token thất bại
- 403 Forbidden
- 429 Too Many Requests
- 500+ Server Error

Các lỗi nghiệp vụ như `400`, `404`, `409`, `422` sẽ được reject xuống component/query để xử lý theo ngữ cảnh.

---

## 2. Quy tắc xử lý theo status code

| Status        | Xử lý ở đâu       | Cách hiển thị                             |
| ------------- | ----------------- | ----------------------------------------- |
| Network Error | `axios.ts`        | Toast global                              |
| Timeout       | `axios.ts`        | Toast global                              |
| 400           | Component / Query | Toast hoặc inline tùy case                |
| 401           | `axios.ts`        | Refresh token, nếu fail thì logout        |
| 403           | `axios.ts`        | Toast global                              |
| 404           | Component / Query | Error state / empty state / toast tùy màn |
| 409           | Component / Query | Inline error hoặc toast nghiệp vụ         |
| 422           | Component / Form  | Inline field error là ưu tiên             |
| 429           | `axios.ts`        | Toast global                              |
| 500+          | `axios.ts`        | Toast global an toàn                      |

---

## 3. Quy tắc dùng message từ backend

Backend trả:

```json
{
  "message": "Email này đã được sử dụng"
}

Frontend được phép dùng:
const message = getApiErrorMessage(error);
toast.error(message);

Nhưng không được show message backend một cách mù quáng cho mọi loại lỗi.

Rule
Với 400, 409, 422: ưu tiên dùng message backend.
Với 403, 429: có thể dùng message backend nếu đã thân thiện.
Với 500+: ưu tiên fallback an toàn:
"Lỗi hệ thống. Vui lòng thử lại sau."
Với Network/Timeout: frontend tự dùng message:
"Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền."
4. Cập nhật axios.ts
4.1 Thêm custom config cho request

Cần hỗ trợ các option sau:
silent?: boolean;
showErrorToast?: boolean;
errorToastMessage?: string;

Ý nghĩa:

Option	Ý nghĩa
silent: true	Không cho axios tự hiện toast
showErrorToast: true	Ép axios hiện toast cho lỗi nghiệp vụ
errorToastMessage	Override message hiển thị

Ví dụ:

api.post('/auth/login', data, {
  silent: true,
});

Dùng khi form muốn tự xử lý inline error.

Ví dụ khác:

api.delete('/wardrobe/items/1', {
  showErrorToast: true,
});

Dùng khi thao tác đơn giản, không cần component tự viết onError.

4.2 Axios chỉ auto toast cho lỗi global

Axios tự toast với:

Network error
Timeout
Refresh token fail
403
429
500+

Axios không tự toast mặc định với:

400
404
409
422

Trừ khi request có:

showErrorToast: true
4.3 Chống spam toast khi refresh token fail

Nếu nhiều request cùng fail 401, chỉ được hiện toast:

Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.

một lần duy nhất.

Sau đó:

clear auth state
redirect về login
không bắn nhiều toast trùng nhau
5. Tạo helper xử lý lỗi dùng chung

Tạo file gợi ý:

src/lib/api-error.ts

Helper cần có:

getApiErrorMessage(error, fallbackMessage)
getApiErrorStatus(error)
getApiErrorData(error)
isValidationError(error)
isNetworkError(error)

Mục tiêu:

Không parse error.response.data.message rải rác khắp project.
Component vẫn dùng message backend nhưng qua helper chuẩn.
Dễ đổi format API sau này.

Ví dụ usage:

const message = getApiErrorMessage(
  error,
  'Thao tác thất bại. Vui lòng thử lại.'
);

toast.error(message);
6. Quy tắc xử lý trong React Query
6.1 Không xóa toàn bộ onError

Không được xóa hàng loạt onError trong .queries.ts.

Chỉ xóa khi:

onError chỉ toast trùng với axios
message đang code cứng không còn cần thiết
action không cần toast lỗi

Giữ onError khi cần:

rollback optimistic update
set form error
invalidate query
xử lý logic riêng
hiển thị error state
toast theo đúng ngữ cảnh màn hình
6.2 Query GET không nên toast bừa

Với API load dữ liệu:

useQuery(...)

Không nên tự động toast mỗi lần lỗi, vì có thể gây spam khi refetch.

Ưu tiên:

error state trong UI
empty state
retry button
message hiển thị trong khu vực nội dung

Ví dụ:

Không thể tải danh sách outfit. Vui lòng thử lại.

Không nhất thiết dùng toast.

6.3 Mutation do user click có thể toast

Với API do user chủ động thao tác:

useMutation(...)

Có thể dùng toast nếu lỗi không thuộc form field.

Ví dụ nên toast:

Xóa item thất bại
Tạo bài viết thất bại
Lưu outfit thất bại
Thanh toán thất bại

Ví dụ không nên toast:

Like/unlike thất bại nếu UI rollback là đủ
Toggle follow nếu giao diện đã phản hồi rõ
Validation form có field cụ thể
7. Quy tắc form validation

Với form login/register/profile/change password:

Nếu lỗi gắn được với field, dùng inline error.
Không ưu tiên toast cho lỗi field-level.

Ví dụ:

Lỗi	Cách hiển thị
Email đã tồn tại	Inline dưới input email
Mật khẩu hiện tại sai	Inline dưới input password hiện tại hoặc toast tùy UI
Thiếu dữ liệu	Inline field error
Sai email/password login	Có thể toast hoặc inline form-level

Không để axios tự toast các request form nếu form cần kiểm soát lỗi:

silent: true
8. Quy tắc success toast

Không phải thao tác thành công nào cũng cần toast.

Nên toast success
Đăng bài thành công
Xóa bài thành công
Cập nhật profile thành công
Đổi mật khẩu thành công
Lưu outfit thành công
Thanh toán thành công
Không nên toast success
Like/unlike bài viết
Follow/unfollow nếu UI đã đổi trạng thái
Save toggle nhỏ
Các thao tác xảy ra quá thường xuyên
Message success

Ưu tiên dùng res.message từ backend nếu có:

toast.success(res.message ?? 'Thao tác thành công.');

Nhưng vẫn được fallback ở frontend.

9. Toast loading / promise

Chỉ dùng toast.promise cho các thao tác có thời gian chờ rõ ràng:

Upload ảnh
AI generate outfit
Payment
Submit form lớn
Import dữ liệu

Không dùng toast.promise cho thao tác nhỏ như like, follow, toggle.

10. Kế hoạch triển khai theo batch
Batch 1: Nền tảng error handling

Mục tiêu:

Sửa axios.ts
Thêm custom request config
Tạo helper api-error.ts
Chưa sửa hàng loạt .queries.ts

Checklist:

[ ] Thêm type cho silent, showErrorToast, errorToastMessage
[ ] Axios auto toast cho Network/Timeout/403/429/500+
[ ] Axios không auto toast mặc định cho 400/404/409/422
[ ] Chặn spam toast khi refresh token fail
[ ] Tạo helper đọc error.response.data.message
[ ] Test login expired/session fail

Sau Batch 1 phải dừng lại để review.

Batch 2: Auth + Profile

Mục tiêu:

Chuẩn hóa lỗi form quan trọng trước.

Checklist:

[ ] Login dùng silent: true nếu muốn tự xử lý lỗi
[ ] Register trùng email dùng inline error hoặc toast theo UI hiện có
[ ] Change password xử lý message backend
[ ] Xóa các toast lỗi bị trùng
[ ] Giữ lại logic onError nếu có set form error/logout/redirect`

Sau Batch 2 phải dừng lại để review.

Batch 3: Wardrobe + Outfits

Mục tiêu:

Chuẩn hóa lỗi thao tác chính của app.

Checklist:

[ ] Upload item lỗi: dùng message backend
[ ] Delete item lỗi: toast theo ngữ cảnh
[ ] Save outfit lỗi: toast theo ngữ cảnh
[ ] AI generate lỗi: cân nhắc toast.promise
[ ] Không toast rác cho thao tác nhỏ nếu UI đã phản hồi đủ`

Sau Batch 3 phải dừng lại để review.

Batch 4: Community

Mục tiêu:

Giảm toast rác trong feed.

Checklist:

[ ] Xóa toast success/error không cần thiết khi like/unlike`
[ ] Giữ rollback optimistic update nếu có`
[ ] Create post thất bại: toast message backend`
[ ] Delete post thất bại: toast message backend`
[ ] Comment thất bại: toast hoặc inline tùy UI`

Sau Batch 4 phải dừng lại để review.

Batch 5: Subscription + Billing

Mục tiêu:

Xử lý kỹ các flow liên quan thanh toán.

Checklist:

[ ] Không che mất message quan trọng từ backend`
[ ] Payment fail hiển thị toast rõ ràng`
[ ] Payment loading có thể dùng toast.promise
[ ] Không auto redirect nếu chưa kiểm tra flow hiện tại`
[ ] Kiểm tra kỹ các trạng thái pending/success/failed`

Sau Batch 5 phải dừng lại để review.

Batch 6: Cleanup toàn dự án

Mục tiêu:

Dọn toast trùng, toast rác, message hardcode không cần thiết.

Checklist:

[ ] Search toàn project: toast.error
[ ] Search toàn project: toast.success
[ ] Search toàn project: onError
[ ] Xóa toast trùng với axios global`
[ ] Giữ toast theo ngữ cảnh cần thiết`
[ ] Đảm bảo không còn hiện 2 toast cho 1 lỗi`
11. Rule bắt buộc khi refactor
Nên làm
Dùng message backend cho lỗi nghiệp vụ.
Dùng helper chung để đọc lỗi.
Giữ onError nếu nó có logic ngoài toast.
Ưu tiên inline error cho form.
Ưu tiên error state cho query GET.
Ưu tiên toast cho mutation do user chủ động click.
Chia batch nhỏ, mỗi batch xong phải dừng để review.
Không nên làm
Không biến axios thành nơi duy nhất bắn toast cho mọi lỗi.
Không xóa hàng loạt toàn bộ onError.
Không show message backend cho 500+ nếu có nguy cơ lộ lỗi kỹ thuật.
Không toast cho like/unlike nếu UI rollback đã đủ.
Không toast success cho mọi thao tác nhỏ.
Không parse error.response.data.message thủ công ở nhiều nơi.
Không đổi logic API, route, query key, store nếu không cần.
Không refactor UI lớn trong batch toast/error.
Không sửa unrelated files.
12. Tiêu chí hoàn thành

Một batch được xem là hoàn thành khi:

Không còn double toast trong flow đã sửa.
Message lỗi nghiệp vụ lấy được từ backend.
Form validation không bị ép thành toast nếu cần inline.
Query GET không spam toast khi refetch.
Session expired chỉ hiện toast một lần.
Không phá optimistic update.
Không đổi behavior ngoài phạm vi toast/error.

Tóm lại, bản plan chuẩn nên đi theo hướng: **backend lo nội dung message, frontend lo nơi hiển thị message**. Đừng cho Codex là
```
