import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString,formattedDate } from './utils/is'
import multer from "multer"
import path from "path"
import fs from "fs" 
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
    const isUpload= isNotEmptyString(  process.env.API_UPLOADER )
    const isHideServer= isNotEmptyString(  process.env.HIDE_SERVER )
    res.send({ status: 'Success', message: '', data: {isHideServer,isUpload, auth: hasAuth, model: currentModel() } })
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

 const API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'

app.use('/mjapi', proxy(process.env.MJ_SERVER?process.env.MJ_SERVER:'https://api.openai.com', {
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



// 设置存储引擎和文件保存路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolderPath=`./uploads/${formattedDate()}/`;//`

    console.log('dir', __dirname   ) ;

    if(!fs.existsSync('./uploads/')) {
      fs.mkdirSync('./uploads/');
    }
    if(!fs.existsSync(uploadFolderPath)) {
      fs.mkdirSync(uploadFolderPath);
    }
    cb(null, `uploads/${formattedDate()}/`); 
  },
  filename: function (req, file, cb) {
    let filename=  Date.now() + path.extname(file.originalname);
    console.log( 'file',  filename );
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });
// 处理文件上传的路由
const isUpload= isNotEmptyString(  process.env.API_UPLOADER )
if(isUpload){
  app.use('/openapi/v1/upload', upload.single('file'), (req, res) => {
    //res.send('文件上传成功！');
    res.setHeader('Content-type', 'application/json' ); 
    if(req.file.filename) res.json({ url:`/uploads/${formattedDate()}/${ req.file.filename  }`,created:Date.now() })
    else res.json({ error:`uploader fail`,created:Date.now() })
  });
}else {
  app.use('/openapi/v1/upload',  (req, res) => {
    //res.send('文件上传成功！');
     res.json({ error:`server is no open uploader `,created:Date.now() })
  });
}
app.use('/uploads', express.static('uploads'));


//代理openai 接口
app.use('/openapi', proxy(API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/openapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers['Authorization'] ='Bearer '+ process.env.OPENAI_API_KEY;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    return proxyReqOpts;
  },
  //limit: '10mb' 
}));


app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
