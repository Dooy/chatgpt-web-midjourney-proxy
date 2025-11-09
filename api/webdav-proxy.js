const https = require('https');
const http = require('http');
const { URL } = require('url');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.writeHead(405).end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const { url, method, username, password, data } = req.body;

    if (!url || !method || !username || !password) {
      return res.writeHead(400).end(JSON.stringify({ error: '缺少必要参数' }));
    }

    // 创建 Basic Auth
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      timeout: 30000
    };

    if (method === 'PUT') {
      options.headers['Content-Type'] = 'application/json';
      if (data) {
        const bodyData = typeof data === 'string' ? data : JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(bodyData);
      }
    }

    if (method === 'PROPFIND') {
      options.headers['Depth'] = '0';
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const proxyReq = protocol.request(options, (proxyRes) => {
      let responseData = '';
      
      proxyRes.on('data', (chunk) => {
        responseData += chunk;
      });

      proxyRes.on('end', () => {
        const statusCode = proxyRes.statusCode;
        const isSuccess = (statusCode >= 200 && statusCode < 300) || statusCode === 207;
        
        let errorMsg = null;
        if (!isSuccess) {
          errorMsg = `HTTP ${statusCode} - ${url}`;
          if (responseData) {
            errorMsg += ` | Response: ${responseData.substring(0, 200)}`;
          }
        }
        
        res.writeHead(200).end(JSON.stringify({
          success: isSuccess,
          status: statusCode,
          data: responseData,
          requestUrl: url,
          error: errorMsg
        }));
      });
    });

    proxyReq.on('error', (error) => {
      console.error('WebDAV proxy error:', error.message);
      res.writeHead(500).end(JSON.stringify({
        success: false,
        error: error.message
      }));
    });

    proxyReq.on('timeout', () => {
      proxyReq.destroy();
      res.writeHead(500).end(JSON.stringify({
        success: false,
        error: '请求超时'
      }));
    });

    if (method === 'PUT' && data) {
      const bodyData = typeof data === 'string' ? data : JSON.stringify(data);
      proxyReq.write(bodyData);
    }

    proxyReq.end();
  } catch (error) {
    console.error('WebDAV proxy error:', error.message);
    res.writeHead(500).end(JSON.stringify({
      success: false,
      error: error.message
    }));
  }
};
