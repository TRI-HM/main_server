/**
 * In-memory store cho face swap task — lưu trạng thái async task.
 *
 * Hạn chế đã biết:
 *   - Restart server → mất toàn bộ task đang chạy (client cần retry).
 *   - Không scale multi-instance (task ở instance A, client poll instance B sẽ 404).
 *   - Nếu cần scale: đổi sang Redis (đã có sẵn trong project) hoặc DB.
 *
 * TTL: task tự xoá sau 1 giờ kể từ lúc tạo để tránh memory leak.
 */

export type FaceSwapTaskStatus = "pending" | "processing" | "done" | "failed";

export interface FaceSwapTask {
  taskId: string;
  /** Facemint task id — internal, không expose ra client */
  facemintTaskId: string;
  status: FaceSwapTaskStatus;
  /** 0..100 — tiến độ từ Facemint (chỉ có khi status=processing) */
  progress?: number;
  /** URL ảnh user đã upload lên S3 (có ngay từ lúc tạo task) */
  originalUrl: string;
  /** URL ảnh kết quả trên S3 (chỉ có khi status=done) */
  generatedUrl?: string;
  /** Tên cơ sở của file */
  baseName: string;
  /** Lỗi (khi status=failed) */
  error?: string;
  createdAt: number;
  updatedAt: number;
}

const TASK_TTL_MS = 60 * 60 * 1000; // 1 giờ

const store = new Map<string, FaceSwapTask>();

export function createTaskRecord(
  task: Omit<FaceSwapTask, "createdAt" | "updatedAt">
): FaceSwapTask {
  const now = Date.now();
  const record: FaceSwapTask = { ...task, createdAt: now, updatedAt: now };
  store.set(task.taskId, record);
  return record;
}

export function updateTaskRecord(
  taskId: string,
  patch: Partial<Omit<FaceSwapTask, "taskId" | "createdAt">>
): FaceSwapTask | null {
  const existing = store.get(taskId);
  if (!existing) return null;
  const updated: FaceSwapTask = { ...existing, ...patch, updatedAt: Date.now() };
  store.set(taskId, updated);
  return updated;
}

export function getTaskRecord(taskId: string): FaceSwapTask | null {
  return store.get(taskId) ?? null;
}

// Dọn dẹp định kỳ các task quá hạn
setInterval(() => {
  const cutoff = Date.now() - TASK_TTL_MS;
  for (const [id, task] of store.entries()) {
    if (task.createdAt < cutoff) store.delete(id);
  }
}, 10 * 60 * 1000).unref();
