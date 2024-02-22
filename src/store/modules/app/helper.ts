import { homeStore } from '@/store/homeStore'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'zh-CN' | 'zh-TW' | 'en-US' | 'ko-KR' | 'ru-RU' | 'vi-VN' | 'fr-FR' | 'tr-TR'

export interface AppState {
  siderCollapsed: boolean
  theme: Theme
  language: Language
}

export function defaultSetting(): AppState {
  return { siderCollapsed: false, theme: homeStore.myData.session.theme=='light'?'light': 'auto', language: 'zh-CN' }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
