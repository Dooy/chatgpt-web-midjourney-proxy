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
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Authorization', `Basic ${auth}`)
    xhr.setRequestHeader('Content-Type', 'application/json')
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300)
        resolve()
      else
        reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`))
    }
    
    xhr.onerror = () => reject(new Error('网络错误，请检查 WebDAV 地址是否正确'))
    xhr.ontimeout = () => reject(new Error('请求超时'))
    
    xhr.timeout = 30000 // 30秒超时
    xhr.send(data)
  })
}

// 从 WebDAV 下载
async function downloadFromWebDAV(config: WebDAVConfig): Promise<string> {
  const url = `${config.url.replace(/\/$/, '')}/${WEBDAV_FILE_NAME}`
  const auth = btoa(`${config.username}:${config.password}`)
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', `Basic ${auth}`)
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300)
        resolve(xhr.responseText)
      else if (xhr.status === 404)
        reject(new Error('远程文件不存在，将仅上传本地数据'))
      else
        reject(new Error(`下载失败: ${xhr.status} ${xhr.statusText}`))
    }
    
    xhr.onerror = () => reject(new Error('网络错误，请检查 WebDAV 地址、用户名和密码是否正确'))
    xhr.ontimeout = () => reject(new Error('请求超时'))
    
    xhr.timeout = 30000 // 30秒超时
    xhr.send()
  })
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
