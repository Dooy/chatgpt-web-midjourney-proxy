import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { isNotEmptyString } from './utils/is';
import FormData  from 'form-data'
import  proxy from "express-http-proxy"
import pkg from '../package.json'

 const API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'

export const lumaProxy=proxy(process.env.LUMA_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.LUMA_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.LUMA_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const runwayProxy=proxy(process.env.RUNWAY_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.RUNWAY_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.RUNWAY_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

//runwaymlProxy

export const runwaymlProxy=proxy(process.env.RUNWAYML_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    let url =  req.originalUrl;
    let server= process.env.RUNWAYML_SERVER??  API_BASE_URL
    if( server.indexOf('runwayml.com')>-1 ){
        url= req.originalUrl.replace('/runwayml', '')
    }
    return url  //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.RUNWAYML_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.RUNWAYML_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    proxyReqOpts.headers['X-Runway-Version'] = '2024-11-06'; //'X-Runway-Version': 
    return proxyReqOpts;
  },
  
});

export const klingProxy=proxy(process.env.KLING_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.KLING_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.KLING_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const viggleProxy=proxy(process.env.VIGGLE_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.VIGGLE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VIGGLE_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})


export const ideoProxy=proxy(process.env.IDEO_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) { 
    if ( process.env.IDEO_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.IDEO_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})

export const pikaProxy=proxy(process.env.PIKA_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) { 
    if ( process.env.PIKA_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.PIKA_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})

export const pixverseProxy=proxy(process.env.PIXVERSE_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) { 
    if ( process.env.PIXVERSE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.PIXVERSE_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})




export const udioProxy=proxy(process.env.UDIO_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) { 
    if ( process.env.UDIO_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.UDIO_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})



//req, res, next
export const ideoProxyFileDo=async( req:Request, res:Response, next?:NextFunction)=>{ 
    console.log('req.originalUrl', req.originalUrl );
    let  API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'
    API_BASE_URL= process.env.IDEO_SERVER??  API_BASE_URL
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('image_file',  fileBuffer,  { filename:  req.file.originalname }  );
      formData.append('image_request',  req.body.image_request );
     try{
       let url = `${API_BASE_URL}${req.originalUrl}` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ (process.env.IDEO_KEY??process.env.OPENAI_API_KEY) ,
              'Content-Type': 'multipart/form-data',
              //'Mj-Version': pkg.version
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

export const viggleProxyFileDo= async( req:Request, res:Response, next?:NextFunction)=>{
    // if ( process.env.VIGGLE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VIGGLE_KEY;
    // else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    console.log('req.originalUrl', req.originalUrl );
    let  API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'
    API_BASE_URL= process.env.VIGGLE_SERVER??  API_BASE_URL
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('file',  fileBuffer,  { filename:  req.file.originalname }  );
     // formData.append('model',  req.body.model );
     try{
       let url = `${API_BASE_URL}${req.originalUrl}` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ (process.env.VIGGLE_KEY??process.env.OPENAI_API_KEY) ,
              'Content-Type': 'multipart/form-data',
              //'Mj-Version': pkg.version
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

export const sunoProxy=proxy(process.env.SUNO_SERVER??  API_BASE_URL, {
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
  
})


//主要转发接口
export const GptImageEdit = async (
	request: Request,
	response: Response,
	next?: NextFunction
) => {
	try {
		doGptImageEdit(request, response, next);
	} catch (e) {
	//mlog("error", "gpt.image.edit /v1/images/edits", e);
	}
};

const doGptImageEdit = async (
	req: Request,
	res: Response,
	next?: NextFunction
) => {
	const formData = new FormData();
	 
	const request = req;
	const response = res;

 
	const dd = {
		 
	};

	let url = API_BASE_URL

	let myKey =process.env.OPENAI_API_KEY;;
	// 添加其他字段

	try {
		for (let o in req.body) {
			try {
				//mlog("body2 ", o);
				formData.append(o, req.body[o]);
			} catch (error) {
				//mlog("body  error", o);
			}
		}

		if (req.files) {
			// 处理上传的文件
			req.files.forEach((file) => {
				// 判断是单文件还是多文件上传

				//mlog("fileName >>", file.fieldname);
				formData.append(file.fieldname, file.buffer, {
					filename: file.originalname,
					contentType: file.mimetype,
				});
			});
		}

		//验证IP百名单
		//await checkWhileIp( +mykey.user.uid,request );

		let rqUrl = url + "/v1/images/edits";
 

		let responseBody = await axios.post(rqUrl, formData, {
			headers: {
				Authorization: 'Bearer '+ myKey,
				"Content-Type": "multipart/form-data",
			},
		});
		res.status(responseBody.status).send(responseBody.data);

		const ss = { ...responseBody.data };
		if (ss.data && ss.data.length > 0) {
			for (let i = 0; i < ss.data.length; i++) {
				let o = ss.data[i];
				if (o.b64_json) {
					o.b64_json = "yes";
				}
				ss.data[i] = o;
			}
		}
		//dd.data = ss;
		//dd.status = responseBody.status;
	} catch (error) {
		if (error.response) {
			let responseBody = error.response;
			//let data = error.response.data;
			let dddata = responseBody.data ?? { dtail: "openai_hk_error" };
			let status = responseBody.status ?? 428;
			res.status( status ).send(dddata);
		} else {
			response.writeHead(405);

			let ss = error ? JSON.stringify(error) : "gate way error...";
			response.end(
				`{"error":{"message":"${ss}","type":"openai_hk_error","code":"gate_way_error"}}`
			);
			
		}
	}

	//http2mq("gpt-image-edit", dd);
};