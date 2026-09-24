// BFF login chuẩn mới: POST /api/v1/auth/login
// (giữ nguyên logic HttpOnly cookie, chỉ khác path để đúng chuẩn backend /api/v1).
// Route cũ POST /api/auth/login vẫn hoạt động để tương thích ngược.
// Lưu ý: file này phải tồn tại để Next.js ưu tiên BFF thay vì rewrite proxy
// `/api/v1/:path*` -> backend.
export { POST } from '../../../auth/login/route';
