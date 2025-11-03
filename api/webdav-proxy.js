const axios = require('axios');

module.exports = async (req, res) => {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, method, username, password, data } = req.body;

    if (!url || !method || !username || !password) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 创建 Basic Auth
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${auth}`,
    };

    if (method === 'PUT') {
      headers['Content-Type'] = 'application/json';
    }

    if (method === 'PROPFIND') {
      headers['Depth'] = '0';
    }

    const axiosConfig = {
      method: method,
      url: url,
      headers: headers,
      timeout: 30000,
    };

    if (method === 'PUT' && data) {
      axiosConfig.data = data;
    }

    const response = await axios(axiosConfig);
    
    res.status(200).json({
      success: true,
      status: response.status,
      data: response.data
    });
  } catch (error) {
    console.error('WebDAV proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      status: error.response?.status
    });
  }
};
