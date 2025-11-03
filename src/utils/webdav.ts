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

// 上传到 WebDAV
async function uploadToWebDAV(config: WebDAVConfig, data: string): Promise<void> {
  const url = `${config.url.replace(/\/$/, '')}/${WEBDAV_FILE_NAME}`
  const auth = btoa(`${config.username}:${config.password}`)
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: data,
  })
  
  if (!response.ok)
    throw new Error(`Upload failed: ${response.statusText}`)
}

// 从 WebDAV 下载
async function downloadFromWebDAV(config: WebDAVConfig): Promise<string> {
  const url = `${config.url.replace(/\/$/, '')}/${WEBDAV_FILE_NAME}`
  const auth = btoa(`${config.username}:${config.password}`)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  })
  
  if (!response.ok)
    throw new Error(`Download failed: ${response.statusText}`)
  
  return await response.text()
}

// 同步到 WebDAV（上传本地数据）
export async function syncToWebDAV(): Promise<void> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV not configured')
  
  const data = localStorage.getItem('chatStorage') || '{}'
  await uploadToWebDAV(config, data)
}

// 从 WebDAV 同步（下载远程数据）
export async function syncFromWebDAV(): Promise<void> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV not configured')
  
  const data = await downloadFromWebDAV(config)
  localStorage.setItem('chatStorage', data)
}
