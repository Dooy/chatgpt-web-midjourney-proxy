// WebDAV 同步工具
interface WebDAVConfig {
  url: string
  username: string
  password: string
}

const WEBDAV_CONFIG_KEY = 'webdav_config'
const WEBDAV_FILE_NAME = 'chatgpt-backup.json'

export function getWebDAVConfig(): WebDAVConfig | null {
  const config = localStorage.getItem(WEBDAV_CONFIG_KEY)
  return config ? JSON.parse(config) : null
}

export function saveWebDAVConfig(config: WebDAVConfig): void {
  localStorage.setItem(WEBDAV_CONFIG_KEY, JSON.stringify(config))
}

async function webdavRequest(config: WebDAVConfig, method: string, data?: string) {
  const url = `${config.url.replace(/\/$/, '')}/${WEBDAV_FILE_NAME}`
  const res = await fetch('/api/webdav-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, method, username: config.username, password: config.password, data }),
  })
  const result = await res.json()
  if (!result.success)
    throw new Error(result.error || '请求失败')
  return result
}

export async function syncToWebDAV(): Promise<void> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV 未配置')
  
  const data = localStorage.getItem('chatStorage') || '{}'
  
  // 尝试上传，如果失败尝试创建目录再上传
  try {
    await webdavRequest(config, 'PUT', data)
  }
  catch (error: any) {
    if (error.message.includes('409')) {
      await fetch('/api/webdav-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: config.url.replace(/\/$/, ''),
          method: 'MKCOL',
          username: config.username,
          password: config.password,
        }),
      })
      await webdavRequest(config, 'PUT', data)
    }
    else {
      throw error
    }
  }
}

export async function syncFromWebDAV(): Promise<void> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV 未配置')
  
  const result = await webdavRequest(config, 'GET')
  try {
    localStorage.setItem('chatStorage', result.data || '{}')
  }
  catch {
    throw new Error('浏览器存储限制，请使用Chrome/Edge或手动导入文件')
  }}

