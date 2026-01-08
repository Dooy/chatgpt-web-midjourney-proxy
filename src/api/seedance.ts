import { gptServerStore, homeStore } from "@/store";
import { mlog, myTrim } from "./mjapi";

export interface SeedanceCreatePayload {
  model: string;
  prompt: string;
  reference_image?: string;
  resolution?: string;
  ratio?: string;
  duration?: number;
  fps?: number;
  seed?: number;
  camerafixed?: boolean;
  watermark?: boolean;
  return_last_frame?: boolean;
  first_frame?: string;
  last_frame?: string;
}

interface SeedanceTaskResp {
  id: string;
  status?: string;
  content?: {
    video_url?: string;
  };
  output?: {
    video_url?: string;
  };
}

const DEFAULT_BASE = "https://ark.cn-beijing.volces.com/api/v3";
const MODELS_CACHE_KEY = "seedance_models_cache";
const MODELS_CACHE_TTL = 10 * 60 * 1000; // 10 分钟

const getSeedanceBase = () => {
  const base =
    myTrim(myTrim((gptServerStore.myData.DOUBAO_SERVER ?? "").trim(), "/"), "\\") ||
    DEFAULT_BASE;
  return base;
};

const getSeedanceHeaders = () => {
  const key = gptServerStore.myData.DOUBAO_KEY;
  if (!key) throw new Error("doubao key 为空，请先在设置中配置");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
};

const handleError = async (res: Response) => {
  let body: any;
  try {
    body = await res.json();
  } catch (error) {
    body = await res.text();
  }
  const msg = body?.error?.message || body?.message || `Seedance 请求失败(${res.status})`;
  homeStore.myData.ms && homeStore.myData.ms.error(msg);
  throw new Error(msg);
};

const normalizeUrl = (url: string) => {
  if (url.startsWith("http")) return url;
  return `${getSeedanceBase()}${url}`;
};

export const seedanceListModels = async () => {
  const cacheRaw = localStorage.getItem(MODELS_CACHE_KEY);
  if (cacheRaw) {
    try {
      const cache = JSON.parse(cacheRaw);
      if (Date.now() - cache.ts < MODELS_CACHE_TTL && Array.isArray(cache.data)) {
        return cache.data as string[];
      }
    } catch (error) {
      // ignore
    }
  }

  const res = await fetch(normalizeUrl("/models"), {
    method: "GET",
    headers: getSeedanceHeaders(),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error?.message || body?.message || "加载 Seedance 模型失败");
  }
  const list: string[] = body?.data?.map?.((item: any) => item.id || item.model).filter(Boolean) ?? [];
  localStorage.setItem(MODELS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: list }));
  return list;
};

export const seedanceCreateTask = async (payload: SeedanceCreatePayload) => {
  const args: string[] = [];
  if (payload.resolution) args.push(`--resolution ${payload.resolution}`);
  if (payload.ratio) args.push(`--ratio ${payload.ratio}`);
  if (payload.duration) args.push(`--duration ${payload.duration}`);
  if (payload.fps) args.push(`--fps ${payload.fps}`);
  if (payload.seed !== undefined) args.push(`--seed ${payload.seed}`);
  if (payload.camerafixed !== undefined)
    args.push(`--camerafixed ${payload.camerafixed}`);
  if (payload.watermark !== undefined)
    args.push(`--watermark ${payload.watermark}`);
  if (payload.return_last_frame !== undefined)
    args.push(`--return_last_frame ${payload.return_last_frame}`);

  const text = `${payload.prompt.trim()} ${args.join(" ")}`.trim();
  const content: any[] = [{ type: "text", text }];

  if (payload.reference_image) {
    content.push({
      type: "image_url",
      image_url: { url: payload.reference_image },
    });
  }

  // 第三方 API 兼容：不使用 role 字段，first_frame 放在首帧位置
  if (payload.first_frame) {
    content.push({
      type: "image_url",
      image_url: { url: payload.first_frame },
    });
  }
  if (payload.last_frame) {
    content.push({
      type: "image_url",
      image_url: { url: payload.last_frame },
    });
  }

  const body = {
    model: payload.model,
    content,
  };

  // 第三方 API 兼容：使用 /seedance/v3 前缀路径
  const res = await fetch(normalizeUrl("/seedance/v3/contents/generations/tasks"), {
    method: "POST",
    headers: getSeedanceHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) await handleError(res);
  const data = (await res.json()) as SeedanceTaskResp;
  return data;
};

export const seedanceGetTask = async (taskId: string) => {
  // 第三方 API 兼容：使用 /seedance/v3 前缀路径
  const res = await fetch(
    normalizeUrl(`/seedance/v3/contents/generations/tasks/${taskId}`),
    {
      method: "GET",
      headers: getSeedanceHeaders(),
    },
  );
  if (!res.ok) await handleError(res);
  return (await res.json()) as SeedanceTaskResp;
};
