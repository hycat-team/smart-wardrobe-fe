1. Bảng đối chiếu: Hiện tại vs. Chuẩn Production trong tài liệu
   Tiêu chí Chuẩn Production (Doccument-SSE.md) Hiện trạng Backend (Go/Gin) Hiện trạng Frontend (Next.js) Đánh giá
   Protocol / Client fetch + ReadableStream Gin SSE (c.SSEvent) fetch + ReadableStream ✅ Đã đúng kiến trúc
   Parsing RFC 8895 Tách frame bằng \n\n, ghép nhiều dòng data: bằng \n Gửi frame đơn dòng Đã nâng cấp tách \n\n & multi-line ✅ Frontend đã hoàn thiện
   Reader Cleanup Giải phóng reader (cancel() & releaseLock()) trong finally Đóng qua request context Đã thêm vào khối finally ✅ Frontend đã hoàn thiện
   Response Headers X-Accel-Buffering: no, Cache-Control: no-cache, no-transform Thiếu X-Accel-Buffering: no (chỉ có no-cache) Nhận text/event-stream ❌ BE cần bổ sung
   Event Types Tách rõ: progress, done, error, ping Chỉ gửi event: message cho mọi trường hợp Đã hỗ trợ cả done, progress, ping lẫn fallback message ❌ BE cần chuẩn hóa
   Heartbeat (Keep-Alive) Bắn ping mỗi 15–30s chống timeout 504 proxy Chưa có ticker heartbeat Đã bỏ qua ping không trigger re-render ❌ BE cần bổ sung
   Vòng đời kết nối Khi xong (done/error), Server chủ động đóng stream Server không đóng stream, đợi client tự ngắt Đã hỗ trợ client tự ngắt ⚠️ BE nên chủ động đóng
   Idempotency khi Reconnect Client vừa connect vào: push ngay trạng thái hiện tại từ DB/Redis Chưa có (nếu task đã xong trước khi client kịp mở SSE, client đợi vô hạn) Phải tự refetch fallback ❌ BE cần bổ sung
   Security (Ownership) Kiểm tra taskId có thuộc về userId đang đăng nhập không Chưa check ownership trong SubscribeTaskSSE Gửi kèm credentials/cookie ❌ BE cần bổ sung
   Field id: Mỗi frame có id: <seq> để hỗ trợ Last-Event-ID Chưa gửi id: Chưa cần dùng id: ⚠️ BE nên bổ sung
2. Phần FRONTEND: Đã điều chỉnh và tối ưu ngay
   Tôi đã cập nhật trực tiếp mã nguồn Frontend để đáp ứng chuẩn RFC 8895 trong tài liệu:

Chuẩn hóa bộ đọc Stream RFC 8895 trong

wardrobe.api.ts
và

brand-portal.api.ts
:
Thay vì cắt từng dòng \n, chuyển sang tách frame chuẩn bằng buffer.split('\n\n').
Hỗ trợ gom nhiều dòng data: thành một payload JSON duy nhất theo đúng đặc tả RFC.
Thêm bộ lọc bỏ qua event ping (heartbeat) để tránh re-render thừa.
Thêm khối finally { reader.cancel(); reader.releaseLock(); } để giải phóng socket và bộ nhớ khi stream kết thúc.
Khả năng tương thích ngược (Backward Compatibility):
Hỗ trợ cả 2 định dạng: vừa nhận diện chuẩn mới (event: done, event: progress, status COMPLETED) vừa xử lý tương thích 100% với định dạng hiện tại của BE (event: message, status completed).
Đồng bộ hóa tức thì với React Query:
Thêm initialDataUpdatedAt: 0 trong useMyWardrobe để triệt tiêu cache stale từ SSR.
Gọi trực tiếp refetch() thông qua callback useWardrobeSSE(items, handleItemUpdated) để cập nhật giao diện 0ms khi nhận SSE. 3. Phần BACKEND: Danh sách gửi Team BE kiểm tra & nâng cấp
Bạn có thể gửi nguyên văn phần dưới đây cho Team Backend để chuẩn hóa endpoint SSE theo chuẩn Production:

📋 Góp ý chuẩn hóa Endpoint SSE (/api/v1/wardrobe-items/tasks/:taskId/sse & Brand Portal)
Bổ sung Headers chống Buffer trên Nginx/Proxy:
Hiện tại trong internal/shared/presentation/sse.go, hàm InitSSE đang thiếu:
go
c.Header("X-Accel-Buffering", "no")
c.Header("Cache-Control", "no-cache, no-transform")
Lý do: Khi deploy sau Nginx / Cloudflare / AWS ALB, thiếu X-Accel-Buffering: no sẽ khiến proxy buffer lại toàn bộ stream, client không nhận được event realtime.
Phân tách Event Types chuẩn thay vì dùng chung message:
Hiện tại handler đang gọi c.SSEvent("message", string(data)) cho mọi payload.
Cần chuẩn hóa theo các event name riêng biệt:
c.SSEvent("progress", ...) khi worker đang phân tích.
c.SSEvent("done", ...) khi phân tích thành công (trả kèm entity kết quả).
c.SSEvent("error", ...) khi thất bại (kèm errorCode, message).
Chủ động đóng Stream khi Task hoàn tất:
Hiện tại trong c.Stream(...), handler giữ vòng lặp vô hạn và không tự kết thúc khi item đã hoàn tất.
Đề xuất: Khi event là done hoặc error, handler gửi frame xong thì return false hoặc đóng channel để server chủ động đóng stream, giải phóng kết nối HTTP trên server.
Bổ sung Heartbeat / Keep-Alive (ping):
Nếu AI phân tích ảnh tốn từ 20–40s mà không có bản tin nào truyền đi, Gateway sẽ tự ngắt kết nối với mã lỗi 504 Gateway Timeout.
Đề xuất: Thêm ticker time.NewTicker(20 \* time.Second) trong c.Stream để gửi c.SSEvent("ping", map[string]any{"timestamp": time.Now().UnixMilli()}).
Hỗ trợ Idempotency (Xử lý khi Client Reconnect hoặc Task đã xong trước):
Hiện tại nếu worker xử lý quá nhanh và đã Publish trước khi Client kịp gọi API SSE, hoặc Client bị rớt mạng rồi kết nối lại, Client sẽ đứng đợi vô hạn vì channel không có dữ liệu cũ.
Đề xuất: Khi Client gọi vào handler SSE, query kiểm tra trạng thái Task trong DB/Redis trước:
Nếu task đã Completed -> gửi ngay event done rồi đóng stream.
Nếu task đã Failed -> gửi ngay event error rồi đóng stream.
Nếu còn Processing -> mới bắt đầu lắng nghe channel từ sseManager.
Bảo mật (Task Ownership Validation):
Trong SubscribeTaskSSE, cần kiểm tra taskId có thuộc sở hữu của userID trong token JWT không (SELECT ... WHERE task_id = :taskId AND user_id = :userId). Nếu không khớp, trả về HTTP 404 để tránh lộ thông tin task giữa các user.
