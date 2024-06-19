import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth, authV2, mlog, regCookie, turnstileCheck, verify } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString,formattedDate } from './utils/is'
import multer from "multer"
import path from "path"
import fs from "fs"
import pkg from '../package.json'
// const { createProxyMiddleware } = require('http-proxy-middleware');
//import {createProxyMiddleware} from "http-proxy-middleware"
import  proxy from "express-http-proxy"
import bodyParser  from 'body-parser';
import FormData  from 'form-data'
import axios from 'axios';
import AWS  from 'aws-sdk';
import { v4 as uuidv4} from 'uuid';


const app = express()
const router = express.Router()

app.use(express.static('public' ,{
  // 设置响应头，允许带有查询参数的请求访问静态文件
  setHeaders: (res, path, stat) => {
    res.set('Cache-Control', 'public, max-age=1');
  }
} ))
//app.use(express.json())
app.use(bodyParser.json({ limit: '10mb' })); //大文件传输



app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process',authV2 , async (req, res) => { //[authV2, limiter]
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
    const isHideServer= isNotEmptyString(  process.env.HIDE_SERVER );
    const amodel=   process.env.OPENAI_API_MODEL?? "gpt-3.5-turbo" ;
    const isApiGallery=  isNotEmptyString(  process.env.MJ_API_GALLERY );
    const cmodels =   process.env.CUSTOM_MODELS??'' ;
    const baiduId=process.env.TJ_BAIDU_ID?? "" ;
    const googleId=process.env.TJ_GOOGLE_ID?? "" ;
    const notify = process.env.SYS_NOTIFY?? "" ;
    const disableGpt4 = process.env.DISABLE_GPT4?? "" ;
    const isUploadR2 = isNotEmptyString(process.env.R2_DOMAIN);
    const isWsrv =  process.env.MJ_IMG_WSRV?? "" 
    const uploadImgSize =  process.env.UPLOAD_IMG_SIZE?? "1" 
    const gptUrl = process.env.GPT_URL?? ""; 
    const theme = process.env.SYS_THEME?? "dark"; 
    const isCloseMdPreview = process.env.CLOSE_MD_PREVIEW?true:false
    const uploadType= process.env.UPLOAD_TYPE
    const turnstile= process.env.TURNSTILE_SITE
    const menuDisable= process.env.MENU_DISABLE??""
    const visionModel= process.env.VISION_MODEL??""
    const systemMessage= process.env.SYSTEM_MESSAGE??""
    const customVisionModel= process.env.CUSTOM_VISION_MODELS??""

    const data= { disableGpt4,isWsrv,uploadImgSize,theme,isCloseMdPreview,uploadType,
      notify , baiduId, googleId,isHideServer,isUpload, auth: hasAuth
      , model: currentModel(),amodel,isApiGallery,cmodels,isUploadR2,gptUrl
      ,turnstile,menuDisable,visionModel,systemMessage,customVisionModel
    }
    res.send({  status: 'Success', message: '', data})
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', verify)
router.get('/reg', regCookie )

 const API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'

app.use('/mjapi',authV2 , proxy(process.env.MJ_SERVER?process.env.MJ_SERVER:'https://api.openai.com', {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/mjapi', '') // 将URL中的 `/mjapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    if(  process.env.MJ_API_SECRET ) proxyReqOpts.headers['mj-api-secret'] = process.env.MJ_API_SECRET;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  //limit: '10mb'

}));



// 设置存储引擎和文件保存路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolderPath=`./uploads/${formattedDate()}/`;//`

    //console.log('dir', __dirname   ) ;

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

const storage2 = multer.memoryStorage();
const upload2 = multer({ storage: storage2 });

// 处理文件上传的路由
const isUpload= isNotEmptyString(  process.env.API_UPLOADER )
if(isUpload){
  if( process.env.FILE_SERVER){
    app.use('/openapi/v1/upload',
    upload2.single('file'),
      async (req, res, next) => {
        //console.log( "boday",req.body ,  req.body.model );
        if(req.file.buffer) {
          const fileBuffer = req.file.buffer;
          const formData = new FormData();
          formData.append('file',  fileBuffer,  { filename:  req.file.originalname }  );
          //formData.append('model',  req.body.model );
        try{
          let url = process.env.FILE_SERVER ;
          let responseBody = await axios.post( url , formData, {
                  headers: {
                  //Authorization: 'Bearer '+ process.env.OPENAI_API_KEY ,
                  'Content-Type': 'multipart/form-data'
                }
            })   ;

          res.json(responseBody.data );
          }catch(e){
            res.status( 400 ).json( {error: e } );
          }
        }else{
          res.status(400).json({'error':'uploader fail'});
        }
      }
    );
  }
  else{
    app.use('/openapi/v1/upload', authV2, upload.single('file'), (req, res) => {
    //res.send('文件上传成功！');
    res.setHeader('Content-type', 'application/json' );
    if(req.file.filename) res.json({ url:`/uploads/${formattedDate()}/${ req.file.filename  }`,created:Date.now() })
    else res.json({ error:`uploader fail`,created:Date.now() })
  });
  }
}else {
  app.use('/openapi/v1/upload',  (req, res) => {
    //res.send('文件上传成功！');
     res.json({ error:`server is no open uploader `,created:Date.now() })
  });
}
app.use('/uploads' , express.static('uploads'));

// R2Client function
const R2Client = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_KEY_ID;
  const accessKeySecret = process.env.R2_KEY_SECRET;
  const endpoint = new AWS.Endpoint(`https://${accountId}.r2.cloudflarestorage.com`);
  const s3 = new AWS.S3({
    endpoint: endpoint,
    region: 'auto',
    credentials: new AWS.Credentials(accessKeyId, accessKeySecret),
		signatureVersion: 'v4',
  });
  return s3;
};

// cloudflare R2 upload
app.post('/openapi/pre_signed', (req, res) => {
  const bucketName = process.env.R2_BUCKET_NAME;
  const domain = process.env.R2_DOMAIN;
  const s3 = R2Client();
  const fileName = uuidv4();
  const saveFile = `${new Date().toISOString().split('T')[0]}/${fileName}${req.body.file_name}`;

  const params = {
    Bucket: bucketName,
    Key: saveFile,
    ContentType: req.body.ContentType,
    Expires: 60 * 60, // 1 hour
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      res.status(500).json({
        status: 'Error',
        message: `Couldn't get presigned URL for PutObject: ${err.message}`
      });
      return;
    }

    res.json({
      status: 'Success',
      message: '',
      data: {
        up: url,
        url: `${domain}/${saveFile}`
      }
    });
  });
});

app.use(
  '/openapi/v1/audio/transcriptions',authV2,
  upload2.single('file'),
  async (req, res, next) => {
    //console.log( "boday",req.body ,  req.body.model );
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('file',  fileBuffer,  { filename:  req.file.originalname }  );
      formData.append('model',  req.body.model );
     try{
       let url = `${API_BASE_URL}/v1/audio/transcriptions` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ process.env.OPENAI_API_KEY ,
              'Content-Type': 'multipart/form-data',
              'Mj-Version': pkg.version
            }
        })   ;
        // console.log('responseBody', responseBody.data  );
       res.json(responseBody.data );
      }catch(e){
        //console.log('goog',e );
        res.status( 400 ).json( {error: e } );
      }

    }else{
      res.status(400).json({'error':'uploader fail'});
    }
  }
);

 

//代理openai 接口
app.use('/openapi' ,authV2, turnstileCheck, proxy(API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/openapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers['Authorization'] ='Bearer '+ process.env.OPENAI_API_KEY;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  //limit: '10mb'
}));

//代理sunoApi 接口 
app.use('/sunoapi' ,authV2, proxy(process.env.SUNO_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.SUNO_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.SUNO_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
}));


//代理luma 接口 
app.use('/luma' ,authV2, proxy(process.env.LUMA_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.LUMA_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.LUMA_KEY;
    //else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
}));


app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
