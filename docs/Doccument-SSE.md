# TÀI LIỆU KỸ THUẬT: ĐẶC TẢ GIAO THỨC SSE (SERVER-SENT EVENTS)

> **Phiên bản:** 2.0 — Production Ready  
> **Cập nhật:** 2026-09-02

---

## 1. Tổng quan luồng kiến trúc (End-to-End Flow)

Hệ thống tách biệt việc upload dữ liệu và theo dõi tiến trình thành **2 pha độc lập**:

```
[Frontend]                                                    [Backend]
    │                                                              │
    ├─── (1) POST /api/v1/items/upload (FormData/JSON) ──────────>│ Tạo Task Job ID
    │<── (2) HTTP 202: { taskId: "task_123" } ───────────────────┤ Đẩy vào Message Queue
    │                                                              │ (RabbitMQ / Redis / Kafka)
    │                                                              │
    ├─── (3) GET /api/v1/tasks/task_123/sse ─────────────────────>│
    │         (Accept: text/event-stream)                          │
    │<── (4) HTTP 200 OK (Stream Opened) ────────────────────────┤
    │                                                              │
    │<── (5) id:1  event: progress  data: { status: "PROCESSING" }┤ Worker cập nhật tiến trình
    │<── (6) id:2  event: progress  data: { status: "PROCESSING" }┤
    │<── (7) id:3  event: done      data: { status: "COMPLETED" } ┤ Hoàn tất → Server đóng connection
    │                                                              │
    └─── (8) Client nhận "done" → Đóng stream phía client ───────┘
```

---

## 2. Đặc tả Giao thức Truyền thông (SSE Contract)

### 2.1 Headers bắt buộc từ Backend

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no
```

> **Ghi chú:** Header `X-Accel-Buffering: no` là **bắt buộc** nếu hệ thống chạy sau Nginx/Reverse Proxy để tắt bộ đệm buffer. Cần cấu hình thêm `proxy_buffering off;` và `proxy_cache off;` trong Nginx config.

---

### 2.2 Quy ước Event Types & Payloads

Mỗi SSE frame **bắt buộc** tuân thủ chuẩn RFC 8895:

```
id: <sequential_id>\n
event: <name>\n
data: <json_string>\n
\n
```

> **Lưu ý:** Field `id:` là bắt buộc trong production để hỗ trợ cơ chế `Last-Event-ID` khi client reconnect.

---

#### Event 1: `progress` — Đang xử lý

Bắn định kỳ khi worker cập nhật trạng thái tác vụ.

```
id: 1
event: progress
data: {"taskId":"task_123","status":"PROCESSING","progress":45,"message":"Đang phân tích hình ảnh..."}

```

---

#### Event 2: `done` — Hoàn tất thành công

Bắt buộc trả về đầy đủ entity đã hoàn tất để Frontend render ngay mà **không cần gọi thêm API GET phụ**.

```
id: 3
event: done
data: {"taskId":"task_123","status":"COMPLETED","progress":100,"item":{"id":"item_888","name":"Áo Blazer Vintage","category":"Outerwear","imageUrl":"https://cdn.example.com/items/888.jpg"}}

```

---

#### Event 3: `error` — Tác vụ thất bại do nghiệp vụ

```
id: 4
event: error
data: {"taskId":"task_123","status":"FAILED","errorCode":"INVALID_IMAGE_RESOLUTION","message":"Ảnh quá mờ, vui lòng tải ảnh rõ nét hơn."}

```

> **Quy ước `errorCode`:** Frontend phải xử lý `errorCode` để hiển thị thông báo lỗi phù hợp theo từng loại lỗi nghiệp vụ.

---

#### Event 4: `ping` — Heartbeat / Keep-Alive

Bắn mỗi **15–30 giây** nếu tác vụ xử lý lâu nhưng chưa có tiến trình mới, tránh bị Gateway/Load Balancer (AWS ALB, Cloudflare) tự ngắt kết nối (504 Gateway Timeout).

```
id: 2
event: ping
data: {"timestamp":1725254400000}

```

---

## 3. Đặc tả triển khai Backend (Node.js / Express)

```typescript
import { Request, Response } from 'express';

export async function sseTaskHandler(req: Request, res: Response) {
  const { taskId } = req.params;

  // ── SECURITY: Xác thực quyền sở hữu task ──────────────────────────────
  // Đảm bảo taskId thuộc về user đang request, tránh task ID enumeration.
  const userId = req.user?.id; // Lấy từ auth middleware
  const task = await taskRepository.findByIdAndOwner(taskId, userId);
  if (!task) {
    res.status(404).json({ message: 'Task not found or access denied.' });
    return;
  }

  // ── 1. Cấu hình Headers chuẩn SSE ─────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Tắt buffer trên Nginx
  res.flushHeaders(); // Flush ngay để client biết stream đã mở

  let eventCounter = 0;

  // ── Helper gửi SSE frame chuẩn RFC 8895 ───────────────────────────────
  const sendSSE = (event: string, data: object) => {
    eventCounter++;
    res.write(`id: ${eventCounter}\n`);
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // ── 2. Khai báo cleanup TRƯỚC KHI subscribe ────────────────────────────
  // QUAN TRỌNG: cleanup phải được khai báo trước subscribe để tránh
  // "Cannot access 'cleanup' before initialization" khi dùng const.
  let unsubscribe: (() => void) | undefined;

  const cleanup = () => {
    clearInterval(heartbeatTimer);
    unsubscribe?.();
    res.end(); // Đóng stream
  };

  // ── 3. Idempotency: Trả về trạng thái hiện tại ngay khi kết nối ───────
  // Nếu client reconnect sau khi mất mạng, server phải push ngay
  // trạng thái hiện tại từ DB/Redis thay vì đợi event tiếp theo.
  if (task.status === 'COMPLETED') {
    sendSSE('done', {
      taskId,
      status: 'COMPLETED',
      progress: 100,
      item: task.resultItem,
    });
    res.end();
    return;
  }
  if (task.status === 'FAILED') {
    sendSSE('error', {
      taskId,
      status: 'FAILED',
      errorCode: task.errorCode,
      message: task.errorMessage,
    });
    res.end();
    return;
  }
  if (task.status === 'PROCESSING') {
    // Push trạng thái hiện tại ngay nếu task đang chạy
    sendSSE('progress', {
      taskId,
      status: 'PROCESSING',
      progress: task.progress ?? 0,
      message: task.currentStep ?? 'Đang xử lý...',
    });
  }

  // ── 4. Setup Heartbeat chống rớt kết nối (504 Gateway Timeout) ────────
  const heartbeatTimer = setInterval(() => {
    sendSSE('ping', { timestamp: Date.now() });
  }, 20000); // 20 giây

  // ── 5. Đăng ký nhận message từ Queue / Redis PubSub ───────────────────
  unsubscribe = taskQueue.subscribe(taskId, (taskUpdate) => {
    if (taskUpdate.status === 'PROCESSING') {
      sendSSE('progress', {
        taskId,
        status: 'PROCESSING',
        progress: taskUpdate.progress,
        message: taskUpdate.stepName,
      });
    }

    if (taskUpdate.status === 'COMPLETED') {
      sendSSE('done', {
        taskId,
        status: 'COMPLETED',
        progress: 100,
        item: taskUpdate.resultItem,
      });
      cleanup();
    }

    if (taskUpdate.status === 'FAILED') {
      sendSSE('error', {
        taskId,
        status: 'FAILED',
        errorCode: taskUpdate.errorCode,
        message: taskUpdate.errorMessage,
      });
      cleanup();
    }
  });

  // ── 6. Client chủ động ngắt kết nối ───────────────────────────────────
  req.on('close', cleanup);
}
```

---

## 4. Đặc tả triển khai Frontend (TypeScript — Fetch Stream)

Sử dụng **Fetch API + ReadableStream** thay vì `EventSource` để hỗ trợ:
- `Authorization` header (Bearer token)
- Custom Cookies
- Parse chuẩn multi-line `data:` theo RFC 8895

### 4.1 Types

```typescript
// ── Error Codes nghiệp vụ ─────────────────────────────────────────────
export type TaskErrorCode =
  | 'INVALID_IMAGE_RESOLUTION'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'QUOTA_EXCEEDED'
  | 'PROCESSING_TIMEOUT'
  | 'UNKNOWN_ERROR';

// ── Payload chuẩn từ Server ───────────────────────────────────────────
export interface TaskProgressPayload<T = unknown> {
  taskId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  message?: string;
  errorCode?: TaskErrorCode; // Dùng để hiển thị UI lỗi theo từng loại
  item?: T;                  // Generic thay vì any
}

// ── Options cho subscribeTaskSSE ──────────────────────────────────────
export interface SubscribeSSEOptions<T = unknown> {
  taskId: string;
  onProgress: (data: TaskProgressPayload<T>) => void;
  onSuccess: (item: T) => void;
  onError: (error: Error, errorCode?: TaskErrorCode) => void;
  signal?: AbortSignal;
  authToken?: string; // Optional: Bearer token
}
```

---

### 4.2 Implementation

```typescript
export async function subscribeTaskSSE<T = unknown>({
  taskId,
  onProgress,
  onSuccess,
  onError,
  signal,
  authToken,
}: SubscribeSSEOptions<T>): Promise<void> {
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

  try {
    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`/api/v1/tasks/${taskId}/sse`, {
      method: 'GET',
      headers,
      credentials: 'include',
      signal,
    });

    if (!res.ok) {
      throw new Error(`SSE Connection Failed: HTTP ${res.status}`);
    }

    reader = res.body?.getReader();
    if (!reader) throw new Error('ReadableStream unavailable');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Tách các SSE frame hoàn chỉnh (frame kết thúc bằng \n\n)
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? ''; // Giữ lại phần frame chưa hoàn chỉnh

      for (const frame of frames) {
        if (!frame.trim()) continue;

        let eventType = 'message';
        // FIX: Dùng mảng để hỗ trợ multi-line data: theo RFC 8895
        const dataLines: string[] = [];

        for (const line of frame.split('\n')) {
          if (line.startsWith('event:')) {
            eventType = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            // RFC 8895: Nhiều dòng data: được nối bằng '\n'
            dataLines.push(line.slice(5).trim());
          }
          // 'id:' và 'retry:' không cần xử lý phía client trong trường hợp này
        }

        if (dataLines.length === 0) continue;

        const rawData = dataLines.join('\n');

        let parsed: TaskProgressPayload<T>;
        try {
          parsed = JSON.parse(rawData) as TaskProgressPayload<T>;
        } catch {
          // Frame không phải JSON hợp lệ — bỏ qua
          continue;
        }

        // Bỏ qua heartbeat
        if (eventType === 'ping') continue;

        if (eventType === 'progress') {
          onProgress(parsed);
        } else if (eventType === 'done' || parsed.status === 'COMPLETED') {
          onProgress(parsed);
          onSuccess(parsed.item as T);
          return; // Hoàn tất: thoát vòng lặp và chạy finally cleanup
        } else if (eventType === 'error' || parsed.status === 'FAILED') {
          onError(
            new Error(parsed.message ?? 'Tác vụ thất bại'),
            parsed.errorCode,
          );
          return;
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') return;
    onError(err instanceof Error ? err : new Error(String(err)));
  } finally {
    // Luôn giải phóng reader dù thoát theo cách nào
    if (reader) {
      try {
        await reader.cancel();
        reader.releaseLock();
      } catch {
        // Bỏ qua lỗi khi stream đã bị đóng
      }
    }
  }
}
```

---

### 4.3 Cách sử dụng với AbortController (React Hook)

```typescript
// Trong component React — cleanup khi unmount
useEffect(() => {
  const controller = new AbortController();

  subscribeTaskSSE({
    taskId,
    signal: controller.signal,
    onProgress: (data) => setProgress(data.progress ?? 0),
    onSuccess: (item) => {
      setResult(item);
      setStatus('completed');
    },
    onError: (error, errorCode) => {
      setStatus('failed');
      // Xử lý hiển thị UI theo errorCode
      if (errorCode === 'INVALID_IMAGE_RESOLUTION') {
        setErrorMessage('Ảnh quá mờ, vui lòng tải ảnh rõ nét hơn.');
      } else {
        setErrorMessage(error.message);
      }
    },
  });

  // Cleanup khi component unmount — tự động gửi AbortError
  return () => controller.abort();
}, [taskId]);
```

---

## 5. Cấu hình Nginx (Production)

```nginx
location /api/v1/tasks/ {
    proxy_pass         http://backend;
    proxy_http_version 1.1;

    # Bắt buộc cho SSE
    proxy_buffering    off;
    proxy_cache        off;
    proxy_set_header   Connection '';

    # Tăng timeout để tránh 504 khi task xử lý lâu
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;

    # Chuyển tiếp headers xác thực
    proxy_set_header   Authorization $http_authorization;
    proxy_set_header   X-Real-IP $remote_addr;
}
```

---

## 6. Security Checklist

| Hạng mục | Mô tả |
|---|---|
| **Ownership Check** | Backend **bắt buộc** xác thực `taskId` thuộc về user đang request. Không trả về 403 mà dùng 404 để tránh lộ thông tin task tồn tại hay không. |
| **Auth Token** | Truyền token qua `Authorization` header hoặc cookie `HttpOnly`. Không truyền qua query string (bị log server). |
| **CORS** | Cấu hình `Access-Control-Allow-Origin` với origin cụ thể, không dùng `*` cho endpoint có credentials. |
| **Rate Limiting** | Giới hạn số lần mở SSE connection đồng thời mỗi user (ví dụ: tối đa 5 connections). |
| **Task ID Format** | Dùng UUID v4 hoặc CUID cho `taskId`, không dùng số tự tăng để tránh enumeration. |

---

## 7. Production Readiness Checklist

- [ ] **Nginx buffering:** `proxy_buffering off;` và `proxy_cache off;` đã cấu hình.
- [ ] **Idempotency:** Server trả ngay trạng thái hiện tại khi client reconnect (xử lý `Last-Event-ID` header).
- [ ] **Heartbeat:** Backend bắn `ping` mỗi 20 giây để tránh 504 Gateway Timeout.
- [ ] **Cleanup:** Backend có `req.on('close', cleanup)` để giải phóng tài nguyên khi client ngắt.
- [ ] **AbortController:** Frontend gắn `AbortController` vào lifecycle component (unmount).
- [ ] **errorCode:** Backend luôn trả `errorCode` trong event `error`, Frontend xử lý hiển thị UI theo từng loại.
- [ ] **Generic Types:** Không dùng `any` cho payload `item`, thay bằng Generic `<T>`.
- [ ] **Multi-line data:** Frontend parse đúng chuẩn RFC 8895 (nối nhiều dòng `data:` bằng `\n`).
- [ ] **Security — Ownership:** Backend xác thực `taskId` thuộc về user trước khi mở stream.
- [ ] **Security — Rate Limiting:** Giới hạn số SSE connections đồng thời mỗi user.
- [ ] **`id:` field:** Mỗi SSE frame có `id:` để hỗ trợ `Last-Event-ID` khi reconnect.

