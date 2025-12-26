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

        homeStore.setMyData({session: data });
        if(appStore.$state.theme=='auto' ){
            appStore.setTheme(  data.theme && data.theme=='light' ?'light':'dark')
        }

        let str = localStorage.getItem('gptConfigStore');
        if( ! str ) setTimeout( ()=>  gptConfigStore.setInit() , 500);

        // 如果 localStorage 中没有保存服务器配置，从 session 环境变量初始化
        const serverStoreStr = localStorage.getItem('gptServerStore');
        if(!serverStoreStr || serverStoreStr === '{}'){
          const gptServerStore = (await import('@/store/homeStore')).gptServerStore;
          if(data.OPENAI_API_BASE_URL && !gptServerStore.myData.OPENAI_API_BASE_URL){
            gptServerStore.setMyData({ OPENAI_API_BASE_URL: data.OPENAI_API_BASE_URL });
          }
          if(data.MJ_SERVER && !gptServerStore.myData.MJ_SERVER){
            gptServerStore.setMyData({ MJ_SERVER: data.MJ_SERVER });
          }
        }

        return Promise.resolve(data)
      }
      catch (error) {
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
