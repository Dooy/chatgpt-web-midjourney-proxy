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
   const userLang = navigator.language || navigator.userLanguage;
    let content:Language= 'en-US';
    if (userLang.startsWith('zh-HK') || userLang.startsWith('zh-TW')) {
        content =  'zh-TW'; // 繁体中文
    } else if (userLang.startsWith('zh')) {
        content = 'zh-CN'; // 简体中文
    } else if (userLang.startsWith('fr')) {
        content = 'fr-FR'; // 法语
    } else if (userLang.startsWith('ko')) {
        content = 'ko-KR'; // 韩语
    } else if (userLang.startsWith('ru')) {
        content = 'ru-RU'; // 俄文
    } else if (userLang.startsWith('vi')) {
        content = 'vi-VN'; // 越南语
    } else if (userLang.startsWith('tr')) {
        content = 'tr-TR'; // 土耳其语
    } else {
        content = 'en-US'; // 英语
    }
  return { siderCollapsed: false, theme: homeStore.myData.session.theme=='light'?'light': 'auto', language:  content }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
