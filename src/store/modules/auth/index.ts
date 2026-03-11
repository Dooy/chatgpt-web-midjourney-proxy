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
  userName?: string
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
          userName: data.userName,
          siteTitle: data.siteTitle,
          hasUrl: !!data.OPENAI_API_BASE_URL,
          hasMj: !!data.MJ_SERVER,
          hasAvatar: !!data.userAvatar,
          hasName: !!data.userName,
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
          const { ss } = await import('@/utils/storage')
          const hasUserSetting = ss.get('userStorage')

          if (!hasUserSetting || !hasUserSetting.userInfo?.avatar) {
            console.log('[Session] 首次访问，应用环境变量头像:', data.userAvatar)
            userStore.updateUserInfo({ avatar: data.userAvatar })
          } else {
            console.log('[Session] 用户已有头像设置，保持用户选择')
          }
        } else {
          console.log('[Session] 未配置 USER_AVATAR，使用默认头像')
        }

        if (data.userName) {
          const userStore = (await import('@/store/modules/user')).useUserStore()
          const { ss } = await import('@/utils/storage')
          const hasUserSetting = ss.get('userStorage')

          if (!hasUserSetting || !hasUserSetting.userInfo?.name) {
            console.log('[Session] 首次访问，应用环境变量名称:', data.userName)
            userStore.updateUserInfo({ name: data.userName })
          } else {
            console.log('[Session] 用户已有名称设置，保持用户选择')
          }
        } else {
          console.log('[Session] 未配置 USER_NAME，使用默认名称')
        }

        if(appStore.$state.theme=='auto' ){
            if(data.theme === 'light' || data.theme === 'dark') {
              appStore.setTheme(data.theme)
            } else if(data.theme === 'auto') {
              appStore.setTheme('auto')
            } else {
              appStore.setTheme('dark')
            }
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
