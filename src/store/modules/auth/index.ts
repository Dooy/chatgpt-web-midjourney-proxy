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
          hasUrl: !!data.OPENAI_API_BASE_URL,
          hasMj: !!data.MJ_SERVER
        })

        homeStore.setMyData({session: data });
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
