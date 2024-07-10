import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { homeStore, useAuthStore, useSettingStore } from '@/store'


export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  if (homeStore.myData.isClient)
  return {"status":"Success","message":"","data":{"isHideServer":false,"isUpload":false,"auth":false,"model":"ChatGPTAPI","amodel":"gpt-4","isApiGallery":false,"cmodels":"","baiduId":"9d5fa7fc2f5fd585aa8fd3010d19be1e","googleId":"","notify":"","disableGpt4":"","isWsrv":"","uploadImgSize":"1","gptUrl":"","theme":"dark","isCloseMdPreview":false}}
  
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export * from "./mjapi"
export * from "./mjsave"
export * from "./openapi"
export * from "./units"
export * from "./mic"
export * from "./chat"
export * from "./sse/fetchsse"
export * from "./Recognition"
export * from "./luma"
