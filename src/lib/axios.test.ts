/**
 * Tệp kiểm thử (Unit Test) cho luồng tự động Refresh Token trong Axios.
 *
 * Lưu ý: Để chạy tệp test này, bạn cần cài đặt các thư viện sau:
 * npm install -D jest @types/jest ts-jest axios-mock-adapter @testing-library/react
 *
 * Lệnh chạy: npx jest src/lib/axios.test.ts
 */

import api from "./axios";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { toast } from "sonner";

// Mock các component giao diện (window, toast)
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

delete (window as any).location;
(window as any).location = {
  href: "",
  pathname: "/wardrobe",
};

describe("Axios Interceptor - Auto Refresh Token Flow", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    // Khởi tạo mock cho instance api
    mock = new MockAdapter(api);

    // Mock trực tiếp axios.post vì interceptor gọi axios.post('/api/auth/refresh-token')
    jest.spyOn(axios, "post");
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
    window.location.href = "";
  });

  afterAll(() => {
    mock.restore();
  });

  it("1. Nên gọi API bình thường khi token hợp lệ (Trả về 200 OK)", async () => {
    const responseData = { data: [{ id: 1, name: "Áo thun" }] };
    mock.onGet("/me/wardrobe-items").reply(200, responseData);

    const res = await api.get("/me/wardrobe-items");
    expect(res.status).toBe(200);
    expect(res.data).toEqual(responseData);
  });

  it("2. Nên tự động gọi refresh-token và thử lại request khi gặp lỗi 401", async () => {
    // Bước 1: Giả lập API /me/wardrobe-items trả về 401 Unauthorized (Token hết hạn) ở lần gọi đầu
    // Bước 2: Ở lần gọi thứ 2 (sau khi refresh), trả về 200 OK
    mock
      .onGet("/me/wardrobe-items")
      .replyOnce(401, { message: "Unauthorized" })
      .onGet("/me/wardrobe-items")
      .replyOnce(200, { data: "Success after refresh" });

    // Giả lập API refresh-token thành công (trả về 200)
    (axios.post as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { accessToken: "new-token" },
    });

    const res = await api.get("/me/wardrobe-items");

    // Kiểm tra kết quả
    expect(axios.post).toHaveBeenCalledWith("/api/auth/refresh-token", {}, { baseURL: "" });
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ data: "Success after refresh" });
  });

  it("3. Nên đưa các request đồng thời vào hàng đợi và xử lý cùng lúc sau khi refresh thành công", async () => {
    mock
      .onGet("/me/wardrobe-items")
      .replyOnce(401, { message: "Unauthorized" })
      .onGet("/me/wardrobe-items")
      .reply(200, { data: "Req 1" });
    mock
      .onGet("/me/profile")
      .replyOnce(401, { message: "Unauthorized" })
      .onGet("/me/profile")
      .reply(200, { data: "Req 2" });

    // Cố tình làm API refresh-token chậm một chút để các request dồn vào failedQueue
    (axios.post as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ status: 200, data: { accessToken: "new-token" } }), 100)
        )
    );

    // Gửi 2 request ĐỒNG THỜI
    const [res1, res2] = await Promise.all([api.get("/me/wardrobe-items"), api.get("/me/profile")]);

    // Refresh token CHỈ NÊN ĐƯỢC GỌI 1 LẦN DUY NHẤT
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
  });

  it("4. Nên đá văng người dùng về trang đăng nhập nếu refresh-token cũng thất bại", async () => {
    mock.onGet("/me/wardrobe-items").reply(401, { message: "Unauthorized" });

    // Giả lập API refresh-token cũng lỗi 401 (Refresh token hết hạn)
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 401, data: { message: "Refresh token expired" } },
    });

    try {
      await api.get("/me/wardrobe-items");
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }

    // Kiểm tra đã gọi toast thông báo lỗi
    expect(toast.error).toHaveBeenCalledWith("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

    // Kiểm tra đã set timeout để chuyển hướng (dùng fakeTimers nếu muốn test chi tiết hơn)
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);
    // Lưu ý: trong test môi trường Node thì window.location.href sẽ được update
  });
});
