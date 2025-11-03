// WebDAV 同步工具
interface WebDAVConfig {
  url: string
  username: string
  password: string
}

const WEBDAV_CONFIG_KEY = 'webdav_config'
const WEBDAV_FILE_NAME = 'chatgpt-backup.json'
const WEBDAV_SYNC_TIME_KEY = 'webdav_last_sync_time'

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

// 比较本地和远程数据，返回最新的数据
function mergeData(localData: string, remoteData: string): { data: string; source: 'local' | 'remote' | 'same' } {
  try {
    const local = JSON.parse(localData)
    const remote = JSON.parse(remoteData)
    
    // 比较聊天记录数量和最后修改时间
    const localHistoryCount = local.history?.length || 0
    const remoteHistoryCount = remote.history?.length || 0
    
    const localChatCount = local.chat?.reduce((sum: number, c: any) => sum + (c.data?.length || 0), 0) || 0
    const remoteChatCount = remote.chat?.reduce((sum: number, c: any) => sum + (c.data?.length || 0), 0) || 0
    
    // 如果本地有更多数据，使用本地
    if (localHistoryCount > remoteHistoryCount || localChatCount > remoteChatCount) {
      return { data: localData, source: 'local' }
    }
    
    // 如果远程有更多数据，使用远程
    if (remoteHistoryCount > localHistoryCount || remoteChatCount > localChatCount) {
      return { data: remoteData, source: 'remote' }
    }
    
    // 数据量相同，比较内容
    if (localData === remoteData) {
      return { data: localData, source: 'same' }
    }
    
    // 数据量相同但内容不同，使用本地（偏向保留最新修改）
    return { data: localData, source: 'local' }
  }
  catch (error) {
    // JSON 解析失败，使用本地数据
    return { data: localData, source: 'local' }
  }
}

// 智能同步（比较本地和远程，使用最新的数据）
export async function syncWithWebDAV(): Promise<{ uploaded: boolean; downloaded: boolean; message: string }> {
  const config = getWebDAVConfig()
  if (!config)
    throw new Error('WebDAV 未配置')
  
  const localData = localStorage.getItem('chatStorage') || '{}'
  let downloaded = false
  let uploaded = false
  let message = ''
  
  try {
    // 尝试下载远程数据
    const remoteData = await downloadFromWebDAV(config)
    
    // 比较并决定使用哪个数据
    const { data: finalData, source } = mergeData(localData, remoteData)
    
    if (source === 'remote') {
      // 远程数据更新，下载到本地
      localStorage.setItem('chatStorage', remoteData)
      downloaded = true
      message = '已从云端下载最新数据'
    }
    else if (source === 'local') {
      // 本地数据更新，上传到云端
      await uploadToWebDAV(config, localData)
      uploaded = true
      message = '已上传本地数据到云端'
    }
    else {
      // 数据相同，无需同步
      message = '本地和云端数据已同步，无需更新'
    }
    
    // 记录同步时间
    localStorage.setItem(WEBDAV_SYNC_TIME_KEY, new Date().toISOString())
  }
  catch (error: any) {
    // 如果远程文件不存在（首次同步），上传本地数据
    if (error.message.includes('404') || error.message.includes('不存在')) {
      await uploadToWebDAV(config, localData)
      uploaded = true
      message = '首次同步：已上传本地数据到云端'
      localStorage.setItem(WEBDAV_SYNC_TIME_KEY, new Date().toISOString())
    }
    else {
      throw error
    }
  }
  
  return { uploaded, downloaded, message }
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
