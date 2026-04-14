/**
 * Service gọi Facemint.io Face Swap API để hoán đổi khuôn mặt.
 *
 * Exports:
 *   - createFacemintTask() — gửi media_url + swap_list tới Facemint, nhận về taskId
 *   - pollFacemintTask()   — poll POST /api/get-task-info cho đến khi state = 3 (success)
 *
 * Controller sẽ orchestrate 2 hàm này trong background worker (xem face-swap/controller.ts).
 *
 * API docs:
 *   - https://facemint.io/face-swap-api/create-face-swap-task
 *   - https://facemint.io/face-swap-api/get-face-swap-task-info
 */

import axios from "axios";

const FACEMINT_BASE_URL = "https://api.facemint.io/api";

/** Khoảng cách giữa mỗi lần poll (ms) */
const POLL_INTERVAL = 3_000; // 3 giây

interface CreateTaskResponse {
  code: number;
  info: string;
  data: {
    taskId: string;
    price?: number;
    [key: string]: any;
  };
}

interface TaskInfoResponse {
  code: number;
  info: string;
  data: {
    id: string;
    /** Trạng thái: -1=failed, 0=pending, 1=processing, 2=cancelled, 3=success */
    state: number;
    process?: number;
    result?: {
      file_url?: string;
      thumb_url?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export interface FaceSwapOptions {
  /** URL ảnh khuôn mặt user — sẽ được ghép vào ảnh target (Facemint to_face) */
  userImageUrl: string;
  /** URL ảnh target — ảnh gốc giữ nguyên nội dung, chỉ thay khuôn mặt (Facemint media_url) */
  targetImageUrl: string;
  /**
   * URL ảnh crop khuôn mặt target — dùng để xác định CHÍNH XÁC mặt nào trong
   * targetImageUrl cần được thay thế (Facemint from_face). Cần thiết khi target
   * có nhiều người để tăng độ chính xác. Nếu omit, Facemint sẽ thay TẤT CẢ
   * khuôn mặt trong target.
   */
  refFaceUrl?: string;
  /** Loại media: "image" | "gif" | "video" (mặc định: "image") */
  type?: "image" | "gif" | "video";
  /** Resolution: 1=480p, 2=720p, 3=1080p, 4=2K, 5=4K, 6=8K (mặc định: 3) */
  resolution?: number;
  /** Bật enhance khuôn mặt: 1=on, 0=off (mặc định: 1) */
  enhance?: number;
}

/**
 * Gửi yêu cầu tạo face swap task tới Facemint.io.
 * Trả về taskId để poll kết quả sau.
 */
export async function createFacemintTask(
  apiKey: string,
  options: FaceSwapOptions
): Promise<string> {
  // callback_url la field required va phai la URL hop le — API reject neu rong.
  // Ta van dung polling qua /get-task-info nen callback chi la placeholder.
  const callbackUrl =
    process.env.FACEMINT_CALLBACK_URL || "https://example.com/facemint/callback";

  // Neu refFaceUrl khong duoc cung cap, omit from_face — Facemint se thay
  // TAT CA khuon mat trong media. Khi co refFaceUrl, Facemint chi thay dung
  // khuon mat khop voi anh crop nay (huu ich khi target co nhieu nguoi).
  const swapEntry: { from_face?: string; to_face: string } = {
    to_face: options.userImageUrl,
  };
  if (options.refFaceUrl) {
    swapEntry.from_face = options.refFaceUrl;
  }

  const body = {
    type: options.type || "image",
    media_url: options.targetImageUrl,
    start_time: 0,
    end_time: 0,
    resolution: options.resolution ?? 3,
    enhance: options.enhance ?? 1,
    nsfw_check: 0,
    face_recognition: 0.8,
    face_detection: 0.25,
    watermark: "",
    callback_url: callbackUrl,
    swap_list: [swapEntry],
  };

  console.log("[Facemint] createTask body:", JSON.stringify(body, null, 2));

  try {
    const response = await axios.post<CreateTaskResponse>(
      `${FACEMINT_BASE_URL}/create-face-swap-task`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );

    console.log("[Facemint] createTask response:", JSON.stringify(response.data, null, 2));

    if (response.data.code !== 0) {
      throw new Error(
        `Facemint createTask failed (code=${response.data.code}): ${response.data.info}`
      );
    }

    return response.data.data.taskId;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      console.error(
        "[Facemint] createTask HTTP error:",
        err.response.status,
        JSON.stringify(err.response.data, null, 2)
      );
      throw new Error(
        `Facemint createTask HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      );
    }
    throw err;
  }
}

export interface PollOptions {
  /** Timeout tối đa (ms) — mặc định 300_000 (5 phút) */
  timeoutMs?: number;
  /** Khoảng cách giữa các lần poll (ms) — mặc định 3_000 */
  intervalMs?: number;
  /** Callback mỗi lần nhận state từ Facemint (dùng để update progress vào store) */
  onProgress?: (info: { state: number; process?: number }) => void;
}

/**
 * Poll POST /api/get-task-info cho đến khi task hoàn thành hoặc timeout.
 * Trả về URL ảnh kết quả (file_url).
 */
export async function pollFacemintTask(
  apiKey: string,
  taskId: string,
  opts: PollOptions = {}
): Promise<string> {
  const timeoutMs = opts.timeoutMs ?? 300_000;
  const intervalMs = opts.intervalMs ?? POLL_INTERVAL;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const response = await axios.post<TaskInfoResponse>(
      `${FACEMINT_BASE_URL}/get-task-info`,
      { task_id: taskId },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );

    const { state, result, process: processPct } = response.data.data;
    opts.onProgress?.({ state, process: processPct });

    if (state === 3) {
      const fileUrl = result?.file_url;
      if (!fileUrl) {
        throw new Error("Facemint trả về success nhưng không có result.file_url.");
      }
      return fileUrl;
    }

    if (state === -1) {
      throw new Error(`Facemint task thất bại (state=-1, taskId: ${taskId})`);
    }

    if (state === 2) {
      throw new Error(`Facemint task bị hủy (state=2, taskId: ${taskId})`);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Facemint task timeout sau ${timeoutMs / 1000}s (taskId: ${taskId})`);
}

