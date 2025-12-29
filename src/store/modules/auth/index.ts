import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store/helper'
import { fetchSession } from '@/api'
import { gptConfigStore, homeStore } from '@/store/homeStore'
import { useAppStore } from '@/store'
const appStore = useAppStore()
interface SessionResponse {
  theme?: string
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
  OPENAI_API_BASE_URL?: string
  MJ_SERVER?: string
  userAvatar?: string
  siteTitle?: string
}

export interface AuthState {
  token: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }

        // 调试日志（生产环境可以删除）
        console.log('[Session] 收到服务器配置:', {
          OPENAI_API_BASE_URL: data.OPENAI_API_BASE_URL,
          MJ_SERVER: data.MJ_SERVER,
          userAvatar: data.userAvatar,
          siteTitle: data.siteTitle,
          hasUrl: !!data.OPENAI_API_BASE_URL,
          hasMj: !!data.MJ_SERVER,
          hasAvatar: !!data.userAvatar,
          hasTitle: !!data.siteTitle
        })

        homeStore.setMyData({session: data });

        if (data.siteTitle) {
          console.log('[Session] 设置网站标题:', data.siteTitle)
          document.title = data.siteTitle
        } else {
          console.log('[Session] 未配置 SITE_TITLE，使用默认标题')
        }

        if (data.userAvatar) {
          const userStore = (await import('@/store/modules/user')).useUserStore()
          const currentAvatar = userStore.userInfo.avatar
          const defaultAvatar = 'https://raw.githubusercontent.com/Dooy/chatgpt-web-midjourney-proxy/main/src/assets/avatar.jpg'
          if (!currentAvatar || currentAvatar === defaultAvatar) {
            console.log('[Session] 设置用户头像:', data.userAvatar)
            userStore.updateUserInfo({ avatar: data.userAvatar })
          } else {
            console.log('[Session] 用户已有自定义头像，跳过应用环境变量头像')
          }
        } else {
          console.log('[Session] 未配置 USER_AVATAR，使用默认头像')
        }

        if(appStore.$state.theme=='auto' ){
            appStore.setTheme(  data.theme && data.theme=='light' ?'light':'dark')
        }

        let str = localStorage.getItem('gptConfigStore');
        if( ! str ) setTimeout( ()=>  gptConfigStore.setInit() , 500);

        // 智能初始化：从环境变量或 localStorage 中选择
        const serverStoreStr = localStorage.getItem('gptServerStore');
        console.log('[Session] localStorage 配置:', serverStoreStr)

        const gptServerStore = (await import('@/store/homeStore')).gptServerStore;

        // 检查是否需要从环境变量初始化
        const needInitFromEnv = (data.OPENAI_API_BASE_URL && !gptServerStore.myData.OPENAI_API_BASE_URL) ||
                                  (data.MJ_SERVER && !gptServerStore.myData.MJ_SERVER);

        if(needInitFromEnv){
          const updates: any = {};
          if(data.OPENAI_API_BASE_URL && !gptServerStore.myData.OPENAI_API_BASE_URL){
            console.log('[Session] 从环境变量设置 OPENAI_API_BASE_URL:', data.OPENAI_API_BASE_URL)
            updates.OPENAI_API_BASE_URL = data.OPENAI_API_BASE_URL;
          }
          if(data.MJ_SERVER && !gptServerStore.myData.MJ_SERVER){
            console.log('[Session] 从环境变量设置 MJ_SERVER:', data.MJ_SERVER)
            updates.MJ_SERVER = data.MJ_SERVER;
          }
          // 只在有更新时才保存
          if(Object.keys(updates).length > 0){
            gptServerStore.setMyData(updates);
          }
        } else {
          console.log('[Session] 使用现有配置，跳过环境变量初始化')
        }

        return Promise.resolve(data)
      }
      catch (error) {
        console.error('[Session] 获取配置失败:', error)
        return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
