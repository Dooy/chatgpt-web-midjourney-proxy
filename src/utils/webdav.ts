// WebDAV 同步工具
interface WebDAVConfig {
  url: string
  username: string
  password: string
}

const WEBDAV_CONFIG_KEY = 'webdav_config'
const WEBDAV_FILE_NAME = 'chatgpt-backup.json'

// 获取 WebDAV 配置
export function getWebDAVConfig(): WebDAVConfig | null {
  const config = localStorage.getItem(WEBDAV_CONFIG_KEY)
  return config ? JSON.parse(config) : null
}

// 保存 WebDAV 配置
export function saveWebDAVConfig(config: WebDAVConfig): void {
  localStorage.setItem(WEBDAV_CONFIG_KEY, JSON.stringify(config))
}

// 通过后端代理访问 WebDAV
async function webdavRequest(config: WebDAVConfig, method: string, data?: string): Promise<any> {
  const url = `${config.url.replace(/\/$/, '')}/${WEBDAV_FILE_NAME}`
  
  const response = await fetch('/api/webdav-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      method,
      username: config.username,
      password: config.password,
      data,
    }),
  })
  
  const result = await response.json()
  
  if (!result.success)
    throw new Error(result.error || '请求失败')
  
  return result
}

// 上传到 WebDAV
async function uploadToWebDAV(config: WebDAVConfig, data: string): Promise<void> {
  await webdavRequest(config, 'PUT', data)
}

// 从 WebDAV 下载
async function downloadFromWebDAV(config: WebDAVConfig): Promise<string> {
  try {
    const result = await webdavRequest(config, 'GET')
    return result.data || '{}'
  }
  catch (error: any) {
    if (error.message.includes('404') || error.message.includes('Not Found'))
      throw new Error('远程文件不存在，将仅上传本地数据')
    throw error
  }
}

// 双向同步（先下载远程，合并后上传）
export async function syncWithWebDAV(): Promise<{ uploaded: boolean; downloaded: boolean }> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV 未配置')
  
  const localData = localStorage.getItem('chatStorage') || '{}'
  let downloaded = false
  let uploaded = false
  
  try {
    // 尝试下载远程数据
    const remoteData = await downloadFromWebDAV(config)
    if (remoteData && remoteData !== localData) {
      // 简单策略：使用远程数据（如果需要合并逻辑，可以在这里添加）
      localStorage.setItem('chatStorage', remoteData)
      downloaded = true
    }
  }
  catch (error: any) {
    // 如果远程文件不存在（404），不算错误，继续上传
    if (!error.message.includes('404') && !error.message.includes('不存在')) {
      throw error
    }
  }
  
  // 上传本地数据
  await uploadToWebDAV(config, localStorage.getItem('chatStorage') || '{}')
  uploaded = true
  
  return { uploaded, downloaded }
}

// 仅上传到 WebDAV
export async function syncToWebDAV(): Promise<void> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV 未配置')
  
  const data = localStorage.getItem('chatStorage') || '{}'
  await uploadToWebDAV(config, data)
}

// 仅从 WebDAV 下载
export async function syncFromWebDAV(): Promise<void> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV 未配置')
  
  const data = await downloadFromWebDAV(config)
  localStorage.setItem('chatStorage', data)
}
