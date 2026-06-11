# Tài liệu Tích hợp API: AI Style Stylist Chatbot (SSE Stream)

Tài liệu này hướng dẫn lập trình viên Frontend (FE) cách tích hợp và tiêu thụ (consume) API tư vấn thời trang trực tuyến thời gian thực (Server-Sent Events - SSE Stream) từ Stylist AI.

---

## 1. Thông tin Endpoint API

* **Địa chỉ:** `/api/v1/ai/chat/sessions/:contextID/messages/stream`
* **Phương thức:** `POST`
* **Xác thực (Authentication):** Sử dụng **Cookie** tự động đính kèm từ trình duyệt.
  * Key cookie: `accessToken`
* **Headers yêu cầu:**
  ```http
  Content-Type: application/json
  Accept: text/event-stream
  ```
* **Path Parameter:**
  * `contextID` *(UUID / String)*: ID của phiên hội thoại (Chat Session ID).

> [!IMPORTANT]
> Vì cơ chế xác thực sử dụng Cookie (`accessToken`), khi gọi API qua `fetch`, FE bắt buộc phải thiết lập tham số `{ credentials: "include" }` để trình duyệt tự động gửi kèm cookie của domain lên Server.

---

## 2. Cấu trúc Dữ liệu Yêu cầu (Request Body)

Dữ liệu gửi lên dạng JSON chứa duy nhất nội dung câu hỏi/tin nhắn của người dùng:

```json
{
  "content": "Tôi nên mặc gì để đi hẹn hò tối nay với style tối giản?"
}
```

---

## 3. Định dạng Phản hồi (SSE Response)

API trả về dữ liệu stream dưới định dạng tiêu chuẩn của Server-Sent Events (SSE). Dữ liệu của trường `data` luôn được bao quanh bởi dấu ngoặc kép đôi và đã được escape an toàn (JSON string format).

### Các loại Sự kiện (SSE Events)

Hệ thống sẽ gửi về 2 loại event chính:

#### 1. Sự kiện `chunk` (Nhận từng từ/ký tự)
Được bắn liên tục khi mô hình AI đang sinh văn bản. FE ghép các nội dung này lại để hiển thị hiệu ứng chữ gõ (typing effect) theo thời gian thực.
* **Format:**
  ```http
  event: chunk
  data: "Nội dung đoạn text..."
  ```

#### 2. Sự kiện `done` (Hoàn thành)
Báo hiệu AI đã hoàn thành phản hồi của tin nhắn hiện tại. Dữ liệu đi kèm là **toàn bộ văn bản phản hồi đầy đủ** đã được tích lũy.
* **Format:**
  ```http
  event: done
  data: "Toàn bộ nội dung câu trả lời hoàn chỉnh của AI..."
  ```

---

## 4. Các Luồng Nghiệp vụ Cần Lưu Ý (Business Flow)

### Luồng 1: Tự động Nhận diện Ý định Phối đồ (Outfit Intent Redirect)
* **Mô tả:** Nếu người dùng gửi tin nhắn thể hiện ý định phối đồ cụ thể (ví dụ: *"phối đồ đi tiệc cho tôi"*, *"recommend outfit"*), hệ thống sẽ kích hoạt bộ phân loại ý định (Intent Classifier).
* **Xử lý:**
  - Server sẽ ngay lập tức bắn ra 1 chunk/done duy nhất chứa thông điệp điều hướng cố định:
    > *"Để nhận được gợi ý phối đồ chuẩn xác nhất từ thuật toán của Smart Wardrobe, bạn vui lòng sử dụng chức năng Phối đồ trên màn hình chính."*
  - Luồng stream sẽ kết thúc ngay sau đó.
  - Hệ thống tự động ghi nhận hội thoại nhưng **không tính phí dịch vụ sâu (không trừ quota phối đồ chuyên sâu)**.

### Luồng 2: Tự động Hủy yêu cầu khi Ngắt kết nối sớm (Early Disconnect Protection)
* **Mô tả:** Nếu người dùng tắt trình duyệt, chuyển màn hình hoặc thoát khỏi cuộc hội thoại trong lúc AI đang sinh câu trả lời.
* **Xử lý:**
  - Backend sẽ tự động lắng nghe sự kiện đóng kết nối của Client.
  - Hệ thống sẽ ngay lập tức gửi tín hiệu hủy (cancel context) tới nhà cung cấp AI (Gemini/OpenAI) để tiết kiệm tài nguyên.
  - Lượt quota hàng ngày của người dùng **sẽ không bị trừ** nếu quá trình truyền phát chưa hoàn thành thành công.

---

## 5. Hướng dẫn Triển khai Code phía Frontend (JS / TS)

Do đối tượng `EventSource` mặc định của trình duyệt **chỉ hỗ trợ phương thức GET** và không hỗ trợ gửi Custom Headers hoặc Request Body, FE cần sử dụng phương thức `fetch` với `ReadableStream` hoặc thư viện `@microsoft/fetch-event-source` để tiêu thụ dữ liệu stream qua phương thức `POST`.

### Ví dụ triển khai bằng Fetch API chuẩn (Không phụ thuộc thư viện):

```typescript
async function sendChatMessageStream(contextID: string, userMessage: string) {
  try {
    const response = await fetch(`/api/v1/ai/chat/sessions/${contextID}/messages/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      // Bắt buộc cấu hình credentials là 'include' để tự động đính kèm cookie accessToken
      credentials: "include", 
      body: JSON.stringify({ content: userMessage }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || "Không thể kết nối đến máy chủ AI");
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";
    let currentEvent = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // Decode nhị phân sang chuỗi văn bản
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      
      // Giữ lại phần dòng chưa hoàn chỉnh cuối cùng vào buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === "") continue;

        if (trimmed.startsWith("event:")) {
          currentEvent = trimmed.replace("event:", "").trim();
        } else if (trimmed.startsWith("data:")) {
          const rawData = trimmed.replace("data:", "").trim();
          
          // Decode JSON string (vì dữ liệu từ SSE đã được escape ở dạng chuỗi)
          let textChunk = "";
          try {
            textChunk = JSON.parse(rawData);
          } catch (e) {
            textChunk = rawData;
          }

          if (currentEvent === "chunk") {
            // Xử lý cộng dồn chữ hiển thị lên khung chat
            console.log("Ký tự mới nhận:", textChunk);
            updateChatUIAppend(textChunk);
          } else if (currentEvent === "done") {
            // Nhận kết quả cuối cùng hoàn chỉnh
            console.log("Câu trả lời đầy đủ:", textChunk);
            updateUIFinalMessage(textChunk);
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error("Lỗi khi stream chat:", error);
    showErrorNotification(error.message);
  }
}
```

### Các mã trạng thái lỗi HTTP cần handle:
* **`400 Bad Request`**: Nội dung tin nhắn không hợp lệ hoặc rỗng.
* **`401 Unauthorized`**: Cookie `accessToken` không tồn tại, hết hạn hoặc không hợp lệ.
* **`403 Forbidden`**: Người dùng đã dùng hết hạn ngạch (quota) chat AI trong ngày.
* **`404 Not Found`**: Phiên hội thoại (`contextID`) không tồn tại hoặc đã bị xóa.
* **`500 Internal Server Error`**: Lỗi kết nối đến nhà cung cấp AI bên thứ ba hoặc lỗi DB hệ thống.
