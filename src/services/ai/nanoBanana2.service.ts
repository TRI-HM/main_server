/**
 * Service gọi Kie.ai NanoBanana2 API để tạo ảnh bằng AI.
 *
 * Luồng hoạt động:
 *   1. createTask() — gửi prompt + image URL tới Kie.ai, nhận về taskId
 *   2. pollTaskResult() — poll GET /getTaskDetails cho đến khi task hoàn thành
 *   3. generateImage() — kết hợp cả 2 bước trên, trả về URL ảnh AI đã tạo
 *
 * API docs: https://docs.kie.ai/market/google/nanobanana2
 */

import axios from "axios";

const KIE_BASE_URL = "https://api.kie.ai/api/v1/jobs";

/** Thời gian chờ tối đa khi poll kết quả (ms) */
const POLL_TIMEOUT = 120_000; // 2 phút
/** Khoảng cách giữa mỗi lần poll (ms) */
const POLL_INTERVAL = 3_000; // 3 giây

interface CreateTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    [key: string]: any;
  };
}

interface TaskDetailResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    /** Trạng thái task: "waiting" | "queuing" | "generating" | "success" | "fail" */
    state: string;
    /** JSON string chứa { resultUrls: string[] } — chỉ có khi state = "success" */
    resultJson?: string;
    failCode?: string;
    failMsg?: string;
    [key: string]: any;
  };
}

export interface NanoBanana2Options {
  /** URL ảnh gốc đã upload lên cloud storage */
  imageUrl: string;
  /** Prompt mô tả ảnh cần tạo */
  prompt: string;
  /** Tỷ lệ ảnh (mặc định: "auto") */
  aspectRatio?: string;
  /** Định dạng output: "png" | "jpeg" (mặc định: "png") */
  outputFormat?: string;
}

/**
 * Gửi yêu cầu tạo ảnh tới Kie.ai NanoBanana2.
 * Trả về taskId để poll kết quả sau.
 */
async function createTask(apiKey: string, options: NanoBanana2Options): Promise<string> {
  const response = await axios.post<CreateTaskResponse>(
    `${KIE_BASE_URL}/createTask`,
    {
      model: "google/nano-banana-edit",
      input: {
        prompt: options.prompt,
        image_urls: [options.imageUrl],
        image_size: options.aspectRatio || "auto",
        // output_format: (options.outputFormat || "jpeg").toLowerCase(), // Normalize: "JPG" → "jpg"
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  if (response.data.code !== 200) {
    throw new Error(`Kie.ai createTask failed: ${response.data.msg}`);
  }

  return response.data.data.taskId;
}

/**
 * Poll GET /getTaskDetails cho đến khi task hoàn thành hoặc timeout.
 * Trả về URL ảnh AI đã tạo.
 */
async function pollTaskResult(apiKey: string, taskId: string): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < POLL_TIMEOUT) {
    const response = await axios.get<TaskDetailResponse>(
      `${KIE_BASE_URL}/recordInfo`,
      {
        params: { taskId },
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    const { state, resultJson, failMsg } = response.data.data;

    if (state === "success") {
      // resultJson là JSON string: '{"resultUrls":["https://..."]}'
      const result = JSON.parse(resultJson || "{}");
      const imageUrl = result?.resultUrls?.[0];
      if (!imageUrl) throw new Error("Kie.ai trả về success nhưng không có resultUrls.");
      return imageUrl;
    }

    if (state === "fail") {
      throw new Error(`Kie.ai task thất bại: ${failMsg || "không rõ nguyên nhân"}`);
    }

    // state: "waiting" | "queuing" | "generating" → chờ rồi poll lại
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error(`Kie.ai task timeout sau ${POLL_TIMEOUT / 1000}s (taskId: ${taskId})`);
}

/**
 * Hàm chính — tạo ảnh AI từ ảnh gốc và prompt.
 *
 * @returns URL ảnh AI từ Kie.ai (tạm thời, cần download và lưu lên cloud)
 */
export async function generateImage(apiKey: string, options: NanoBanana2Options): Promise<string> {
  const taskId = await createTask(apiKey, options);
  const aiImageUrl = await pollTaskResult(apiKey, taskId);
  return aiImageUrl;
}
