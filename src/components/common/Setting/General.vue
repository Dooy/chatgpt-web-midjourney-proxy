<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, NPopconfirm, NSelect, useMessage } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import { useAppStore, useUserStore } from '@/store'
import type { UserInfo } from '@/store/modules/user/helper'
import { getCurrentDate } from '@/utils/functions'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { getWebDAVConfig, saveWebDAVConfig, syncWithWebDAV } from '@/utils/webdav'

const appStore = useAppStore()
const userStore = useUserStore()

const { isMobile } = useBasicLayout()

const ms = useMessage()

const theme = computed(() => appStore.theme)

const userInfo = computed(() => userStore.userInfo)

const avatar = ref(userInfo.value.avatar ?? '')

const name = ref(userInfo.value.name ?? '')

const description = ref(userInfo.value.description ?? '')

const backgroundImage = ref(userInfo.value.backgroundImage ?? '')

const webdavUrl = ref('')
const webdavUsername = ref('')
const webdavPassword = ref('')
const showWebDAVConfig = ref(false)

// 加载 WebDAV 配置
const loadedConfig = getWebDAVConfig()
if (loadedConfig) {
  webdavUrl.value = loadedConfig.url
  webdavUsername.value = loadedConfig.username
  webdavPassword.value = loadedConfig.password
}

const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value)
  },
})

const themeOptions: { label: string; key: Theme; icon: string }[] = [
  {
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
]

const languageOptions: { label: string; key: Language; value: Language }[] = [
  { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
  { label: '繁體中文', key: 'zh-TW', value: 'zh-TW' },
  { label: 'English', key: 'en-US', value: 'en-US' },
  { label: '한국어', key: 'ko-KR', value: 'ko-KR' },
  { label: 'Русский язык', key: 'ru-RU', value: 'ru-RU' },
  { label: 'Tiếng Việt', key: 'vi-VN', value: 'vi-VN' },
  { label: 'Français', key: 'fr-FR', value: 'fr-FR' },
  { label: 'Türkçe', key: 'tr-TR', value: 'tr-TR' },
]

function updateUserInfo(options: Partial<UserInfo>) {
  userStore.updateUserInfo(options)
  ms.success(t('common.success'))
}

function handleReset() {
  userStore.resetUserInfo()
  ms.success(t('common.success'))
  window.location.reload()
}

function exportData(): void {
  const date = getCurrentDate()
  const data: string = localStorage.getItem('chatStorage') || '{}'
  const jsonString: string = JSON.stringify(JSON.parse(data), null, 2)
  const blob: Blob = new Blob([jsonString], { type: 'application/json' })
  const url: string = URL.createObjectURL(blob)
  const link: HTMLAnchorElement = document.createElement('a')
  link.href = url
  link.download = `chat-store_${date}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function importData(event: Event): void {
  const target = event.target as HTMLInputElement
  if (!target || !target.files)
    return

  const file: File = target.files[0]
  if (!file)
    return

  const reader: FileReader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)
      localStorage.setItem('chatStorage', JSON.stringify(data))
      ms.success(t('common.success'))
      location.reload()
    }
    catch (error) {
      ms.error(t('common.invalidFileFormat'))
    }
  }
  reader.readAsText(file)
}

function clearData(): void {
  localStorage.removeItem('chatStorage')
  location.reload()
}

function handleImportButtonClick(): void {
  const fileInput = document.getElementById('fileInput2') as HTMLElement
  if (fileInput)   fileInput.click()
}

function saveWebDAV(): void {
  if (!webdavUrl.value || !webdavUsername.value || !webdavPassword.value) {
    ms.error(t('setting.webdavConfigError'))
    return
  }
  saveWebDAVConfig({
    url: webdavUrl.value,
    username: webdavUsername.value,
    password: webdavPassword.value,
  })
  ms.success(t('common.success'))
  showWebDAVConfig.value = false
}

async function testWebDAVConnection(): Promise<void> {
  if (!webdavUrl.value || !webdavUsername.value || !webdavPassword.value) {
    ms.error(t('setting.webdavConfigError'))
    return
  }
  
  const loading = ms.loading('正在测试连接...', { duration: 0 })
  
  try {
    const testConfig = {
      url: webdavUrl.value,
      username: webdavUsername.value,
      password: webdavPassword.value,
    }
    
    const auth = btoa(`${testConfig.username}:${testConfig.password}`)
    const testUrl = testConfig.url.replace(/\/$/, '')
    
    const xhr = new XMLHttpRequest()
    xhr.open('PROPFIND', testUrl, true)
    xhr.setRequestHeader('Authorization', `Basic ${auth}`)
    xhr.setRequestHeader('Depth', '0')
    xhr.timeout = 10000
    
    xhr.onload = () => {
      loading.destroy()
      if (xhr.status >= 200 && xhr.status < 300)
        ms.success('连接成功！配置正确')
      else if (xhr.status === 401)
        ms.error('认证失败，请检查用户名和密码')
      else
        ms.error(`连接失败: ${xhr.status} ${xhr.statusText}`)
    }
    
    xhr.onerror = () => {
      loading.destroy()
      ms.error('连接失败，请检查 WebDAV 地址是否正确，或者尝试使用 HTTPS 地址')
    }
    
    xhr.ontimeout = () => {
      loading.destroy()
      ms.error('连接超时，请检查网络或服务器地址')
    }
    
    xhr.send()
  }
  catch (error: any) {
    loading.destroy()
    ms.error(`测试失败: ${error.message}`)
  }
}

async function handleSync(): Promise<void> {
  const config = getWebDAVConfig()
  if (!config) {
    ms.warning(t('setting.webdavNotConfigured'))
    showWebDAVConfig.value = true
    return
  }
  
  const loading = ms.loading('正在同步中...', { duration: 0 })
  
  try {
    const result = await syncWithWebDAV()
    loading.destroy()
    
    if (result.downloaded && result.uploaded)
      ms.success('同步成功！已更新本地数据')
    else if (result.uploaded)
      ms.success('上传成功！')
    else
      ms.success(t('setting.webdavSyncSuccess'))
    
    if (result.downloaded)
      setTimeout(() => location.reload(), 1000)
  }
  catch (error: any) {
    loading.destroy()
    console.error('WebDAV sync error:', error)
    ms.error(`同步失败: ${error.message}`)
  }
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.avatarLink') }}</span>
        <div class="flex-1">
          <NInput v-model:value="avatar" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ avatar })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.name') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="name" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ name })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.backgroundImage') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="backgroundImage" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ backgroundImage })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.description') }}</span>
        <div class="flex-1">
          <NInput v-model:value="description" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ description })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div
        class="flex items-center space-x-4"
        :class="isMobile && 'items-start'"
      >
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.chatHistory') }}</span>

        <div class="flex flex-wrap items-center gap-4">
          <NButton size="small" @click="exportData">
            <template #icon>
              <SvgIcon icon="ri:download-2-fill" />
            </template>
            {{ $t('common.export') }}
          </NButton>

          <input id="fileInput2" type="file" style="display:none" @change="importData">
          <NButton size="small" @click="handleImportButtonClick">
            <template #icon>
              <SvgIcon icon="ri:upload-2-fill" />
            </template>
            {{ $t('common.import') }}
          </NButton>

          <NButton size="small" type="info" @click="handleSync">
            <template #icon>
              <SvgIcon icon="ri:refresh-line" />
            </template>
            {{ $t('common.sync') }}
          </NButton>

          <NPopconfirm placement="bottom" @positive-click="clearData">
            <template #trigger>
              <NButton size="small">
                <template #icon>
                  <SvgIcon icon="ri:close-circle-line" />
                </template>
                {{ $t('common.clear') }}
              </NButton>
            </template>
            {{ $t('chat.clearHistoryConfirm') }}
          </NPopconfirm>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.theme') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <template v-for="item of themeOptions" :key="item.key">
            <NButton
              size="small"
              :type="item.key === theme ? 'primary' : undefined"
              @click="appStore.setTheme(item.key)"
            >
              <template #icon>
                <SvgIcon :icon="item.icon" />
              </template>
            </NButton>
          </template>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.language') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <NSelect
            style="width: 140px"
            :value="language"
            :options="languageOptions"
            @update-value="value => appStore.setLanguage(value)"
          />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.webdavSync') }}</span>
        <NButton size="small" @click="showWebDAVConfig = !showWebDAVConfig">
          {{ showWebDAVConfig ? $t('common.hide') : $t('setting.webdavConfig') }}
        </NButton>
      </div>
      <div v-if="showWebDAVConfig" class="space-y-4 pl-4 border-l-2">
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.webdavUrl') }}</span>
          <div class="flex-1">
            <NInput v-model:value="webdavUrl" placeholder="https://dav.example.com/remote.php/dav/files/username/" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.webdavUsername') }}</span>
          <div class="flex-1">
            <NInput v-model:value="webdavUsername" placeholder="" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.webdavPassword') }}</span>
          <div class="flex-1">
            <NInput v-model:value="webdavPassword" type="password" placeholder="" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]"></span>
          <NButton size="small" type="primary" @click="saveWebDAV">
            {{ $t('common.save') }}
          </NButton>
          <NButton size="small" @click="testWebDAVConnection">
            {{ $t('setting.webdavTest') }}
          </NButton>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.resetUserInfo') }}</span>
        <NButton size="small" @click="handleReset">
          {{ $t('common.reset') }}
        </NButton>
      </div>
    </div>
  </div>
</template>
