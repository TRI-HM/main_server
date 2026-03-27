import axios from "axios";

const PIAPI_TASK_URL = "https://api.piapi.ai/api/v1/task";

function getPiapiKey(): string {
  const key = process.env.PIAPI_API_KEY?.trim() || process.env.PIAPI_KEY?.trim();
  if (!key) {
    throw new Error("PIAPI_API_KEY (or PIAPI_KEY) is not configured");
  }
  return key;
}

type PiapiTaskPayload = {
  code: number;
  message?: string;
  data?: {
    task_id: string;
    status: string;
    output?: { image_url?: string; image_urls?: string[] };
    error?: { message?: string; code?: number };
  };
};

function normalizeStatus(s: string | undefined): string {
  return (s || "").toLowerCase();
}

async function getTask(taskId: string, apiKey: string): Promise<PiapiTaskPayload["data"]> {
  const res = await axios.get<PiapiTaskPayload>(`${PIAPI_TASK_URL}/${taskId}`, {
    headers: { "X-API-Key": apiKey },
  });
  return res.data?.data;
}

async function pollUntilImageReady(taskId: string, apiKey: string): Promise<string> {
  const maxAttempts = 150;
  const delayMs = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    const data = await getTask(taskId, apiKey);
    const status = normalizeStatus(data?.status);

    if (status === "completed") {
      const url = data?.output?.image_url || data?.output?.image_urls?.[0];
      if (url) {
        return url;
      }
      throw new Error("PiAPI: task completed but no image URL in output");
    }

    if (status === "failed") {
      throw new Error(data?.error?.message || "PiAPI task failed");
    }

    await new Promise((r) => setTimeout(r, delayMs));
  }

  throw new Error("PiAPI: task timeout while waiting for image");
}

/**
 * Flux Kontext (image + prompt → image). Xem https://piapi.ai/docs/flux-api/kontext
 */
export async function runFluxKontext(params: {
  imageUrl: string;
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
}): Promise<string> {
  const apiKey = getPiapiKey();

  const body = {
    model: "Qubico/flux1-dev-advanced",
    task_type: "kontext",
    input: {
      prompt: params.prompt,
      image: params.imageUrl,
      width: params.width ?? 1024,
      height: params.height ?? 1024,
      steps: params.steps ?? 28,
      seed: -1,
    },
  };

  const res = await axios.post<PiapiTaskPayload>(PIAPI_TASK_URL, body, {
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  const payload = res.data;
  if (payload.code !== 200 && payload.code !== 0) {
    throw new Error(payload.message || `PiAPI error code ${payload.code}`);
  }

  const data = payload.data;
  if (!data?.task_id) {
    throw new Error("PiAPI: missing task_id");
  }

  const status = normalizeStatus(data.status);

  if (status === "completed") {
    const url = data.output?.image_url || data.output?.image_urls?.[0];
    if (url) {
      return url;
    }
  }

  if (status === "failed") {
    throw new Error(data.error?.message || "PiAPI task failed");
  }

  return pollUntilImageReady(data.task_id, apiKey);
}

export async function downloadImageAsBuffer(imageUrl: string): Promise<Buffer> {
  const res = await axios.get<ArrayBuffer>(imageUrl, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}
