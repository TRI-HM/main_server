# Face Swap API — Client Integration Spec

Tài liệu dành cho đội frontend (browser) tích hợp API face swap sau khi server refactor sang **async flow**.

---

## Thay đổi so với version cũ (BREAKING)

| Version cũ (sync) | Version mới (async) |
|---|---|
| Gọi `POST /generate` và **chờ 30s-2 phút** trong 1 HTTP request | Gọi `POST /generate` → nhận `taskId` **ngay** (<2s), sau đó poll `/status/:taskId` |
| Response trả thẳng `{ originalUrl, generatedUrl }` | Response `/generate` trả `{ taskId, status: "pending", originalUrl }` — chưa có `generatedUrl` |
| HTTP status 200 | HTTP status **202 Accepted** cho `/generate` |
| Nếu Facemint chậm >120s → fail toàn bộ | Task chạy nền, client poll tới khi `status=done` hoặc `failed`, không bị timeout |

Client **phải refactor** logic gọi API — không tương thích ngược.

---

## Endpoint 1 — Khởi tạo task

### `POST /api/ai/face-swap/generate`

**Request** — `multipart/form-data`:

| Field | Type | Required | Ghi chú |
|---|---|---|---|
| `image` | File | ✅ | Ảnh khuôn mặt user (JPG/PNG). Server sẽ nén xuống ~200KB trước khi upload S3. |
| `name` | string | ✅ | Tên cơ sở cho file, VD: `nguyen_van_a`. Sẽ được normalize (bỏ dấu, thay space bằng `_`). |
| `target_face` | string (URL) | ✅ | URL public của ảnh target (ảnh gốc giữ nội dung, chỉ thay mặt). Không được upload target_face lên server của mình. |
| `ref_face` | string (URL) | ❌ | URL ảnh crop mặt target — giúp Facemint chọn đúng mặt khi target có nhiều người. Nếu omit, TẤT CẢ mặt trong target sẽ bị thay. |
| `resolution` | number `1..6` | ❌ | 1=480p, 2=720p, **3=1080p (default)**, 4=2K, 5=4K, 6=8K. |
| `enhance` | `0` \| `1` | ❌ | Bật enhance khuôn mặt. Default `1`. |

**Response — 202 Accepted** (thành công):

```json
{
  "code": 202,
  "message": "Task đã được khởi tạo",
  "data": {
    "taskId": "3f9a1b2c-...-uuid-v4",
    "status": "pending",
    "originalUrl": "https://cdn.example.com/.../nguyen_van_a-original.jpg",
    "baseName": "nguyen_van_a"
  }
}
```

**Response — 400 Bad Request** (thiếu field):

```json
{
  "code": 400,
  "message": "Thiếu \"name\" hoặc \"target_face\" trong body."
}
```

**Response — 500** (server chưa cấu hình `FACEMINT_API_KEY`): hiếm gặp, báo lỗi và thử lại sau.

### Client cần làm gì sau khi nhận response

1. **Lưu `taskId`** vào state (Redux/Zustand/useState…). Có thể lưu vào `localStorage` để giữ qua reload trang (xem mục "Reload trang" bên dưới).
2. **Hiển thị ngay `originalUrl`** cho user thấy ảnh họ upload (progressive UX).
3. **Bắt đầu polling `/status/:taskId`** (xem endpoint 2).

---

## Endpoint 2 — Poll trạng thái

### `GET /api/ai/face-swap/status/:taskId`

**Không có body, không cần header đặc biệt.**

**Response — 200 OK:**

```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "taskId": "3f9a1b2c-...",
    "status": "pending" | "processing" | "done" | "failed",
    "progress": 0 | 25 | 50 | ... | 100,
    "originalUrl": "https://cdn.example.com/.../original.jpg",
    "generatedUrl": "https://cdn.example.com/.../generated.jpg",
    "baseName": "nguyen_van_a",
    "error": "..."
  }
}
```

**Các field tuỳ theo `status`:**

| `status` | Ý nghĩa | `progress` | `generatedUrl` | `error` |
|---|---|---|---|---|
| `pending` | Vừa tạo, chưa gửi lên Facemint | ❌ | ❌ | ❌ |
| `processing` | Đang chờ Facemint xử lý | ✅ (0-99) | ❌ | ❌ |
| `done` | Hoàn tất, ảnh kết quả đã trên S3 | `100` | ✅ | ❌ |
| `failed` | Có lỗi (Facemint fail / timeout / network) | ❌ | ❌ | ✅ (message) |

**Response — 404 Not Found** (task không tồn tại hoặc đã hết hạn >1h):

```json
{ "code": 404, "message": "Task không tồn tại hoặc đã hết hạn." }
```

Nếu gặp 404 → hiển thị "Task hết hạn, vui lòng thử lại" và xoá `taskId` khỏi state.

---

## Polling strategy (QUAN TRỌNG)

### Cấu hình gợi ý

- **Interval**: `3000ms` (3 giây). Không nhỏ hơn 2s để tránh spam server.
- **Max poll time**: `10 phút` (200 lần poll). Nếu quá → coi như lỗi, hiển thị "Quá lâu, vui lòng thử lại".
- **Stop khi**: `status === "done"` hoặc `status === "failed"` hoặc HTTP 404.

### Pseudo code (JavaScript)

```js
async function pollFaceSwapStatus(taskId, { onProgress, onDone, onFail }) {
  const INTERVAL_MS = 3000;
  const MAX_ATTEMPTS = 200; // 10 phút
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    try {
      const res = await fetch(`/api/ai/face-swap/status/${taskId}`);
      if (res.status === 404) {
        return onFail(new Error("Task đã hết hạn"));
      }
      const { data } = await res.json();

      if (data.status === "done") {
        return onDone(data);                    // { generatedUrl, ... }
      }
      if (data.status === "failed") {
        return onFail(new Error(data.error));
      }
      // pending | processing
      onProgress?.(data.progress ?? 0, data.status);
    } catch (err) {
      // Lỗi network — vẫn retry
      console.warn("Poll lỗi, retry:", err);
    }
    await new Promise(r => setTimeout(r, INTERVAL_MS));
  }
  onFail(new Error("Timeout sau 10 phút"));
}
```

### Với React (ví dụ hook)

```js
function useFaceSwapTask(taskId) {
  const [state, setState] = useState({ status: "pending", progress: 0 });

  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      if (cancelled) return;
      const res = await fetch(`/api/ai/face-swap/status/${taskId}`);
      if (!res.ok) { setState(s => ({ ...s, status: "failed", error: "Task hết hạn" })); clearInterval(interval); return; }
      const { data } = await res.json();
      setState(data);
      if (data.status === "done" || data.status === "failed") {
        clearInterval(interval);
      }
    }, 3000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [taskId]);

  return state;
}
```

---

## UX guidelines

1. **Hiển thị progress bar** dựa vào `progress` khi `status=processing`. Khi `status=pending` thì hiện indeterminate spinner.
2. **Show `originalUrl` ngay lập tức** sau khi nhận response `/generate` — user biết ảnh đã upload OK, không phải chờ đen màn hình.
3. **Cho phép cancel** — client chỉ cần stop poll, server không có endpoint cancel (task sẽ tự hết TTL sau 1h).
4. **Error handling**: nếu `status=failed`, hiện nút "Thử lại" → gọi lại `/generate` với data cũ.
5. **Không disable nút submit quá lâu** — sau khi nhận taskId là có thể cho user thao tác khác (vì đang là async).

---

## Reload trang giữa chừng

Vì task chạy trên server, client có thể **restore** được sau reload:

1. Khi nhận `taskId` từ `/generate` → lưu vào `localStorage`:
   ```js
   localStorage.setItem("pendingFaceSwapTaskId", taskId);
   ```
2. Khi app mount, check `localStorage` → nếu có `taskId` → resume polling.
3. Khi `status=done|failed` → xoá khỏi `localStorage`.

**Lưu ý**: server lưu task trong RAM, TTL **1 giờ**. Nếu user reload sau >1h sẽ nhận 404 → xoá `taskId` khỏi storage và báo user làm lại.

**Lưu ý 2**: nếu server restart (deploy), task đang chạy sẽ mất → client nhận 404 khi poll → retry.

---

## Ví dụ end-to-end (plain JS)

```js
async function doFaceSwap(imageFile, name, targetFaceUrl) {
  // 1. Gửi request tạo task
  const fd = new FormData();
  fd.append("image", imageFile);
  fd.append("name", name);
  fd.append("target_face", targetFaceUrl);

  const createRes = await fetch("/api/ai/face-swap/generate", {
    method: "POST",
    body: fd,
  });
  const { data: createData } = await createRes.json();
  const { taskId, originalUrl } = createData;

  console.log("Ảnh user đã upload:", originalUrl);
  showImage(originalUrl);
  localStorage.setItem("pendingFaceSwapTaskId", taskId);

  // 2. Poll cho đến khi xong
  return new Promise((resolve, reject) => {
    pollFaceSwapStatus(taskId, {
      onProgress: (pct, status) => updateProgressBar(pct, status),
      onDone: (result) => {
        localStorage.removeItem("pendingFaceSwapTaskId");
        resolve(result.generatedUrl);
      },
      onFail: (err) => {
        localStorage.removeItem("pendingFaceSwapTaskId");
        reject(err);
      },
    });
  });
}
```

---

## Tóm tắt checklist cho frontend team

- [ ] Thay call `/generate` — không còn `await` 30s+ mà chỉ lấy `taskId`.
- [ ] Hiển thị `originalUrl` ngay sau khi nhận response `/generate`.
- [ ] Implement poll loop gọi `/status/:taskId` mỗi 3s, stop khi `done|failed|404`.
- [ ] Handle `progress` để vẽ progress bar.
- [ ] Handle `status=failed` → show error + nút retry.
- [ ] Lưu `taskId` vào `localStorage` để resume sau reload.
- [ ] Xoá `taskId` khỏi `localStorage` khi `done|failed|404`.
- [ ] Max poll time 10 phút → timeout UI.
- [ ] Test trường hợp server chậm, Facemint chậm, mất mạng giữa chừng, reload trang.
