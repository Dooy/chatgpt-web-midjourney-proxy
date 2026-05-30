import { gptServerStore } from "@/store";
import { mlog, myTrim, gptUploadFile } from "./mjapi";

export interface SeedreamPayload {
  model: string;
  prompt: string;
  size?: string;
  response_format?: string;
  image?: string[] | string;
  n?: number;
  seed?: number;
  watermark?: boolean;
  sequential_image_generation?: string;
  max_images?: number;
}

export interface SeedreamEditsPayload {
  model: string;
  image: File;
  mask?: File;
  prompt: string;
  n?: number;
  size?: string;
  response_format?: string;
}

export interface SeedreamChatMessage {
  role: string;
  content: Array<{
    type: "text" | "image_url";
    text?: string;
    image_url?: { url: string };
  }>;
}

export interface SeedreamChatPayload {
  model: string;
  messages: SeedreamChatMessage[];
}

const DEFAULT_BASE = "https://ark.cn-beijing.volces.com/api/v3";
const MODELS_CACHE_KEY = "seedream_models_cache";
const MODELS_CACHE_TTL = 10 * 60 * 1000; // 10 分钟

const getSeedreamBase = () => {
  const base =
    myTrim(myTrim((gptServerStore.myData.DOUBAO_SERVER ?? "").trim(), "/"), "\\") ||
    DEFAULT_BASE;
  return base;
};

const getSeedreamUrl = (url: string) => {
  if (url.startsWith("http")) return url;
  return `${getSeedreamBase()}${url}`;
};

const getSeedreamHeaders = () => {
  const key = gptServerStore.myData.DOUBAO_KEY;
  if (!key) throw new Error("doubao key 为空，请先在设置中配置");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
};

export const seedreamFetch = async (url: string, data: any) => {
  const opt: RequestInit = {
    method: "POST",
    headers: getSeedreamHeaders(),
    body: JSON.stringify(data),
  };
  const res = await fetch(getSeedreamUrl(url), opt);
  const text = await res.text();
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch (error) {
    mlog("seedream json parse error", text);
  }
  if (!res.ok) {
    throw {
      error: json?.error ?? "response_fail",
      status: res.status,
      data: json,
    };
  }
  return json;
};

export const seedreamListModels = async () => {
  const cacheRaw = localStorage.getItem(MODELS_CACHE_KEY);
  if (cacheRaw) {
    try {
      const cache = JSON.parse(cacheRaw);
      if (Date.now() - cache.ts < MODELS_CACHE_TTL && Array.isArray(cache.data)) {
        return cache.data as string[];
      }
    } catch (error) {
      // ignore cache parse error
    }
  }

  const res = await fetch(getSeedreamUrl("/models"), {
    method: "GET",
    headers: getSeedreamHeaders(),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error?.message || body?.message || "加载 Seedream 模型失败");
  }
  const list: string[] = body?.data?.map?.((item: any) => item.id || item.model).filter(Boolean) ?? [];
  localStorage.setItem(MODELS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: list }));
  return list;
};

export const seedreamGenerate = async (payload: SeedreamPayload) => {
  const body: any = {
    model: payload.model,
    prompt: payload.prompt,
    size: payload.size || "2K",
    response_format: payload.response_format || "url",
  };

  if (payload.image) {
    if (Array.isArray(payload.image) && payload.image.length > 0) {
      body.image = payload.image.length === 1 ? payload.image[0] : payload.image;
    } else if (typeof payload.image === "string") {
      body.image = payload.image;
    }
  }

  if (payload.n !== undefined) {
    body.n = payload.n;
  }

  if (payload.seed !== undefined) {
    body.seed = payload.seed;
  }

  // 第三方 API 兼容：这些参数直接放在请求体顶层，而非 extra_body
  if (payload.watermark !== undefined) {
    body.watermark = payload.watermark;
  }

  if (payload.sequential_image_generation) {
    body.sequential_image_generation = payload.sequential_image_generation;
  }

  if (payload.max_images && payload.max_images > 0) {
    body.sequential_image_generation_options = {
      max_images: payload.max_images,
    };
  }

  return seedreamFetch("/images/generations", body);
};

export const seedreamEdits = async (payload: SeedreamEditsPayload) => {
  const formData = new FormData();
  formData.append("model", payload.model);
  formData.append("image", payload.image);
  if (payload.mask) {
    formData.append("mask", payload.mask);
  }
  formData.append("prompt", payload.prompt);
  if (payload.n !== undefined) {
    formData.append("n", String(payload.n));
  }
  if (payload.size) {
    formData.append("size", payload.size);
  }
  if (payload.response_format) {
    formData.append("response_format", payload.response_format);
  }

  const headers = getSeedreamHeaders();
  delete headers["Content-Type"];

  const res = await fetch(getSeedreamUrl("/v1/images/edits"), {
    method: "POST",
    headers,
    body: formData,
  });

  const text = await res.text();
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch (error) {
    mlog("seedream edits json parse error", text);
  }
  if (!res.ok) {
    throw {
      error: json?.error ?? "response_fail",
      status: res.status,
      data: json,
    };
  }
  return json;
};

export const seedreamChatEdit = async (payload: SeedreamChatPayload) => {
  const body = {
    model: payload.model,
    messages: payload.messages,
  };

  const res = await fetch(getSeedreamUrl("/v1/chat/completions"), {
    method: "POST",
    headers: {
      ...getSeedreamHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch (error) {
    mlog("seedream chat json parse error", text);
  }
  if (!res.ok) {
    throw {
      error: json?.error ?? "response_fail",
      status: res.status,
      data: json,
    };
  }
  return json;
};
