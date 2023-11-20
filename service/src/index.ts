import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
// const { createProxyMiddleware } = require('http-proxy-middleware');
//import {createProxyMiddleware} from "http-proxy-middleware"
import  proxy from "express-http-proxy"
import bodyParser  from 'body-parser';


const app = express()
const router = express.Router()

app.use(express.static('public'))
//app.use(express.json())
app.use(bodyParser.json({ limit: '10mb' })); //大文件传输

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
// const apiProxy = createProxyMiddleware( {
  
//   target:  process.env.MJ_SERVER, //MJ_SERVER
//   changeOrigin: true,
//   secure: false,
//   pathRewrite: {
//     '^/mjapi': '' // 将URL中的 `/` 替换为空字符串
//   },
//   headers: {
//     // 添加自定义请求头
//     'mj-api-secret': process.env.MJ_API_SECRET
//     , 'Content-Type': 'application/json'
//   },
//   onProxyReq:(proxyReq, req, res)=>{
//      //console.log(`Proxying ${req.method} request from ${req.originalUrl} to ${proxyReq.path}`);
//      console.log(   req.body);
//   }
// });
// app.use('/mjapi', apiProxy); 

app.use('/mjapi', proxy(process.env.MJ_SERVER, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/mjapi', '') // 将URL中的 `/mjapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers['mj-api-secret'] = process.env.MJ_API_SECRET;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    return proxyReqOpts;
  },
  //limit: '10mb'
  
}));


app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
