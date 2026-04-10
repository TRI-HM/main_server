/**
 * Service gọi Facemint.io Face Swap API để hoán đổi khuôn mặt.
 *
 * Luồng hoạt động:
 *   1. createTask() — gửi media_url + swap_list tới Facemint, nhận về taskId
 *   2. pollTaskResult() — poll POST /api/get-task-info cho đến khi state = 3 (success)
 *   3. faceSwap() — kết hợp cả 2 bước trên, trả về URL ảnh đã swap
 *
 * API docs:
 *   - https://facemint.io/face-swap-api/create-face-swap-task
 *   - https://facemint.io/face-swap-api/get-face-swap-task-info
 */

import axios from "axios";

const FACEMINT_BASE_URL = "https://api.facemint.io/api";

/** Thời gian chờ tối đa khi poll kết quả (ms) */
const POLL_TIMEOUT = 120_000; // 2 phút
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
  /** URL ảnh user (đã upload lên cloud storage) — đóng vai trò media gốc */
  userImageUrl: string;
  /** URL ảnh target face — khuôn mặt sẽ được ghép vào ảnh user */
  targetFaceUrl: string;
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
async function createTask(apiKey: string, options: FaceSwapOptions): Promise<string> {
  // callback_url la field required va phai la URL hop le — API reject neu rong.
  // Ta van dung polling qua /get-task-info nen callback chi la placeholder.
  const callbackUrl =
    process.env.FACEMINT_CALLBACK_URL || "https://example.com/facemint/callback";

  const body = {
    type: options.type || "image",
    media_url: options.targetFaceUrl,
    start_time: 0,
    end_time: 0,
    resolution: options.resolution ?? 3,
    enhance: options.enhance ?? 1,
    nsfw_check: 0,
    face_recognition: 0.8,
    face_detection: 0.25,
    watermark: "",
    callback_url: callbackUrl,
    swap_list: [
      {
        from_face: options.targetFaceUrl,
        to_face: options.userImageUrl,
      },
    ],
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

/**
 * Poll POST /api/get-task-info cho đến khi task hoàn thành hoặc timeout.
 * Trả về URL ảnh kết quả (file_url).
 */
async function pollTaskResult(apiKey: string, taskId: string): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < POLL_TIMEOUT) {
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

    const { state, result } = response.data.data;

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

    // state: 0 (pending) | 1 (processing) → chờ rồi poll lại
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error(`Facemint task timeout sau ${POLL_TIMEOUT / 1000}s (taskId: ${taskId})`);
}

/**
 * Hàm chính — thực hiện face swap từ ảnh user sang target face.
 *
 * @returns URL ảnh kết quả từ Facemint (tạm thời, cần download và lưu lên cloud riêng)
 */
export async function faceSwap(apiKey: string, options: FaceSwapOptions): Promise<string> {
  const taskId = await createTask(apiKey, options);
  const resultUrl = await pollTaskResult(apiKey, taskId);
  return resultUrl;
}
